import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateResponse } from '../../utils/api-response.util';

@Controller('reserva')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  async create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    try {
      // Verificar si el usuario es administrador
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

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {const response = await this.reservaService.findOne(+id);
      const reserva = response.data;
      
      // Solo permitir acceso a la reserva si es admin o es el propietario
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

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateReservaDto: UpdateReservaDto,
    @Request() req
  ) {
    try {
      // Verificar si el usuario es administrador
      const is_admin = req.user.is_admin;
      
      // Si no es admin, verificar que el usuario sea dueño de la reserva
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

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      // Verificar si el usuario es administrador
      const is_admin = req.user.is_admin;
      
      // Si no es admin, verificar que el usuario sea dueño de la reserva
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

  @Get('usuario/:rut')
  async findByUsuario(@Param('rut') rut: string, @Request() req) {
    try {
      // Solo permitir ver las reservas si es admin o es el mismo usuario
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

  @Get('estadisticas')
  @Roles('admin')
  async obtenerEstadisticas() {
    try {
      const estadisticas = await this.reservaService.obtenerEstadisticas();
      return CreateResponse(
        'Estadísticas obtenidas exitosamente',
        estadisticas,
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener estadísticas',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }
}
