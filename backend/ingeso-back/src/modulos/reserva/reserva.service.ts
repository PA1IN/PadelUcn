import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';
import { HistorialReservaService } from './historial-reserva/historial-reserva.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    private historialReservaService: HistorialReservaService,
  ) {}async create(createReservaDto: CreateReservaDto): Promise<ApiResponse<Reserva>> {
    try {
      // Verificar disponibilidad de la cancha en el horario solicitado
      const fecha = new Date(createReservaDto.fecha);
      
      // Formatear la fecha para que solo tenga la parte de fecha (sin hora)
      const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      
      // Verificar traslape de horarios usando consulta SQL nativa
      // Buscar reservas para la misma cancha, el mismo día, y con horarios que se traslapen
      const existingReservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.cancha', 'cancha')
        .where('cancha.id = :idCancha', { idCancha: createReservaDto.id_cancha })
        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
        .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
          horaInicio: createReservaDto.hora_inicio,
          horaTermino: createReservaDto.hora_termino,
        })
        .getMany();

      if (existingReservas.length > 0) {
        throw new Error(`La cancha ID #${createReservaDto.id_cancha} no está disponible en el horario solicitado`);
      }

      // Verificar existencia del usuario y la cancha antes de crear la reserva
      // (Aquí idealmente se debería verificar en los servicios correspondientes)
      
      // Crear objeto reserva con los IDs correctos
      const newReserva = this.reservaRepository.create({
        fecha: fechaFormateada,
        hora_inicio: createReservaDto.hora_inicio,
        hora_termino: createReservaDto.hora_termino,
        idUsuario: createReservaDto.id_usuario,
        idCancha: createReservaDto.id_cancha
      });
      
      const savedReserva = await this.reservaRepository.save(newReserva);
      
      // Cargamos las relaciones para devolver una respuesta completa
      const reservaCompleta = await this.reservaRepository.findOne({
        where: { id: savedReserva.id },
        relations: ['usuario', 'cancha'],
      });
      
      // Crear entrada en el historial de reserva con estado inicial "Pendiente"
      try {
        await this.historialReservaService.create({
          estado: 'Pendiente',
          idReserva: savedReserva.id,
          idUsuario: createReservaDto.id_usuario
        });
      } catch (historialError) {
        console.error('Error al crear historial de reserva:', historialError);
        // No bloqueamos la creación de la reserva si falla el historial
      }

      return CreateResponse(
        `Reserva #${savedReserva.id} creada exitosamente para la cancha ID #${createReservaDto.id_cancha}`, 
        reservaCompleta, 
        'CREATED'
      );
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear la reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findAll(): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        relations: ['usuario', 'cancha', 'historial'],
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
        where: { id: id },
        relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'historial'],
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
        CreateResponse('Error al obtener la reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findByUsuario(rutUsuario: string): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        where: { usuario: { rut: rutUsuario } },
        relations: ['cancha', 'boletas', 'boletas.equipamiento'],
      });
      
      return CreateResponse('Reservas del usuario obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener las reservas del usuario', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findByCancha(numeroCancha: number): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        where: { cancha: { numero: numeroCancha } },
        relations: ['usuario', 'boletas', 'historial'],
        order: { fecha: 'ASC', hora_inicio: 'ASC' },
      });
      
      return CreateResponse('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener las reservas de la cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id: id },
        relations: ['usuario', 'cancha'],
      });
      
      if (!reserva) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      // Si se está cambiando la hora o fecha o cancha, verificar disponibilidad
      if (updateReservaDto.fecha || updateReservaDto.hora_inicio || updateReservaDto.hora_termino || updateReservaDto.numero_cancha) {
        const numeroCancha = updateReservaDto.numero_cancha || reserva.cancha.numero;
        const fechaStr = updateReservaDto.fecha || reserva.fecha.toISOString().split('T')[0];
        const fecha = new Date(fechaStr);
        
        // Formatear la fecha para que solo tenga la parte de fecha (sin hora)
        const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        
        const horaInicio = updateReservaDto.hora_inicio || reserva.hora_inicio;
        const horaTermino = updateReservaDto.hora_termino || reserva.hora_termino;
        
        // Verificar traslapes con otras reservas (excluyendo la reserva actual)
        const existingReservas = await this.reservaRepository
          .createQueryBuilder('reserva')
          .innerJoin('reserva.cancha', 'cancha')
          .where('cancha.numero = :numeroCancha', { numeroCancha })
          .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
          .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
            horaInicio,
            horaTermino,
          })
          .andWhere('reserva.id != :id', { id })
          .getMany();
        
        if (existingReservas.length > 0) {
          throw new Error(`La cancha #${numeroCancha} no está disponible en el horario solicitado`);
        }
      }
      
      // Convertir fecha a Date si está presente
      if (updateReservaDto.fecha) {
        const fecha = new Date(updateReservaDto.fecha);
        updateReservaDto.fecha = new Date(
          fecha.getFullYear(), fecha.getMonth(), fecha.getDate()
        ) as any;
      }
        await this.reservaRepository.update(id, updateReservaDto);
      const updatedReserva = await this.reservaRepository.findOne({
        where: { id: id },
        relations: ['usuario', 'cancha', 'historial'],
      });
      
      if (!updatedReserva) {
        throw new Error(`Error al obtener reserva actualizada con ID ${id}`);
      }
      
      return CreateResponse('Reserva actualizada exitosamente', updatedReserva, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar la reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id: id },
        relations: ['boletas'],
      });
      
      if (!reserva) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      await this.reservaRepository.delete(id);
      return CreateResponse('Reserva eliminada exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar la reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verificarDisponibilidad(
    numeroCancha: number, 
    fechaStr: string, 
    horaInicio: string, 
    horaTermino: string
  ): Promise<ApiResponse<{disponible: boolean}>> {
    try {
      const fecha = new Date(fechaStr);
      
      // Formatear la fecha para que solo tenga la parte de fecha (sin hora)
      const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      
      // Verificar si hay reservas que se traslapen con el horario solicitado
      const existingReservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.cancha', 'cancha')
        .where('cancha.numero = :numeroCancha', { numeroCancha })
        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
        .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
          horaInicio,
          horaTermino,
        })
        .getMany();
      
      const disponible = existingReservas.length === 0;
      
      return CreateResponse(
        disponible 
          ? `La cancha #${numeroCancha} está disponible en el horario solicitado` 
          : `La cancha #${numeroCancha} no está disponible en el horario solicitado`,
        { disponible },
        'OK'
      );
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al verificar disponibilidad', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
    async obtenerHorariosDisponibles(
    numeroCancha: number,
    fechaStr: string
  ): Promise<ApiResponse<{horariosDisponibles: Array<{inicio: string, fin: string}>}>> {
    try {
      const fecha = new Date(fechaStr);
      
      // Formatear la fecha para que solo tenga la parte de fecha (sin hora)
      const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      
      // Obtener todas las reservas para la cancha en esa fecha
      const reservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.cancha', 'cancha')
        .where('cancha.numero = :numeroCancha', { numeroCancha })
        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
        .orderBy('reserva.hora_inicio', 'ASC')
        .select(['reserva.hora_inicio', 'reserva.hora_termino'])
        .getMany();
      
      // Horarios de operación de la cancha (podría ser configurable)
      const horaApertura = '08:00:00';
      const horaCierre = '22:00:00';
      
      // Generar intervalos de 1 hora (típicamente para reservas de pádel)
      const horariosDisponibles: Array<{inicio: string, fin: string}> = [];
      let horaActual = horaApertura;
      
      while (horaActual < horaCierre) {
        // Calcular la hora de fin (1 hora después del inicio)
        const [horas, minutos] = horaActual.split(':').map(Number);
        let horaFinNum = horas + 1;
        const horaFin = `${horaFinNum.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`;
        
        // Verificar si este intervalo está ocupado por alguna reserva
        const ocupado = reservas.some(reserva => 
          (horaActual < reserva.hora_termino && horaFin > reserva.hora_inicio)
        );
        
        // Si no está ocupado, agregarlo a los horarios disponibles
        if (!ocupado && horaFin <= horaCierre) {
          horariosDisponibles.push({
            inicio: horaActual,
            fin: horaFin
          });
        }
        
        // Avanzar a la siguiente hora
        horaActual = horaFin;
      }
      
      return CreateResponse(
        `Horarios disponibles para la cancha #${numeroCancha} en la fecha ${fechaStr}`,
        { horariosDisponibles },
        'OK'
      );
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener horarios disponibles', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async obtenerEstadisticas(): Promise<ApiResponse<any>> {
    try {
      // Obtener cantidad total de reservas
      const totalReservas = await this.reservaRepository.count();
      
      // Obtener reservas por cancha
      const reservasPorCancha = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.cancha', 'cancha')
        .select('cancha.numero', 'numeroCancha')
        .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
        .groupBy('cancha.numero')
        .orderBy('totalReservas', 'DESC')
        .getRawMany();
      
      // Obtener usuarios con más reservas
      const usuariosConMasReservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.usuario', 'usuario')
        .select('usuario.rut', 'rutUsuario')
        .addSelect('usuario.nombre', 'nombreUsuario')
        .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
        .groupBy('usuario.rut, usuario.nombre')
        .orderBy('totalReservas', 'DESC')
        .limit(10)
        .getRawMany();
      
      // Obtener reservas por día de la semana
      const reservasPorDia = await this.reservaRepository
        .createQueryBuilder('reserva')
        .select("TO_CHAR(reserva.fecha, 'Day')", 'diaSemana')
        .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
        .groupBy("TO_CHAR(reserva.fecha, 'Day')")
        .orderBy('totalReservas', 'DESC')
        .getRawMany();
      
      // Obtener horas más solicitadas
      const horasMasSolicitadas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .select('reserva.hora_inicio', 'hora')
        .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
        .groupBy('reserva.hora_inicio')
        .orderBy('totalReservas', 'DESC')
        .limit(5)
        .getRawMany();
      
      const estadisticas = {
        totalReservas,
        reservasPorCancha,
        usuariosConMasReservas,
        reservasPorDia,
        horasMasSolicitadas
      };
      
      return CreateResponse('Estadísticas obtenidas exitosamente', estadisticas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener estadísticas', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByIdForCheckout(id: number): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({ where: { id: id } });
      
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
        CreateResponse('Error al obtener la reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
