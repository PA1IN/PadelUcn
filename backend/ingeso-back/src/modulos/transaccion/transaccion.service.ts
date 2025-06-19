import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { CreateResponse } from '../../common/helpers/create-response.helper';


export interface TransaccionCompleta {
  id_transaccion: number;
  fecha: string;
  reserva: {
    id_reserva: string;
    fecha: string;
    hora_inicio: string;
    hora_termino: string;
    usuario: {
      id_usuario: number;
      nombre: string;
      rut: string;
    };
    cancha: {
      nombre: string;
      id_cancha: number;
    };
  };
  boleta_equipamiento: {
    id_historial: number;
    cantidad: number;
    monto_total: number;
    equipamiento: {
      nombre: string;
      tipo: string;
      costo: number;
    };
  };
}

export interface EstadisticasTransaccion {
  totalTransacciones: number;
  clientesActivos: number;
  ingresosReservas: number;
  ingresosEquipamiento: number;
  ingresosTotales: number;
  diasConVentas: number;
}

export interface TransaccionPeriodo {
  fecha: string;
  total_transacciones: number;
  ingresos_reservas: number;
  ingresos_equipamiento: number;
  ingresos_totales: number;
}

@Injectable()
export class TransaccionService {
  constructor(
    @InjectRepository(Transaccion)
    private transaccionRepository: Repository<Transaccion>,
  ) {}

  
  async create(createTransaccionDto: CreateTransaccionDto) {
    try {
      const transaccionData: any = {
        fecha: createTransaccionDto.fecha || new Date()
      };

      
      if (createTransaccionDto.id_boleta_equipamiento && 
          createTransaccionDto.id_boleta_equipamiento !== null) {
        transaccionData.idBoletaEquipamiento = createTransaccionDto.id_boleta_equipamiento;
      }

      const transaccion = this.transaccionRepository.create(transaccionData);
      const savedTransaccion = await this.transaccionRepository.save(transaccion);

      return CreateResponse(
        'Transacción creada exitosamente',
        savedTransaccion,
        'CREATED'
      );
    } catch (error) {
      return CreateResponse(
        'Error al crear transacción: ' + error.message,
        null,
        'ERROR'
      );
    }
  }


  async findAllCompletas() {
    try {
      const query = `
        SELECT 
          t.id_transaccion,
          t.fecha,
          r.id_reserva,
          r.fecha as reserva_fecha,
          r.hora_inicio,
          r.hora_termino,
          u.id_usuario,
          u.nombre_usuario as nombre,
          u.rut,
          c.nombre as cancha_nombre,
          c.id_cancha,
          COALESCE(be.id_boleta, 0) as id_historial,
          COALESCE(be.cantidad, 0) as cantidad,
          COALESCE(be.monto_total, 0) as monto_total,
          COALESCE(e.nombre, '') as equipamiento_nombre,
          COALESCE(e.tipo, '') as equipamiento_tipo,
          COALESCE(e.costo, 0) as equipamiento_costo
        FROM transaccion t
        LEFT JOIN boleta_equipamiento be ON t.id_boleta_equipamiento = be.id_boleta  -- ✅ CORREGIDO
        LEFT JOIN reserva r ON be.id_reserva = r.id_reserva  
        LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN cancha c ON r.id_cancha = c.id_cancha
        LEFT JOIN equipamiento e ON be.id_equipamiento = e.id_equipamiento
        ORDER BY t.fecha DESC;
      `;

      const resultados = await this.transaccionRepository.query(query);
      
      if (resultados.length === 0) {
        return CreateResponse(
          'No se encontraron transacciones',
          [],
          'SUCCESS'
        );
      }

      // Transformar resultados
      const transaccionesCompletas = resultados.map(resultado => ({
        id_transaccion: resultado.id_transaccion,
        fecha: resultado.fecha,
        reserva: {
          id_reserva: resultado.id_reserva?.toString() || '',
          fecha: resultado.reserva_fecha || '',
          hora_inicio: resultado.hora_inicio || '',
          hora_termino: resultado.hora_termino || '',
          usuario: {
            id_usuario: resultado.id_usuario || 0,
            nombre: resultado.nombre || '',
            rut: resultado.rut || ''
          },
          cancha: {
            nombre: resultado.cancha_nombre || '',
            id_cancha: resultado.id_cancha || 0
          }
        },
        boleta_equipamiento: {
          id_historial: resultado.id_historial,
          cantidad: resultado.cantidad,
          monto_total: resultado.monto_total,
          equipamiento: {
            nombre: resultado.equipamiento_nombre,
            tipo: resultado.equipamiento_tipo,
            costo: resultado.equipamiento_costo
          }
        }
      }));

      return CreateResponse(
        `${transaccionesCompletas.length} transacciones encontradas`,
        transaccionesCompletas,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener transacciones: ' + error.message,
        [],
        'ERROR'
      );
    }
  }

  // obtener estadisticas para el admin
  async getEstadisticas() {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      const query = `
        SELECT 
          -- Reservas
          COUNT(DISTINCT CASE WHEN DATE(r.created_at) = $1 THEN r.id_reserva END) as cant_reservas_hoy,
          COUNT(DISTINCT CASE WHEN DATE(r.created_at) >= $2 THEN r.id_reserva END) as cant_reservas_mes,
          COUNT(DISTINCT CASE WHEN hr.estado = 'Pendiente' THEN r.id_reserva END) as cant_reservas_pendientes,
          COUNT(DISTINCT CASE WHEN hr.estado = 'Confirmada' THEN r.id_reserva END) as cant_reservas_confirmadas,
          
          -- Transacciones
          COUNT(DISTINCT CASE WHEN DATE(t.fecha) = $1 THEN t.id_transaccion END) as cant_transacciones_hoy,
          COUNT(DISTINCT CASE WHEN DATE(t.fecha) >= $2 THEN t.id_transaccion END) as cant_transacciones_mes,
          
          -- Ingresos
          SUM(CASE WHEN DATE(t.fecha) = $1 THEN COALESCE(be.monto_total, 0) ELSE 0 END) as ingresos_equipamiento_hoy,
          SUM(CASE WHEN DATE(t.fecha) >= $2 THEN COALESCE(be.monto_total, 0) ELSE 0 END) as ingresos_equipamiento_mes,
          SUM(CASE WHEN DATE(r.created_at) = $1 THEN COALESCE(c.valor, 0) ELSE 0 END) as ingresos_cancha_hoy,
          SUM(CASE WHEN DATE(r.created_at) >= $2 THEN COALESCE(c.valor, 0) ELSE 0 END) as ingresos_cancha_mes,
          
          -- Clientes activos
          COUNT(DISTINCT CASE WHEN DATE(r.created_at) >= $2 THEN r.id_usuario END) as clientes_activos
          
        FROM transaccion t
        LEFT JOIN boleta_equipamiento be ON t.id_boleta_equipamiento = be.id_boleta  -- ✅ CORREGIDO
        LEFT JOIN reserva r ON be.id_reserva = r.id_reserva  
        LEFT JOIN cancha c ON r.id_cancha = c.id_cancha
        LEFT JOIN historial_reserva hr ON r.id_reserva = hr.id_reserva
      `;

      const resultado = await this.transaccionRepository.query(query, [hoy, inicioMes]);
      
      if (resultado.length === 0) {
        return CreateResponse(
          'No se pudieron obtener estadísticas',
          {
            cant_reservas_hoy: 0,
            cant_reservas_mes: 0,
            cant_reservas_pendientes: 0,
            cant_reservas_confirmadas: 0,
            cant_transacciones_hoy: 0,
            cant_transacciones_mes: 0,
            ingresos_equipamiento_hoy: 0,
            ingresos_equipamiento_mes: 0,
            ingresos_cancha_hoy: 0,
            ingresos_cancha_mes: 0,
            clientes_activos: 0
          },
          'SUCCESS'
        );
      }

      const stats = resultado[0];
      
      // Calcular totales
      const ingresos_total_hoy = parseInt(stats.ingresos_equipamiento_hoy || 0) + parseInt(stats.ingresos_cancha_hoy || 0);
      const ingresos_total_mes = parseInt(stats.ingresos_equipamiento_mes || 0) + parseInt(stats.ingresos_cancha_mes || 0);

      const estadisticas = {
        cant_reservas_hoy: parseInt(stats.cant_reservas_hoy) || 0,
        cant_reservas_mes: parseInt(stats.cant_reservas_mes) || 0,
        cant_reservas_pendientes: parseInt(stats.cant_reservas_pendientes) || 0,
        cant_reservas_confirmadas: parseInt(stats.cant_reservas_confirmadas) || 0,
        cant_transacciones_hoy: parseInt(stats.cant_transacciones_hoy) || 0,
        cant_transacciones_mes: parseInt(stats.cant_transacciones_mes) || 0,
        ingresos_equipamiento_hoy: parseInt(stats.ingresos_equipamiento_hoy) || 0,
        ingresos_equipamiento_mes: parseInt(stats.ingresos_equipamiento_mes) || 0,
        ingresos_cancha_hoy: parseInt(stats.ingresos_cancha_hoy) || 0,
        ingresos_cancha_mes: parseInt(stats.ingresos_cancha_mes) || 0,
        ingresos_total_hoy,
        ingresos_total_mes,
        clientes_activos: parseInt(stats.clientes_activos) || 0
      };

      return CreateResponse(
        'Estadísticas obtenidas exitosamente',
        estadisticas,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener estadísticas: ' + error.message,
        null,
        'ERROR'
      );
    }
  }

  // obtener transacciones por periodo
  async findByPeriodo(fechaInicio: string, fechaFin: string) {
    try {
      const query = `
        SELECT 
          DATE(t.fecha) as fecha,
          COUNT(t.id_transaccion) as total_transacciones,
          SUM(COALESCE(c.valor, 0)) as ingresos_reservas,  -- ✅ USAR c.valor (cancha)
          SUM(COALESCE(be.monto_total, 0)) as ingresos_equipamiento,
          (SUM(COALESCE(c.valor, 0)) + SUM(COALESCE(be.monto_total, 0))) as ingresos_totales
        FROM transaccion t
        LEFT JOIN boleta_equipamiento be ON t.id_boleta_equipamiento = be.id_boleta
        LEFT JOIN reserva r ON be.id_reserva = r.id_reserva
        LEFT JOIN cancha c ON r.id_cancha = c.id_cancha
        WHERE DATE(t.fecha) BETWEEN $1 AND $2
        GROUP BY DATE(t.fecha)
        ORDER BY DATE(t.fecha) DESC;
      `;

      const resultados = await this.transaccionRepository.query(query, [fechaInicio, fechaFin]);

      return CreateResponse(
        `Transacciones del período ${fechaInicio} - ${fechaFin}`,
        resultados,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener transacciones por período: ' + error.message,
        [],
        'ERROR'
      );
    }
  }
}
