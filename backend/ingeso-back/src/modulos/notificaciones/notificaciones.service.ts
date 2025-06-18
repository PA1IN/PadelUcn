import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacione.entity';
import { CreateResponse } from '../../common/helpers/create-response.helper';

export interface CrearNotificacionDto {
  titulo: string;
  mensaje: string;
  tipoEvento: string;
  idUsuario: number;
  idReserva?: number | null;
}

@Injectable()
export class NotificacionesService implements OnModuleInit {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionRepository: Repository<Notificacion>,
  ) {}

  
  async onModuleInit() {
    try {
      await this.notificacionRepository.query(`
        CREATE TABLE IF NOT EXISTS notificacion(
          id_notificacion SERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          mensaje TEXT NOT NULL,
          tipo_evento VARCHAR(50) NOT NULL,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          leida BOOLEAN DEFAULT FALSE,
          id_usuario INT NOT NULL,
          id_reserva INT,
          FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
          FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva)
        );
      `);
      console.log('Tabla notificacion verificada/creada');
    } catch (error) {
      console.log('Tabla notificacion ya existía o error menor');
    }
  }

  
  async create(crearNotificacionDto: CrearNotificacionDto) {
    try {
      const query = `
        INSERT INTO notificacion (titulo, mensaje, tipo_evento, id_usuario, id_reserva, leida)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      
      const values = [
        crearNotificacionDto.titulo,
        crearNotificacionDto.mensaje,
        crearNotificacionDto.tipoEvento,
        crearNotificacionDto.idUsuario,
        crearNotificacionDto.idReserva || null,
        false
      ];

      const resultado = await this.notificacionRepository.query(query, values);
      
      return CreateResponse(
        'Notificación creada exitosamente',
        resultado[0],
        'SUCCESS'
      );
    } catch (error) {
      console.error('Error al crear notificación:', error);
      return CreateResponse(
        'Error al crear notificación',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ OBTENER NOTIFICACIONES NO VISTAS
  async getNotificacionesNoVistas(idUsuario: number) {
    try {
      const query = `
        SELECT * FROM notificacion 
        WHERE id_usuario = $1 AND leida = false 
        ORDER BY fecha_creacion DESC;
      `;
      
      const noVistas = await this.notificacionRepository.query(query, [idUsuario]);

      return CreateResponse(
        `${noVistas.length} notificaciones no vistas encontradas`,
        noVistas,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener notificaciones no vistas',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ OBTENER HISTORIAL COMPLETO
  async getHistorialUsuario(idUsuario: number) {
    try {
      const query = `
        SELECT * FROM notificacion 
        WHERE id_usuario = $1 
        ORDER BY fecha_creacion DESC;
      `;
      
      const notificaciones = await this.notificacionRepository.query(query, [idUsuario]);

      return CreateResponse(
        `${notificaciones.length} notificaciones en historial`,
        notificaciones,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener historial de notificaciones',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ MARCAR COMO LEÍDA
  async marcarComoLeida(idNotificacion: number) {
    try {
      const query = `
        UPDATE notificacion 
        SET leida = true 
        WHERE id_notificacion = $1
        RETURNING *;
      `;
      
      const resultado = await this.notificacionRepository.query(query, [idNotificacion]);

      if (resultado.length === 0) {
        return CreateResponse(
          'Notificación no encontrada',
          null,
          'ERROR'
        );
      }

      return CreateResponse(
        'Notificación marcada como leída',
        resultado[0],
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al marcar notificación como leída',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ MARCAR TODAS COMO LEÍDAS
  async marcarTodasComoLeidas(idUsuario: number) {
    try {
      const query = `
        UPDATE notificacion 
        SET leida = true 
        WHERE id_usuario = $1 AND leida = false;
      `;
      
      await this.notificacionRepository.query(query, [idUsuario]);

      return CreateResponse(
        'Todas las notificaciones marcadas como leídas',
        { mensaje: 'Operación exitosa' },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al marcar todas las notificaciones como leídas',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ CONTAR NO VISTAS
  async contarNoVistas(idUsuario: number) {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM notificacion 
        WHERE id_usuario = $1 AND leida = false;
      `;
      
      const resultado = await this.notificacionRepository.query(query, [idUsuario]);
      const count = parseInt(resultado[0].count);

      return CreateResponse(
        'Conteo de notificaciones no vistas',
        { count },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al contar notificaciones no vistas',
        error.message,
        'ERROR'
      );
    }
  }
}
