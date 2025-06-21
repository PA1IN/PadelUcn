import { 
  HttpException, 
  HttpStatus, 
  Injectable, 
  BadRequestException,
  ForbiddenException,
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { Cancha } from '../cancha/entities/cancha.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Reserva } from './entities/reserva.entity';
import { CreateResponse } from '../../utils/api-response.util';
import { HistorialReservaService } from '../historial-reserva/historial-reserva.service';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Equipamiento } from '../equipamiento/entities/equipamiento.entity';
import { Jugador } from '../jugador/entities/jugador.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { TransaccionService } from '../transaccion/transaccion.service';
import { CreateTransaccionDto } from '../transaccion/dto/create-transaccion.dto';
import { EstadoReserva } from './entities/reserva.entity';
import { CanchaService } from '../cancha/cancha.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cancha)
    private readonly canchaRepository: Repository<Cancha>,
    @InjectRepository(BoletaEquipamiento)
    private readonly boletaEquipamientoRepository: Repository<BoletaEquipamiento>,
    @InjectRepository(Equipamiento)
    private readonly equipamientoRepository: Repository<Equipamiento>,
    @InjectRepository(Jugador)
    private readonly jugadorRepository: Repository<Jugador>,
    private historialReservaService: HistorialReservaService,
    private readonly notificacionesService: NotificacionesService,
    private readonly transaccionService: TransaccionService, 
    private readonly canchaService: CanchaService,
  ) {}

  // ✅ MÉTODO CREATE PRINCIPAL (MANTENER SOLO ESTE)
  async create(createReservaDto: CreateReservaDto, isAdmin: boolean = false): Promise<ApiResponse<Reserva>> {
    try {
      const fecha = new Date(createReservaDto.fecha);
      const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      const today = new Date();
      const dayOfWeek = fecha.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

      // 1. Validar que la reserva sea de lunes a viernes
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        throw new BadRequestException('Las reservas solo están disponibles de lunes a viernes');
      }

      // Validar que la reserva sea con 1 semana de anticipación (a menos que sea admin)
      if (!isAdmin) {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);
        
        if (fecha < oneWeekFromNow) {
          throw new BadRequestException('Las reservas deben hacerse con al menos 1 semana de anticipación');
        }
      }

      // 3. Validar que el horario sea entre 8:00 y 20:00
      const horaInicio = createReservaDto.hora_inicio.split(':').map(Number);
      const horaTermino = createReservaDto.hora_termino.split(':').map(Number);
      
      const horaInicioNum = horaInicio[0] + horaInicio[1]/60;
      const horaTerminoNum = horaTermino[0] + horaTermino[1]/60;
      
      if (horaInicioNum < 8 || horaTerminoNum > 20) {
        throw new BadRequestException('El horario de reservas es de 08:00 a 20:00');
      }

      // 4. Validar que la duración sea entre 90 y 180 minutos
      const duracionMinutos = (horaTerminoNum - horaInicioNum) * 60;
      
      if (duracionMinutos < 90 || duracionMinutos > 180) {
        throw new BadRequestException('La duración de la reserva debe ser entre 90 y 180 minutos');
      }

      // 5. Verificar disponibilidad de la cancha
      const existingReservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.cancha', 'cancha')
        .where('cancha.numero = :numeroCancha', { numeroCancha: createReservaDto.numero_cancha })
        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
        .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
          horaInicio: createReservaDto.hora_inicio,
          horaTermino: createReservaDto.hora_termino,
        })
        .getMany();

      if (existingReservas.length > 0) {
        throw new BadRequestException(`La cancha #${createReservaDto.numero_cancha} no está disponible en el horario solicitado`);
      }

      // 6. Obtener el usuario
      const usuario = await this.usuarioRepository.findOne({ where: { rut: createReservaDto.rut_usuario } });
      if (!usuario) {
        throw new BadRequestException(`Usuario con rut ${createReservaDto.rut_usuario} no encontrado`);
      }

      // 7. Verificar que el usuario no exceda 180 min de reserva diarios
      if (!isAdmin) {
        const reservasUsuarioDia = await this.reservaRepository.find({
          where: {
            usuario: { id_usuario: usuario.id_usuario },
            fecha: fechaFormateada
          }
        });

        let minutosReservadosHoy = 0;
        for (const reserva of reservasUsuarioDia) {
          const inicio = reserva.hora_inicio.split(':').map(Number);
          const fin = reserva.hora_termino.split(':').map(Number);
          const minutos = ((fin[0] * 60 + fin[1]) - (inicio[0] * 60 + inicio[1]));
          minutosReservadosHoy += minutos;
        }

        if (minutosReservadosHoy + duracionMinutos > 180) {
          throw new BadRequestException(`No puede reservar más de 180 minutos por día (ya tiene ${minutosReservadosHoy} minutos reservados)`);
        }
      }

      // 8. Verificar que el usuario no tenga reservas concurrentes
      const reservasConcurrentes = await this.reservaRepository
        .createQueryBuilder('reserva')
        .innerJoin('reserva.usuario', 'usuario')
        .where('usuario.id_usuario = :idUsuario', { idUsuario: usuario.id_usuario })
        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
        .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
          horaInicio: createReservaDto.hora_inicio,
          horaTermino: createReservaDto.hora_termino,
        })
        .getMany();
      
      if (reservasConcurrentes.length > 0) {
        throw new BadRequestException('Ya tiene una reserva en ese horario');
      }

      //  Obtener la cancha
      const cancha = await this.canchaRepository.findOne({ where: { numero: createReservaDto.numero_cancha } });
      if (!cancha) {
        throw new BadRequestException(`Cancha número ${createReservaDto.numero_cancha} no encontrada`);
      }      
      const costoReserva = cancha.valor * (duracionMinutos / 60);

      // Verificar que el usuario tenga saldo suficiente
      if (!isAdmin && usuario.saldo < costoReserva) {
        throw new BadRequestException(`Saldo insuficiente para realizar la reserva. Saldo actual: $${usuario.saldo}, Costo: $${costoReserva}`);
      }

      //Crear la reserva
      const newReserva = this.reservaRepository.create({
        fecha: fechaFormateada,
        hora_inicio: createReservaDto.hora_inicio,
        hora_termino: createReservaDto.hora_termino,
        estado: 'PENDIENTE',
        usuario,
        cancha,
      });

      const savedReserva = await this.reservaRepository.save(newReserva);

      //Procesar el pago (descontar del saldo) si no es admin
      if (!isAdmin) {
        usuario.saldo -= costoReserva;
        await this.usuarioRepository.save(usuario);
      }      //Crear el historial de la reserva
      try {
        await this.historialReservaService.create({
          estado: 'Pendiente',
          idReserva: savedReserva.id,
          idUsuario: usuario.id_usuario
        });
      } catch (historialError) {
        console.error('Error al crear historial de reserva:', historialError);
      }

      // Procesar los jugadores
      if (Array.isArray(createReservaDto.jugadores) && createReservaDto.jugadores.length > 0) {
        for (const jugadorDto of createReservaDto.jugadores) {
          const nuevoJugador = this.jugadorRepository.create({
            nombre: jugadorDto.nombre,
            apellido: jugadorDto.apellido,
            rut: jugadorDto.rut,
            edad: jugadorDto.edad,
            reserva: { id: jugadorDto.id_reserva }
          });
          
          await this.jugadorRepository.save(nuevoJugador);
        }
      }      //Procesar el equipamiento si se proporcionó
      let costoTotalEquipamiento = 0;
      if (Array.isArray(createReservaDto.equipamiento) && createReservaDto.equipamiento.length > 0) {
        for (const item of createReservaDto.equipamiento) {
          const equipamiento = await this.equipamientoRepository.findOne({
            where: { id: item.id } // ✅ USAR 'id' NO 'id_equipamiento'
          });

          if (!equipamiento) {
            throw new BadRequestException(`Equipamiento con ID ${item.id} no encontrado`);
          }

          // Verificar stock
          if (equipamiento.stock < item.cantidad) {
            throw new BadRequestException(`Stock insuficiente para el equipamiento ${equipamiento.nombre}. Disponible: ${equipamiento.stock}`);
          }

          const costoItem = equipamiento.costo * item.cantidad;
          costoTotalEquipamiento += costoItem;

          // Crear boleta de equipamiento
          const nuevaBoleta = this.boletaEquipamientoRepository.create({
            reserva: { id: savedReserva.id },
            equipamiento: { id: item.id }, // ✅ USAR 'id'
            cantidad: item.cantidad,
            montoTotal: costoItem,
          });

          await this.boletaEquipamientoRepository.save(nuevaBoleta);

          // Actualizar stock
          equipamiento.stock -= item.cantidad;
          await this.equipamientoRepository.save(equipamiento);
        }
      }

      // Verificar saldo para el equipamiento
      if (!isAdmin && usuario.saldo < costoTotalEquipamiento) {
        // Revertir la reserva y lanzar error
        await this.reservaRepository.delete(savedReserva.id);
        throw new BadRequestException(`Saldo insuficiente para el equipamiento. Saldo actual: $${usuario.saldo}, Costo: $${costoTotalEquipamiento}`);
      }

      // Procesar el pago del equipamiento
      if (!isAdmin && costoTotalEquipamiento > 0) {
        usuario.saldo -= costoTotalEquipamiento;
        await this.usuarioRepository.save(usuario);
      }
      // Obtener la reserva completa con todas las relaciones
      const reservaCompleta = await this.reservaRepository.findOne({
        where: { id: savedReserva.id },
        relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'jugadores'],
      });

      if (!reservaCompleta) {
        throw new Error('Error al cargar la reserva completa');
      }

      // resgristra la transaccion
      try {
        let transaccionData: CreateTransaccionDto;

        // Verificar si hay equipamiento
        if (reservaCompleta.boletas && reservaCompleta.boletas.length > 0) {
          const primeraBoletaId = reservaCompleta.boletas[0].id;
          
          // Crear transacción CON equipamiento
          transaccionData = {
            fecha: new Date(),
            id_boleta_equipamiento: primeraBoletaId
          };
        } else {
          // Crear transacción SIN equipamiento
          transaccionData = {
            fecha: new Date()
            // ✅ NO INCLUIR id_boleta_equipamiento si no hay equipamiento
          };
        }

        await this.transaccionService.create(transaccionData);
        console.log(`✅ Transacción registrada para reserva #${savedReserva.id}`);
      } catch (transaccionError) {
        console.error('❌ Error al registrar transacción:', transaccionError);
      }

      //genera la notificacion
      try {
        await this.notificacionesService.create({
          titulo: 'Reserva Creada y Pagada',
          mensaje: `Tu reserva para la cancha #${createReservaDto.numero_cancha} el ${fechaFormateada.toLocaleDateString()} de ${createReservaDto.hora_inicio} a ${createReservaDto.hora_termino} ha sido creada y pagada exitosamente. Costo: $${costoReserva}`,
          tipoEvento: 'RESERVA_CREADA',
          idUsuario: usuario.id_usuario,
          idReserva: savedReserva.id
        });
      } catch (notifError) {
        console.error('Error al crear notificación:', notifError);
      }

      return CreateResponse(
        `Reserva #${savedReserva.id} creada exitosamente para la cancha #${createReservaDto.numero_cancha}`,
        reservaCompleta,
        'CREATED'
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new HttpException(
        CreateResponse('Error al crear la reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findAll(): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
      relations: ['usuario', 'cancha', 'historiales'],
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
      if (!id || isNaN(id) || id <= 0) {
      throw new BadRequestException(`ID de reserva inválido: ${id}`);
     }
      const reserva = await this.reservaRepository.findOne({
        where: {id: id},
        relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'historiales'],
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
        relations: ['usuario', 'boletas', 'historiales'],
        order: { fecha: 'ASC', hora_inicio: 'ASC' },
      });
      
      return CreateResponse('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener las reservas de la cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  async update(id: number, updateReservaDto: UpdateReservaDto, isAdmin: boolean = false): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id },
        relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'jugadores'],
      });

      if (!reserva) {
        throw new BadRequestException(`No se encontró una reserva con el ID ${id}`);
      }

      // ✅ VALIDAR ESTADO - NO MODIFICAR RESERVAS CANCELADAS
      if (reserva.estado === 'CANCELADA') {
        throw new BadRequestException('No se puede modificar una reserva cancelada');
      }

      // ✅ VALIDAR 1 SEMANA DE ANTICIPACIÓN PARA USUARIOS NORMALES
      const fechaReserva = new Date(reserva.fecha);
      const hoy = new Date();
      const unaSemanaDespues = new Date(hoy);
      unaSemanaDespues.setDate(hoy.getDate() + 7);

      if (fechaReserva <= unaSemanaDespues && !isAdmin) {
        throw new BadRequestException('Las reservas solo se pueden modificar con al menos 1 semana de anticipación');
      }

      const today = new Date();
      let fechaFormateada = reserva.fecha;
      let horaInicio = reserva.hora_inicio;
      let horaTermino = reserva.hora_termino;
      let numeroCancha = reserva.cancha.numero;
      
      // 1. Validar si se modifica fecha, hora o cancha
      if (updateReservaDto.fecha || updateReservaDto.hora_inicio || updateReservaDto.hora_termino || updateReservaDto.numero_cancha) {
        if (updateReservaDto.fecha) {
          const fecha = new Date(updateReservaDto.fecha);
          fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
          
          // Validar que la fecha sea de lunes a viernes
          const dayOfWeek = fecha.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            throw new BadRequestException('Las reservas solo están disponibles de lunes a viernes');
          }
          
          // Validar que la reserva sea con 1 semana de anticipación (a menos que sea admin)
          if (!isAdmin) {
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(today.getDate() + 7);
            
            if (fecha < oneWeekFromNow) {
              throw new BadRequestException('Las reservas deben modificarse con al menos 1 semana de anticipación');
            }
          }
        }
        
        if (updateReservaDto.hora_inicio) {
          horaInicio = updateReservaDto.hora_inicio;
        }
        
        if (updateReservaDto.hora_termino) {
          horaTermino = updateReservaDto.hora_termino;
        }
        
        // Validar que el horario sea entre 8:00 y 20:00
        const horaInicioArr = horaInicio.split(':').map(Number);
        const horaTerminoArr = horaTermino.split(':').map(Number);
        
        const horaInicioNum = horaInicioArr[0] + horaInicioArr[1]/60;
        const horaTerminoNum = horaTerminoArr[0] + horaTerminoArr[1]/60;
        
        if (horaInicioNum < 8 || horaTerminoNum > 20) {
          throw new BadRequestException('El horario de reservas es de 08:00 a 20:00');
        }
        
        // Validar que la duración sea entre 90 y 180 minutos
        const duracionMinutos = (horaTerminoNum - horaInicioNum) * 60;
        
        if (duracionMinutos < 90 || duracionMinutos > 180) {
          throw new BadRequestException('La duración de la reserva debe ser entre 90 y 180 minutos');
        }
        
        if (updateReservaDto.numero_cancha) {
          numeroCancha = updateReservaDto.numero_cancha;
        }
        
        // Verificar disponibilidad
        const conflictos = await this.reservaRepository.createQueryBuilder('reserva')
          .innerJoin('reserva.cancha', 'cancha')
          .where('cancha.numero = :numeroCancha', { numeroCancha })
          .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
          .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
            horaInicio,
            horaTermino,
          })
          .andWhere('reserva.id != :id', { id })
          .getMany();

        if (conflictos.length > 0) {
          throw new BadRequestException(`La cancha #${numeroCancha} no está disponible en ese horario`);
        }
        
        // Verificar que el usuario no exceda 180 min de reserva diarios
        if (!isAdmin) {          const reservasUsuarioDia = await this.reservaRepository
            .createQueryBuilder('reserva')
            .innerJoin('reserva.usuario', 'usuario')
            .where('usuario.id_usuario = :idUsuario', { idUsuario: reserva.usuario.id_usuario })
            .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
            .andWhere('reserva.id != :id', { id })
            .getMany();

          let minutosReservadosHoy = 0;
          for (const otraReserva of reservasUsuarioDia) {
            const inicio = otraReserva.hora_inicio.split(':').map(Number);
            const fin = otraReserva.hora_termino.split(':').map(Number);
            const minutos = ((fin[0] * 60 + fin[1]) - (inicio[0] * 60 + inicio[1]));
            minutosReservadosHoy += minutos;
          }
          
          // Agregar minutos de esta reserva modificada
          const nuevaInicioArr = horaInicio.split(':').map(Number);
          const nuevaFinArr = horaTermino.split(':').map(Number);
          const nuevaDuracion = ((nuevaFinArr[0] * 60 + nuevaFinArr[1]) - (nuevaInicioArr[0] * 60 + nuevaInicioArr[1]));
          
          if (minutosReservadosHoy + nuevaDuracion > 180) {
            throw new BadRequestException(
              `No puede reservar más de 180 minutos por día (ya tiene ${minutosReservadosHoy} minutos reservados)`
            );
          }
        }
        
        // Verificar que el usuario no tenga reservas concurrentes
        if (!isAdmin) {
          const reservasConcurrentes = await this.reservaRepository
            .createQueryBuilder('reserva')
            .innerJoin('reserva.usuario', 'usuario')
            .where('usuario.id_usuario = :idUsuario', { idUsuario: reserva.usuario.id_usuario }) 
            .andWhere('reserva.id != :id', { id })
            .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
            .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
              horaInicio,
              horaTermino,
            })
            .getMany();
          
          if (reservasConcurrentes.length > 0) {
            throw new BadRequestException('Ya tiene una reserva en ese horario');
          }
        }

        // Asignar nueva cancha si se cambia
        if (updateReservaDto.numero_cancha) {
          const nuevaCancha = await this.canchaRepository.findOne({
            where: { numero: updateReservaDto.numero_cancha }
          });

          if (!nuevaCancha) {
            throw new BadRequestException(`Cancha número ${updateReservaDto.numero_cancha} no encontrada`);
          }

          reserva.cancha = nuevaCancha;
        }

        // Actualizar campos
        if (updateReservaDto.fecha) {
          reserva.fecha = fechaFormateada;
        }
        if (updateReservaDto.hora_inicio) {
          reserva.hora_inicio = horaInicio;
        }
        if (updateReservaDto.hora_termino) {
          reserva.hora_termino = horaTermino;
        }

        // Guardar cambios en la reserva
        await this.reservaRepository.save(reserva);

        // Registrar cambio en historial
        try {
          await this.historialReservaService.create({
            estado: 'Modificado',
            idReserva: id,
            idUsuario: reserva.usuario.id_usuario
          });
        } catch (historialError) {
          console.error('Error al crear historial de modificación:', historialError);
        }
      }

      // Actualizar jugadores si se proporcionaron
      if (Array.isArray(updateReservaDto.jugadores)) {
        // Eliminar jugadores anteriores
        await this.jugadorRepository
         .createQueryBuilder()
          .delete()
          .from(Jugador)
          .where('idReserva = :reservaId', { reservaId: id })
          .execute();
        
        // Agregar nuevos jugadores
        for (const jugadorDto of updateReservaDto.jugadores) {
          const nuevoJugador = this.jugadorRepository.create({
            nombre: jugadorDto.nombre,
            apellido: jugadorDto.apellido,
            rut: jugadorDto.rut,
            edad: jugadorDto.edad,
            reserva: { id: id }
          });
          
          await this.jugadorRepository.save(nuevoJugador);
        }
      }

      // Actualizar equipamiento
      if (Array.isArray(updateReservaDto.equipamiento)) {
        // Obtener boletas actuales para devolver stock
        const boletasActuales = await this.boletaEquipamientoRepository.find({
          where: { reserva: { id: id }},
          relations: ['equipamiento']
        });
        
        // Devolver stock al inventario
        for (const boleta of boletasActuales) {
          const equipamiento = await this.equipamientoRepository.findOne({
            where: { id: boleta.equipamiento.id }
          });
          
          if (equipamiento) {
            equipamiento.stock += boleta.cantidad;
            await this.equipamientoRepository.save(equipamiento);
          }
        }
        
        // Eliminar boletas anteriores
        await this.boletaEquipamientoRepository
          .createQueryBuilder()
          .delete()
          .from(BoletaEquipamiento)
          .where('idReserva = :reservaId', { reservaId: id })
          .execute();

        // Procesar nuevo equipamiento
        let costoTotalEquipamiento = 0;
        for (const item of updateReservaDto.equipamiento) {
          const equipamiento = await this.equipamientoRepository.findOne({
            where: { id: item.id }
          });

          if (!equipamiento) {
            throw new BadRequestException(`Equipamiento con ID ${item.id} no encontrado`);
          }

          // Verificar stock
          if (equipamiento.stock < item.cantidad) {
            throw new BadRequestException(`Stock insuficiente para el equipamiento ${equipamiento.nombre}. Disponible: ${equipamiento.stock}`);
          }

          const costoItem = equipamiento.costo * item.cantidad;
          costoTotalEquipamiento += costoItem;

          // Crear boleta de equipamiento
          const nuevaBoleta = this.boletaEquipamientoRepository.create({
            reserva: { id: id }, 
            equipamiento: { id: item.id},
            cantidad: item.cantidad,
            montoTotal: costoItem,
          });

          await this.boletaEquipamientoRepository.save(nuevaBoleta);

          // Actualizar stock
          equipamiento.stock -= item.cantidad;
          await this.equipamientoRepository.save(equipamiento);
        }

        // Verificar saldo para el equipamiento
        if (!isAdmin && reserva.usuario.saldo < costoTotalEquipamiento) {
          throw new BadRequestException(`Saldo insuficiente para el equipamiento. Saldo actual: $${reserva.usuario.saldo}, Costo: $${costoTotalEquipamiento}`);
        }

        // Procesar pago del equipamiento
        if (!isAdmin && costoTotalEquipamiento > 0) {
          reserva.usuario.saldo -= costoTotalEquipamiento;
          await this.usuarioRepository.save(reserva.usuario);
        }
      }

      // Obtener la reserva actualizada con todas las relaciones
      const reservaActualizada = await this.reservaRepository.findOne({
        where: { id },
        relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'jugadores'],
      });

      if (!reservaActualizada) {
        throw new Error('Error al cargar la reserva actualizada');
      }

      //notificacoin de modificacion 
      try {
        await this.notificacionesService.create({
          titulo: 'Reserva Modificada',
          mensaje: `Tu reserva #${id} ha sido modificada exitosamente`,
          tipoEvento: 'RESERVA_MODIFICADA',
          idUsuario: reserva.usuario.id_usuario,
          idReserva: id
        });
      } catch (notifError) {
        console.error('Error al crear notificación de modificación:', notifError);
      }

      return CreateResponse('Reserva modificada exitosamente', reservaActualizada, 'OK');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new HttpException(
        CreateResponse('Error al modificar la reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }



  async remove(id: number, isAdmin: boolean = false): Promise<ApiResponse<null>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id: id },
        relations: ['usuario', 'boletas', 'boletas.equipamiento'],
      });
      
      if (!reserva) {
        throw new BadRequestException(`No se encontró una reserva con el ID ${id}`);
      }
      
      // Verificar regla de cancelación (1 semana de anticipación) si no es admin
      if (!isAdmin) {
        const fechaReserva = new Date(reserva.fecha);
        const today = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);
        
        if (fechaReserva < oneWeekFromNow) {
          throw new BadRequestException('Las reservas deben cancelarse con al menos 1 semana de anticipación');
        }
      }
      
      // Devolver equipamiento al inventario
      if (reserva.boletas && reserva.boletas.length > 0) {
        for (const boleta of reserva.boletas) {
          if (boleta.equipamiento) {
            const equipamiento = await this.equipamientoRepository.findOne({
              where: { id: boleta.equipamiento.id }
            });
            
            if (equipamiento) {
              equipamiento.stock += boleta.cantidad;
              await this.equipamientoRepository.save(equipamiento);
            }
          }
        }
      }
      
      // Crear registro de cancelación en el historial
      try {
        await this.historialReservaService.create({
          estado: 'Cancelado',
          idReserva: id,
          idUsuario: reserva.usuario.id_usuario
        });
      } catch (historialError) {
        console.error('Error al crear historial de cancelación:', historialError);
      }
      
      // No hay reembolso según las reglas de negocio, así que no devolvemos el saldo al usuario
      
      // 🔔 AGREGAR ANTES DE: await this.reservaRepository.delete(id);
      // 🔔 GENERAR NOTIFICACIÓN DE CANCELACIÓN
      try {
        await this.notificacionesService.create({
          titulo: 'Reserva Cancelada',
          mensaje: `Tu reserva #${id} ha sido cancelada exitosamente.`,
          tipoEvento: 'RESERVA_ELIMINADA',
          idUsuario: reserva.usuario.id_usuario,
          idReserva: id
        });
      } catch (notifError) {
        console.error('Error al crear notificación de cancelación:', notifError);
      }

      // Eliminar la reserva
      await this.reservaRepository.delete(id);
      return CreateResponse('Reserva cancelada exitosamente', null, 'OK');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      if (error.message && error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al cancelar la reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
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

  //"Eliminar" reserva
    async eliminarReserva(id: number) {
      await this.reservaRepository.update(id, { existe: true });
      return CreateResponse(
        'Reserva eliminada',
        null, // o datos mínimos si querés
        'NO_CONTENT'
      );
    }

  //Ver reservas que existen
    async obtenerReservasActivas() {
      const reservas = await this.reservaRepository.find({
        where: { existe: true },
        relations: ['usuario', 'cancha'],
        order: { fecha: 'DESC' },
      });

      return CreateResponse(
        `${reservas.length} reservas existentes`,
        reservas,
        'OK'
      );
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

  async verificarReservasActivasCancha(idCancha: number): Promise<boolean> {
  try {
    const reservasActivas = await this.reservaRepository.count({
      where: {
        cancha: { id: idCancha },
        //agregar más condiciones para definir "reservas activas"
        // fecha: MoreThanOrEqual(new Date().toISOString().split('T')[0])
      }
    });
    
    return reservasActivas > 0;
  } catch (error) {
    console.error('Error al verificar reservas activas:', error);
    return false; // En caso de error, asumir que no hay reservas activas
  }
}
 async confirmarReserva(idReserva: number, idUsuario: number, observaciones?: string): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id: idReserva },
        relations: ['usuario', 'cancha']
      });

      if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
      }

      //Solo el propietario o admin puede confirmar
      if (reserva.usuario.id_usuario !== idUsuario) {
        const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: idUsuario } });
        if (!usuario?.is_admin) {
          throw new BadRequestException('Solo puedes confirmar tus propias reservas');
        }
      }

      
      if (reserva.estado === 'CONFIRMADA') {
        throw new BadRequestException('La reserva ya está confirmada');
      }

      if (reserva.estado === 'CANCELADA') {
        throw new BadRequestException('No se puede confirmar una reserva cancelada');
      }

    
      const fechaReserva = new Date(reserva.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaReserva < hoy) {
        throw new BadRequestException('No se puede confirmar una reserva que ya pasó');
      }

      // ✅ ACTUALIZAR ESTADO
      reserva.estado = 'CONFIRMADA';
      await this.reservaRepository.save(reserva);

      // ✅ CREAR HISTORIAL (USAR ESTADO CONSISTENTE)
      try {
        await this.historialReservaService.create({
          estado: 'CONFIRMADA', // ✅ CONSISTENTE CON ENUM
          idReserva: idReserva,
          idUsuario: idUsuario,
          observaciones: observaciones
        });
      } catch (historialError) {
        console.error('Error al crear historial (no crítico):', historialError);
      }

      // ✅ CREAR NOTIFICACIÓN
      try {
        await this.notificacionesService.create({
          titulo: 'Reserva Confirmada ✅',
          mensaje: `Tu reserva #${idReserva} ha sido confirmada exitosamente.${observaciones ? ` Observaciones: ${observaciones}` : ''}`,
          tipoEvento: 'RESERVA_CONFIRMADA',
          idUsuario: reserva.usuario.id_usuario,
          idReserva: idReserva
        });
      } catch (notifError) {
        console.error('Error al crear notificación (no crítico):', notifError);
      }

      return CreateResponse('Reserva confirmada exitosamente', reserva, 'OK');
      
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        CreateResponse('Error al confirmar reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // CANCELAR RESERVA
  async cancelarReserva(idReserva: number, idUsuario: number, motivo?: string): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { id: idReserva },
        relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento']
      });

      if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
      }

      // Solo el propietario o admin puede cancelar
      if (reserva.usuario.id_usuario !== idUsuario) {
        const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: idUsuario } });
        if (!usuario?.is_admin) {
          throw new BadRequestException('Solo puedes cancelar tus propias reservas');
        }
      }

     
      if (reserva.estado === 'CANCELADA') {
        throw new BadRequestException('La reserva ya está cancelada');
      }

      // ✅ VALIDAR 1 SEMANA DE ANTICIPACIÓN PARA USUARIOS NORMALES
      const fechaReserva = new Date(reserva.fecha);
      const hoy = new Date();
      const unaSemanaDespues = new Date(hoy);
      unaSemanaDespues.setDate(hoy.getDate() + 7);

      if (fechaReserva <= unaSemanaDespues) {
        const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: idUsuario } });
        if (!usuario?.is_admin) {
          throw new BadRequestException('Las reservas solo se pueden cancelar con al menos 1 semana de anticipación');
        }
      }

      // ✅ DEVOLVER EQUIPAMIENTO AL STOCK (PERO NO DINERO)
      if (reserva.boletas && reserva.boletas.length > 0) {
        for (const boleta of reserva.boletas) {
          if (boleta.equipamiento) {
            const equipamiento = await this.equipamientoRepository.findOne({
              where: { id: boleta.equipamiento.id }
            });
            
            if (equipamiento) {
              equipamiento.stock += boleta.cantidad;
              await this.equipamientoRepository.save(equipamiento);
            }
          }
        }
      }

      
      reserva.estado = 'CANCELADA';
      await this.reservaRepository.save(reserva);

      
      try {
        await this.historialReservaService.create({
          estado: 'CANCELADA', 
          idReserva: idReserva,
          idUsuario: idUsuario,
          observaciones: motivo
        });
      } catch (historialError) {
        console.error('Error al crear historial (no crítico):', historialError);
      }

      
      try {
        await this.notificacionesService.create({
          titulo: 'Reserva Cancelada ❌',
          mensaje: `Tu reserva #${idReserva} ha sido cancelada.${motivo ? ` Motivo: ${motivo}` : ''} NOTA: No se realiza devolución de dinero.`,
          tipoEvento: 'RESERVA_CANCELADA',
          idUsuario: reserva.usuario.id_usuario,
          idReserva: idReserva
        });
      } catch (notifError) {
        console.error('Error al crear notificación (no crítico):', notifError);
      }

      return CreateResponse(
        'Reserva cancelada exitosamente. NOTA: No se realiza devolución de dinero.',
        reserva,
        'OK'
      );

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        CreateResponse('Error al cancelar reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //OBTENER RESERVAS POR ESTADO
  async obtenerReservasPorEstado(estado: string): Promise<ApiResponse<Reserva[]>> {
    try {
      const estadosValidos = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'];
      if (!estadosValidos.includes(estado)) {
        throw new BadRequestException(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`);
      }

      const reservas = await this.reservaRepository.find({
        where: { estado: estado },
        relations: ['usuario', 'cancha', 'boletas'],
        order: { fecha: 'ASC', hora_inicio: 'ASC' }
      });

      return CreateResponse(`${reservas.length} reservas encontradas con estado: ${estado}`, reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener reservas por estado', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  
}

