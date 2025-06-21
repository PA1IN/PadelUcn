import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Put, 
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateResponse } from '../../utils/api-response.util';
import { CanchaService } from '../cancha/cancha.service';

@Controller('reserva')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservaController {
  constructor(
    private readonly reservaService: ReservaService,
    private readonly canchaService: CanchaService,
  ) {}

  @Post()
  async create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    try {
      const is_admin = req.user.is_admin;
      return await this.reservaService.create(createReservaDto, is_admin);
    } catch (error) {
      return CreateResponse(
        'Error al crear la reserva',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Get()
  @Roles('admin')
  async findAll() {
    try {
      return await this.reservaService.findAll();
    } catch (error) {
      return CreateResponse(
        'Error al obtener reservas',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  // ✅ RUTAS ESPECÍFICAS PRIMERO:
  @Get('disponibilidad')
  async verificarDisponibilidadGeneral(
    @Query('fecha') fecha: string,
    @Query('hora') hora: string,
    @Query('numeroPersonas') numeroPersonas: string,
    @Query('duracion') duracion?: string
  ) {
    try {
      console.log('=== DEBUGGING DISPONIBILIDAD ===');
      console.log('Parámetros recibidos:', { fecha, hora, numeroPersonas, duracion });

      if (!fecha || !hora || !numeroPersonas) {
        return CreateResponse(
          'Parámetros faltantes: fecha, hora y numeroPersonas son requeridos',
          null,
          'BAD_REQUEST'
        );
      }

      const personas = parseInt(numeroPersonas);
      if (isNaN(personas) || personas <= 0) {
        return CreateResponse(
          'numeroPersonas debe ser un número entero positivo',
          null,
          'BAD_REQUEST'
        );
      }

      const duracionMinutos = duracion ? parseInt(duracion) : 90;
      if (isNaN(duracionMinutos) || (duracionMinutos !== 90 && duracionMinutos !== 120)) {
        return CreateResponse(
          'Duración debe ser 90 o 120 minutos',
          null,
          'BAD_REQUEST'
        );
      }

      const canchasDisponibles: Array<{
        numero: number;
        nombre: string;
        maximo_jugadores: number;
        valor: number;
      }> = [];

      try {
        console.log('Obteniendo canchas...');
        const todasLasCanchas = await this.canchaService.findAll();
        console.log('Canchas obtenidas:', todasLasCanchas);

        if (!todasLasCanchas || !Array.isArray(todasLasCanchas) || todasLasCanchas.length === 0) {
          throw new Error('No se encontraron canchas disponibles');
        }
        
        for (const cancha of todasLasCanchas) {
          console.log('Procesando cancha:', { 
            numero: cancha.numero, 
            tipo: typeof cancha.numero,
            cantidadMax: cancha.cantidadMaxJugador 
          });
          
          if (cancha.cantidadMaxJugador >= personas) {
            const horaTermino = this.calcularHoraTerminoSegura(hora, duracionMinutos);
            console.log('Hora término calculada:', horaTermino);
            
            if (!horaTermino) {
              console.error(`Error calculando hora término para: ${hora} + ${duracionMinutos}min`);
              continue;
            }

            if (!cancha.numero || isNaN(cancha.numero) || cancha.numero <= 0) {
              console.error('Número de cancha inválido, saltando:', cancha.numero);
              continue;
            }

            if (!fecha || !hora || !horaTermino) {
              console.error('Parámetros de tiempo inválidos, saltando:', { fecha, hora, horaTermino });
              continue;
            }

            console.log('Llamando a verificarDisponibilidad con:', {
              numeroCancha: cancha.numero,
              fecha,
              hora,
              horaTermino
            });

            const disponibilidad = await this.reservaService.verificarDisponibilidad(
              cancha.numero,
              fecha,
              hora,
              horaTermino
            );

            console.log('Respuesta de verificarDisponibilidad:', disponibilidad);

            if (disponibilidad && disponibilidad.data && disponibilidad.data.disponible) {
              canchasDisponibles.push({
                numero: cancha.numero,
                nombre: cancha.nombre,
                maximo_jugadores: cancha.cantidadMaxJugador,
                valor: cancha.valor
              });
              console.log('Cancha agregada como disponible:', cancha.numero);
            } else {
              console.log('Cancha no disponible:', cancha.numero);
            }
          } else {
            console.log('Cancha sin capacidad suficiente:', { 
              numero: cancha.numero, 
              capacidad: cancha.cantidadMaxJugador, 
              requerida: personas 
            });
          }
        }

        console.log('Total canchas disponibles:', canchasDisponibles.length);

        return CreateResponse(
          `${canchasDisponibles.length} canchas disponibles encontradas`,
          {
            canchasDisponibles,
            fecha,
            hora,
            numeroPersonas: personas,
            duracion: duracionMinutos
          },
          'OK'
        );

      } catch (serviceError) {
        console.error('Error en servicios:', serviceError);
        console.error('Stack trace:', serviceError.stack);
        return CreateResponse(
          'Error interno al verificar disponibilidad',
          null,
          'INTERNAL_SERVER_ERROR',
          serviceError.message,
          false
        );
      }

    } catch (error) {
      console.error('Error general:', error);
      console.error('Stack trace:', error.stack);
      return CreateResponse(
        'Error al verificar disponibilidad',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Get('fechas-disponibles')
  async obtenerFechasDisponibles() {
    try {
      const hoy = new Date();
      const fechasDisponibles: Array<{
        fecha: string;
        diaSemana: string;
        disponible: boolean;
        bloquesDisponibles?: number;
      }> = [];

      let diasAgregados = 0;
      let diasRevisados = 1;

      while (diasAgregados < 20 && diasRevisados <= 60) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + diasRevisados);
        
        const diaSemana = fecha.getDay();
        
        if (diaSemana >= 1 && diaSemana <= 5) {
          const fechaISO = fecha.toISOString().split('T')[0];
          
          fechasDisponibles.push({
            fecha: fechaISO,
            diaSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][diaSemana],
            disponible: true,
          });
          
          diasAgregados++;
        }
        
        diasRevisados++;
      }

      return CreateResponse(
        `${fechasDisponibles.length} fechas hábiles disponibles`,
        { fechasDisponibles },
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener fechas disponibles',
        null,
        'BAD_REQUEST'
      );
    }
  }

  // ✅ MÉTODO HELPER PARA CALCULAR HORA DE TÉRMINO
  private calcularHoraTermino(horaInicio: string, duracionMinutos: number): string {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracionMinutos;
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    
    return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
  }

  // ✅ REEMPLAZAR MÉTODO calcularHoraTermino SEGURA
  private calcularHoraTerminoSegura(horaInicio: string, duracionMinutos: number): string | null {
    try {
      // ✅ VALIDAR ENTRADA
      if (!horaInicio || !horaInicio.includes(':')) {
        console.error(`Hora inválida: ${horaInicio}`);
        return null;
      }

      const partes = horaInicio.split(':');
      if (partes.length !== 2) {
        console.error(`Formato de hora inválido: ${horaInicio}`);
        return null;
      }

      const horas = parseInt(partes[0]);
      const minutos = parseInt(partes[1]);

      // ✅ VALIDAR NÚMEROS
      if (isNaN(horas) || isNaN(minutos) || isNaN(duracionMinutos)) {
        console.error(`Valores no numéricos: ${horas}, ${minutos}, ${duracionMinutos}`);
        return null;
      }

      // ✅ VALIDAR DURACIÓN PERMITIDA
      if (duracionMinutos !== 90 && duracionMinutos !== 120) {
        console.error(`Duración no permitida: ${duracionMinutos}. Solo se permiten reservas de 90 o 120 minutos`);
        return null;
      }

      // ✅ VALIDAR HORARIO DE FUNCIONAMIENTO
      const HORA_APERTURA = 8;
      const HORA_CIERRE = 21;
      
      if (horas < HORA_APERTURA || horas >= HORA_CIERRE) {
        console.error(`Hora de inicio fuera del horario de funcionamiento (${HORA_APERTURA}:00 - ${HORA_CIERRE}:00): ${horas}:${minutos}`);
        return null;
      }

      // ✅ VALIDAR RANGOS BÁSICOS
      if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
        console.error(`Hora fuera de rango: ${horas}:${minutos}`);
        return null;
      }

      const totalMinutos = horas * 60 + minutos + duracionMinutos;
      const nuevasHoras = Math.floor(totalMinutos / 60);
      const nuevosMinutos = totalMinutos % 60;
      
      // ✅ VALIDAR QUE NO EXCEDA HORA DE CIERRE (21:00)
      if (nuevasHoras > HORA_CIERRE || (nuevasHoras === HORA_CIERRE && nuevosMinutos > 0)) {
        console.error(`Reserva excedería horario de funcionamiento. Término: ${nuevasHoras}:${nuevosMinutos.toString().padStart(2, '0')}, límite: ${HORA_CIERRE}:00`);
        return null;
      }
      
      return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error(`Error calculando hora término: ${error.message}`);
      return null;
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const response = await this.reservaService.findOne(+id);
      const reserva = response.data;
      
      if (!reserva) {
        return CreateResponse(
          'Reserva no encontrada',
          null,
          'NOT_FOUND',
          'La reserva solicitada no existe',
          false
        );
      }
      
      if (!req.user.is_admin && reserva.usuario.id_usuario !== req.user.id_usuario) {
        return CreateResponse(
          'No tienes permisos para ver esta reserva',
          null,
          'FORBIDDEN',
          'Acceso denegado',
          false
        );
      }
      return response;
    } catch (error) {
      return CreateResponse(
        'Error al obtener la reserva',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Get('usuario/:rut')
  async findByUsuario(@Param('rut') rut: string, @Request() req) {
    try {
      if (!req.user.is_admin && req.user.rut !== rut) {
        return CreateResponse(
          'No tienes permisos para ver estas reservas',
          null,
          'FORBIDDEN',
          'Acceso denegado',
          false
        );
      }
      
      return await this.reservaService.findByUsuario(rut);
    } catch (error) {
      return CreateResponse(
        'Error al obtener las reservas del usuario',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateReservaDto: UpdateReservaDto,
    @Request() req
  ) {
    try {
      const is_admin = req.user.is_admin;
      
      if (!is_admin) {
        const reservaResponse = await this.reservaService.findOne(+id);
        if (reservaResponse.data && reservaResponse.data.usuario.id_usuario !== req.user.id_usuario) {
          return CreateResponse(
            'No tienes permisos para modificar esta reserva',
            null,
            'FORBIDDEN',
            'Acceso denegado',
            false
          );
        }
      }
      
      return await this.reservaService.update(+id, updateReservaDto, is_admin);
    } catch (error) {
      return CreateResponse(
        'Error al actualizar la reserva',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Patch('eliminar/:id')
  @Roles('admin', 'user')
  eliminar(@Param('id') id: string) {
    return this.reservaService.eliminarReserva(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const is_admin = req.user.is_admin;
      
      if (!is_admin) {
        const reservaResponse = await this.reservaService.findOne(+id);
        if (reservaResponse.data && reservaResponse.data.usuario.id_usuario !== req.user.id_usuario) {
          return CreateResponse(
            'No tienes permisos para cancelar esta reserva',
            null,
            'FORBIDDEN',
            'Acceso denegado',
            false
          );
        }
      }
      
      await this.reservaService.remove(+id, is_admin);
      return CreateResponse(
        'Reserva cancelada exitosamente',
        null,
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al cancelar la reserva',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  //Muestra las reservas que existen
  @Get('activas')
  @Roles('admin', 'user')
  obtenerActivas() {
    return this.reservaService.obtenerReservasActivas();
  }

  @Get('estado/:estado')
  @Roles('admin')
  async obtenerReservasPorEstado(@Param('estado') estado: string) {
    return await this.reservaService.obtenerReservasPorEstado(estado);
  }

  @Get('cancha/:numero')
  async findByCancha(@Param('numero') numero: string) {
    try {
      return await this.reservaService.findByCancha(+numero);
    } catch (error) {
      return CreateResponse(
        'Error al obtener las reservas de la cancha',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Get('disponibilidad/:numero/:fecha/:horaInicio/:horaTermino')
  async verificarDisponibilidad(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string,
    @Param('horaInicio') horaInicio: string,
    @Param('horaTermino') horaTermino: string
  ) {
    try {
      const disponibilidad = await this.reservaService.verificarDisponibilidad(
        +numero, 
        fecha, 
        horaInicio, 
        horaTermino
      );
      return CreateResponse(
        disponibilidad.data && disponibilidad.data.disponible
          ? `La cancha #${numero} está disponible en el horario solicitado`
          : `La cancha #${numero} no está disponible en el horario solicitado`,
        { disponible: disponibilidad.data ? disponibilidad.data.disponible : false },
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al verificar disponibilidad',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Get('disponibilidad-dia/:numero/:fecha')
  async obtenerHorariosDisponibles(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string
  ) {
    try {
      const horarios = await this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
      return CreateResponse(
        `Horarios disponibles para la cancha #${numero} en la fecha ${fecha}`,
        { horariosDisponibles: horarios },
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener horarios disponibles',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  // CONFIRMAR RESERVA
  @Put(':id/confirmar')
  async confirmarReserva(
    @Param('id') id: string,
    @Body() body: { observaciones?: string },
    @Request() req
  ) {
    return await this.reservaService.confirmarReserva(+id, req.user.id_usuario, body.observaciones);
  }

  // CANCELAR RESERVA
  @Put(':id/cancelar')
  async cancelarReserva(
    @Param('id') id: string,
    @Body() body: { motivo?: string },
    @Request() req
  ) {
    return await this.reservaService.cancelarReserva(+id, req.user.id_usuario, body.motivo);
  }
}
