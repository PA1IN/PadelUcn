import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { HistorialReserva } from './entities/historial-reserva.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';
import { UserService } from '../user/user.service';
import { CanchasService } from '../canchas/canchas.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(HistorialReserva)
    private historialRepository: Repository<HistorialReserva>,
    private userService: UserService,
    private canchasService: CanchasService,
  ) {}

  async create(createReservaDto: CreateReservaDto, usuarioId: number): Promise<ApiResponse<Reserva>> {
    try {
      // Verificar si la cancha existe
      const canchaResponse = await this.canchasService.findOne(createReservaDto.canchaId);
      if (!canchaResponse.data) {
        throw new Error(`La cancha con ID ${createReservaDto.canchaId} no existe`);
      }
      const cancha = canchaResponse.data;
      
      // Verificar si la cancha está en mantenimiento
      if (cancha.mantenimiento) {
        throw new Error(`La cancha ${cancha.id} está en mantenimiento y no está disponible para reservas`);
      }
        // Verificar si el usuario existe
      if (!createReservaDto.rutUsuario) {
        throw new Error('El RUT del usuario es requerido');
      }
      const userResponse = await this.userService.findOne(createReservaDto.rutUsuario);
      if (!userResponse.data) {
        throw new Error(`El usuario con RUT ${createReservaDto.rutUsuario} no existe`);
      }
      const user = userResponse.data;
      
      // Verificar si la fecha y hora están disponibles
      const disponible = await this.verificarDisponibilidad(
        createReservaDto.canchaId,
        createReservaDto.fecha,
        createReservaDto.horaInicio,
        createReservaDto.horaTermino
      );
      
      if (!disponible.data) {
        throw new Error('La cancha no está disponible en el horario seleccionado');
      }
      
      // Calcular el costo de la reserva
      const costo = cancha.valor;
      
      // Verificar si el usuario tiene saldo suficiente
      if (user.saldo < costo) {
        throw new Error(`Saldo insuficiente. La reserva cuesta ${costo} y el usuario tiene ${user.saldo}`);
      }
      
      // Restar el saldo al usuario
      await this.userService.update(user.rut, { saldo: user.saldo - costo });
      
      // Crear la reserva
      const reserva = this.reservaRepository.create({
        fecha: new Date(createReservaDto.fecha),
        horaInicio: createReservaDto.horaInicio,
        horaTermino: createReservaDto.horaTermino,
        canchaId: createReservaDto.canchaId,
        usuarioId: user.id,
      });
      
      const savedReserva = await this.reservaRepository.save(reserva);
      
      // Registrar en el historial
      const historial = this.historialRepository.create({
        estado: 'Pendiente',
        reservaId: savedReserva.id,
        usuarioId: user.id,
      });
      
      await this.historialRepository.save(historial);
      
      return CreateResponse('Reserva creada exitosamente', savedReserva, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        relations: ['usuario', 'cancha'],
      });
      return CreateResponse('Reservas obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener reservas', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id },
        relations: ['usuario', 'cancha'],
      });
      
      if (!reserva) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      return CreateResponse('Reserva obtenida exitosamente', reserva, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateReservaDto: UpdateReservaDto, usuarioId: number): Promise<ApiResponse<Reserva>> {
    try {
      const reservaResponse = await this.findOne(id);
      if (!reservaResponse.data) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      const reservaExistente = reservaResponse.data;
      
      // Si se actualiza la cancha o la fecha/hora, verificar disponibilidad
      if (
        updateReservaDto.canchaId || 
        updateReservaDto.fecha || 
        updateReservaDto.horaInicio || 
        updateReservaDto.horaTermino
      ) {
        const canchaId = updateReservaDto.canchaId || reservaExistente.canchaId;
        const fecha = updateReservaDto.fecha || 
          (reservaExistente.fecha instanceof Date ? 
            reservaExistente.fecha.toISOString().split('T')[0] : 
            String(reservaExistente.fecha));
            
        const horaInicio = updateReservaDto.horaInicio || reservaExistente.horaInicio;
        const horaTermino = updateReservaDto.horaTermino || reservaExistente.horaTermino;
        
        const disponible = await this.verificarDisponibilidad(
          canchaId,
          fecha,
          horaInicio,
          horaTermino,
          id // Excluir la reserva actual de la verificación
        );
        
        if (!disponible.data) {
          throw new Error('La cancha no está disponible en el horario seleccionado');
        }
      }
      
      await this.reservaRepository.update(id, updateReservaDto);
      const updatedReserva = await this.reservaRepository.findOne({
        where: { id },
        relations: ['usuario', 'cancha'],
      });
      
      // Registrar en el historial
      const historial = this.historialRepository.create({
        estado: 'Modificado',
        reservaId: id,
        usuarioId: usuarioId,
      });
      
      await this.historialRepository.save(historial);
      
      return CreateResponse('Reserva actualizada exitosamente', updatedReserva, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelar(id: number, usuarioId: number): Promise<ApiResponse<null>> {
    try {
      const reservaResponse = await this.findOne(id);
      if (!reservaResponse.data) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      const reserva = reservaResponse.data;
      
      // Si la reserva ya pasó, no se puede cancelar
      const fechaActual = new Date();
      const fechaReserva = new Date(reserva.fecha);
      
      // Handle the case where horaInicio might be a Date object or a string
      let horaInicioStr: string = '';
      let horas = 0;
      let minutos = 0;
        if (typeof reserva.horaInicio === 'string') {
        horaInicioStr = reserva.horaInicio;
        const horasParts = horaInicioStr.split(':');
        if (horasParts && horasParts.length >= 2) {
          horas = parseInt(horasParts[0], 10);
          minutos = parseInt(horasParts[1], 10);
        }
      } else if (reserva.horaInicio instanceof Date) {
        horas = reserva.horaInicio.getHours();
        minutos = reserva.horaInicio.getMinutes();
        horaInicioStr = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`;
      }
      
      fechaReserva.setHours(horas, minutos);
      
      if (fechaReserva < fechaActual) {
        throw new Error('No se puede cancelar una reserva que ya pasó');
      }
      
      // Devolver el saldo al usuario
      const canchaResponse = await this.canchasService.findOne(reserva.canchaId);
      const cancha = canchaResponse.data;
      
      // Get the user data
      let userResponse;
      if (reserva.usuario && reserva.usuario.rut) {
        userResponse = await this.userService.findByRut(reserva.usuario.rut);
      }
      
      // Reembolsar el 80% del costo si la cancelación es con más de 24 horas de anticipación
      const MS_POR_DIA = 24 * 60 * 60 * 1000;
      const valorCancha = cancha ? cancha.valor : 0;
      const reembolso = fechaReserva.getTime() - fechaActual.getTime() > MS_POR_DIA
        ? valorCancha * 0.8
        : valorCancha * 0.5; // Solo 50% si es con menos de 24 horas
        
      // Update user balance
      if (userResponse) {
        if ('data' in userResponse && userResponse.data) {
          await this.userService.update(userResponse.data.rut, {
            saldo: userResponse.data.saldo + Math.floor(reembolso)
          });
        } else if ('rut' in userResponse) {
          await this.userService.update(userResponse.rut, {
            saldo: userResponse.saldo + Math.floor(reembolso)
          });
        }
      } else if (reserva.usuario && reserva.usuario.rut) {
        await this.userService.update(reserva.usuario.rut, {
          saldo: (reserva.usuario.saldo || 0) + Math.floor(reembolso)
        });
      }
      
      // Registrar en el historial
      const historial = this.historialRepository.create({
        estado: 'Cancelado',
        reservaId: id,
        usuarioId: usuarioId,
      });
      
      await this.historialRepository.save(historial);
      
      // Eliminar la reserva
      await this.reservaRepository.delete(id);
      
      return CreateResponse('Reserva cancelada exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al cancelar reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByUsuario(rut: string): Promise<ApiResponse<Reserva[]>> {
    try {
      const userResponse = await this.userService.findOne(rut);
      if (!userResponse.data) {
        throw new Error(`No se encontró un usuario con el RUT ${rut}`);
      }
      const user = userResponse.data;
      
      const reservas = await this.reservaRepository.find({
        where: { usuarioId: user.id },
        relations: ['cancha'],
      });
      
      return CreateResponse('Reservas del usuario obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Usuario no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener reservas del usuario', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCancha(id: number): Promise<ApiResponse<Reserva[]>> {
    try {
      const canchaResponse = await this.canchasService.findOne(id);
      if (!canchaResponse.data) {
        throw new Error(`No se encontró una cancha con el ID ${id}`);
      }
      
      const reservas = await this.reservaRepository.find({
        where: { canchaId: id },
        relations: ['usuario'],
      });
      
      return CreateResponse('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Cancha no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener reservas de la cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verificarDisponibilidad(
    canchaId: number,
    fecha: string,
    horaInicio: string | Date,
    horaTermino: string | Date,
    reservaIdExcluir?: number
  ): Promise<ApiResponse<boolean>> {
    try {
      // Verificar si la cancha existe
      const canchaResponse = await this.canchasService.findOne(canchaId);
      if (!canchaResponse.data) {
        throw new Error(`La cancha con ID ${canchaId} no existe`);
      }
      
      // Verificar si la cancha está en mantenimiento
      if (canchaResponse.data.mantenimiento) {
        return CreateResponse('Cancha en mantenimiento', false, 'OK');
      }
      
      // Obtener las reservas para la fecha y cancha especificadas
      let query = this.reservaRepository.createQueryBuilder('reserva')
        .where('reserva.fecha = :fecha', { fecha })
        .andWhere('reserva.canchaId = :canchaId', { canchaId });
      
      if (reservaIdExcluir) {
        query = query.andWhere('reserva.id != :reservaId', { reservaId: reservaIdExcluir });
      }
      
      const reservasExistentes = await query.getMany();
      
      // Verificar si hay conflictos de horarios
      for (const reserva of reservasExistentes) {
        // Handle both string and Date types for horaInicio and horaTermino
        let horaInicioStr: string;
        if (typeof reserva.horaInicio === 'string') {
          horaInicioStr = reserva.horaInicio;
        } else if (reserva.horaInicio instanceof Date) {
          horaInicioStr = reserva.horaInicio.toTimeString().split(' ')[0];
        } else {
          horaInicioStr = '00:00:00';
        }
        
        let horaTerminoStr: string;
        if (typeof reserva.horaTermino === 'string') {
          horaTerminoStr = reserva.horaTermino;
        } else if (reserva.horaTermino instanceof Date) {
          horaTerminoStr = reserva.horaTermino.toTimeString().split(' ')[0];
        } else {
          horaTerminoStr = '00:00:00';
        }
          
        let horaInicioNuevoStr: string;
        if (typeof horaInicio === 'string') {
          horaInicioNuevoStr = horaInicio;
        } else if (horaInicio instanceof Date) {
          horaInicioNuevoStr = horaInicio.toTimeString().split(' ')[0];
        } else {
          horaInicioNuevoStr = '00:00:00';
        }
          
        let horaTerminoNuevoStr: string;
        if (typeof horaTermino === 'string') {
          horaTerminoNuevoStr = horaTermino;
        } else if (horaTermino instanceof Date) {
          horaTerminoNuevoStr = horaTermino.toTimeString().split(' ')[0];
        } else {
          horaTerminoNuevoStr = '00:00:00';
        }
        
        const inicioExistente = new Date(`${fecha}T${horaInicioStr}`);
        const terminoExistente = new Date(`${fecha}T${horaTerminoStr}`);
        const inicioNuevo = new Date(`${fecha}T${horaInicioNuevoStr}`);
        const terminoNuevo = new Date(`${fecha}T${horaTerminoNuevoStr}`);
        
        // Verificar si hay superposición
        if (
          (inicioNuevo < terminoExistente && inicioExistente < terminoNuevo) || 
          (inicioExistente < terminoNuevo && inicioNuevo < terminoExistente)
        ) {
          return CreateResponse('Horario no disponible', false, 'OK');
        }
      }
      
      return CreateResponse('Horario disponible', true, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al verificar disponibilidad', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerHorariosDisponibles(canchaId: number, fecha: string): Promise<ApiResponse<any>> {
    try {
      // Verificar si la cancha existe
      const canchaResponse = await this.canchasService.findOne(canchaId);
      if (!canchaResponse.data) {
        throw new Error(`La cancha con ID ${canchaId} no existe`);
      }
      
      // Verificar si la cancha está en mantenimiento
      if (canchaResponse.data.mantenimiento) {
        return CreateResponse('Cancha en mantenimiento', { disponibles: [] }, 'OK');
      }
      
      // Obtener las reservas para la fecha y cancha especificadas
      const reservasExistentes = await this.reservaRepository.find({
        where: {
          fecha: new Date(fecha),
          canchaId,
        },
      });
      
      // Definir los horarios disponibles (de 8:00 a 22:00, en bloques de 1 hora)
      const horariosDisponibles: { horaInicio: string, horaTermino: string }[] = [];
      const horaInicio = 8;
      const horaFin = 22;
      
      for (let hora = horaInicio; hora < horaFin; hora++) {
        const inicioBloque = `${hora.toString().padStart(2, '0')}:00:00`;
        const finBloque = `${(hora + 1).toString().padStart(2, '0')}:00:00`;
        
        // Verificar si el bloque está disponible
        let bloqueDisponible = true;
        
        for (const reserva of reservasExistentes) {
          // Convert reserva.horaInicio and reserva.horaTermino to string if they're dates
          let inicioExistenteStr: string;
          if (typeof reserva.horaInicio === 'string') {
            inicioExistenteStr = reserva.horaInicio;
          } else if (reserva.horaInicio instanceof Date) {
            inicioExistenteStr = reserva.horaInicio.toTimeString().split(' ')[0];
          } else {
            inicioExistenteStr = '00:00:00';
          }
            
          let terminoExistenteStr: string;
          if (typeof reserva.horaTermino === 'string') {
            terminoExistenteStr = reserva.horaTermino;
          } else if (reserva.horaTermino instanceof Date) {
            terminoExistenteStr = reserva.horaTermino.toTimeString().split(' ')[0];
          } else {
            terminoExistenteStr = '00:00:00';
          }
          
          // Convert to Date objects for comparison
          const inicioExistente = new Date(`${fecha}T${inicioExistenteStr}`);
          const terminoExistente = new Date(`${fecha}T${terminoExistenteStr}`);
          const inicioBloqueDate = new Date(`${fecha}T${inicioBloque}`);
          const finBloqueDate = new Date(`${fecha}T${finBloque}`);
          
          // Verificar si hay superposición
          if (
            (inicioBloqueDate < terminoExistente && inicioExistente < finBloqueDate) || 
            (inicioExistente < finBloqueDate && inicioBloqueDate < terminoExistente)
          ) {
            bloqueDisponible = false;
            break;
          }
        }
        
        if (bloqueDisponible) {
          horariosDisponibles.push({
            horaInicio: inicioBloque,
            horaTermino: finBloque,
          });
        }
      }
      
      return CreateResponse('Horarios disponibles obtenidos exitosamente', { disponibles: horariosDisponibles }, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener horarios disponibles', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerEstadisticas(): Promise<ApiResponse<any>> {
    try {
      // Obtener todas las reservas con sus relaciones
      const reservas = await this.reservaRepository.find({
        relations: ['cancha', 'usuario'],
      });
      
      // Calcular estadísticas
      const estadisticas = {
        totalReservas: reservas.length,
        reservasPorCancha: {} as Record<string, { nombreCancha: string; total: number; ingresos: number }>,
        reservasPorUsuario: {} as Record<string, { nombreUsuario: string; total: number; gastos: number }>,
        ingresosTotales: 0,
      };
      
      reservas.forEach(reserva => {
        // Ensure cancha and usuario exist before accessing their properties
        if (!reserva.cancha || !reserva.usuario) return;
        
        const canchaId = String(reserva.cancha.id);
        const usuarioRut = reserva.usuario.rut;
        
        // Estadísticas por cancha
        if (!estadisticas.reservasPorCancha[canchaId]) {
          estadisticas.reservasPorCancha[canchaId] = {
            nombreCancha: reserva.cancha.nombre,
            total: 0,
            ingresos: 0,
          };
        }
        estadisticas.reservasPorCancha[canchaId].total++;
        estadisticas.reservasPorCancha[canchaId].ingresos += reserva.cancha.valor;
        
        // Estadísticas por usuario
        if (!estadisticas.reservasPorUsuario[usuarioRut]) {
          estadisticas.reservasPorUsuario[usuarioRut] = {
            nombreUsuario: reserva.usuario.nombre,
            total: 0,
            gastos: 0,
          };
        }
        estadisticas.reservasPorUsuario[usuarioRut].total++;
        estadisticas.reservasPorUsuario[usuarioRut].gastos += reserva.cancha.valor;
        
        // Ingresos totales
        estadisticas.ingresosTotales += reserva.cancha.valor;
      });
      
      return CreateResponse('Estadísticas obtenidas exitosamente', estadisticas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener estadísticas', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerHistorial(id: number): Promise<ApiResponse<HistorialReserva[]>> {
    try {
      const reservaResponse = await this.findOne(id);
      if (!reservaResponse.data) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      const historial = await this.historialRepository.find({
        where: { reservaId: id },
        relations: ['usuario'],
        order: { fechaEstado: 'DESC' },
      });
      
      return CreateResponse('Historial de reserva obtenido exitosamente', historial, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener historial de reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}