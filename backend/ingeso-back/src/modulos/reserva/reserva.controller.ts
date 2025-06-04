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
import { Reserva } from './entities/reserva.entity';

@Controller('reservas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}
  // Utility function to transform reserva data for frontend compatibility
  private transformReservaResponse(reserva: Reserva) {
    return {
      id_reserva: reserva.id,
      fecha: reserva.fecha,
      hora_inicio: reserva.hora_inicio,
      hora_termino: reserva.hora_termino,
      id_usuario: reserva.idUsuario,
      id_cancha: reserva.idCancha,
      // Transform related cancha data if available
      numero_cancha: reserva.cancha?.numero || null,
      nombre_cancha: reserva.cancha?.nombre || null,
      valor_cancha: reserva.cancha?.valor || null,
      // Transform related usuario data if available
      usuario: reserva.usuario ? {
        id: reserva.usuario.id,
        rut: reserva.usuario.rut,
        nombre: reserva.usuario.nombre,
        correo: reserva.usuario.correo,
        saldo: reserva.usuario.saldo
      } : null,
      // Transform related cancha data if available
      cancha: reserva.cancha ? {
        id_cancha: reserva.cancha.id,
        numero_cancha: reserva.cancha.numero,
        nombre: reserva.cancha.nombre,
        descripcion: reserva.cancha.descripcion,
        valor: reserva.cancha.valor
      } : null,
      // Transform jugadores if available
      jugadores: reserva.jugadores?.map(jugador => ({
        id_jugador: jugador.id,
        nombre: jugador.nombre,
        apellido: jugador.apellido,
        rut: jugador.rut,
        edad: jugador.edad,
        id_reserva: jugador.idReserva
      })) || [],
      // Transform boletas if available
      boletas: reserva.boletas?.map(boleta => ({
        id_boleta: boleta.id,
        cantidad: boleta.cantidad,
        monto_total: boleta.montoTotal,
        id_reserva: boleta.idReserva,
        id_equipamiento: boleta.idEquipamiento,
        equipamiento: boleta.equipamiento ? {
          id_equipamiento: boleta.equipamiento.id,
          nombre: boleta.equipamiento.nombre,
          tipo: boleta.equipamiento.tipo,
          costo: boleta.equipamiento.costo
        } : null
      })) || [],
      // Transform historial if available
      historial: reserva.historiales?.map(historial => ({
        id_historial: historial.id,
        estado: historial.estado,
        fecha_estado: historial.fechaEstado,
        id_reserva: historial.idReserva,
        id_usuario: historial.idUsuario
      })) || []
    };
  }  @Post()
  async create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    try {
      console.log('Datos de reserva recibidos:', createReservaDto);
      
      // Verificar si el usuario es administrador
      const isAdmin = req.user.isAdmin;
      console.log('Usuario es admin:', isAdmin);
      
      // Validación manual de datos
      const usuario = await this.reservaService['usuarioRepository'].findOne({ 
        where: { rut: createReservaDto.rut_usuario } 
      });
      console.log('Usuario encontrado:', usuario ? 'Sí' : 'No');
      if (usuario) {
        console.log('Saldo del usuario:', usuario.saldo);
      }
      
      const cancha = await this.reservaService['canchaRespository'].findOne({ 
        where: { numero: createReservaDto.numero_cancha } 
      });
      console.log('Cancha encontrada:', cancha ? 'Sí' : 'No');
      if (cancha) {
        console.log('Cancha en mantenimiento:', cancha.mantenimiento);
        console.log('Valor de la cancha:', cancha.valor);
      }
      
      try {
        const reservaResponse = await this.reservaService.create(createReservaDto, isAdmin);
        
        if (!reservaResponse.data) {
          return {
            statusCode: 400,
            message: reservaResponse.message || 'Error al crear la reserva',
            data: null,
            success: false,
            error: reservaResponse.error
          };
        }
        
        return {
          statusCode: 201,
          message: reservaResponse.message,
          data: this.transformReservaResponse(reservaResponse.data),
          success: true
        };
      } catch (serviceError) {
        console.error('Error específico en el servicio:', serviceError.message);
        return {
          statusCode: 400,
          message: serviceError.message || 'Error al crear la reserva',
          data: null,
          success: false,
          error: serviceError.stack
        };
      }
    } catch (error) {
      console.error('Error general en create reserva:', error);
      return {
        statusCode: 400,
        message: error.message || 'Error al crear la reserva',
        data: null,
        success: false,
        error: error.stack
      };
    }
  }@Get()
  @Roles('admin')
  async findAll() {
    try {
      const reservasResponse = await this.reservaService.findAll();
      
      if (!reservasResponse.data) {
        return {
          statusCode: 200,
          message: 'No hay reservas registradas',
          data: [],
          success: true
        };
      }
      
      return {
        statusCode: 200,
        message: reservasResponse.message,
        data: reservasResponse.data.map(reserva => this.transformReservaResponse(reserva)),
        success: true
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Error al obtener las reservas',
        data: [],
        success: false
      };
    }
  }  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const response = await this.reservaService.findOne(+id);
      const reserva = response.data;
      
      // Solo permitir acceso a la reserva si es admin o es el propietario
      if (!reserva) {
        return {
          statusCode: 404,
          message: `Reserva con ID ${id} no encontrada`,
          data: null,
          success: false
        };
      }
      
      if (!req.user.isAdmin && reserva.idUsuario !== req.user.id) {
        return {
          statusCode: 403,
          message: 'No tiene permisos para acceder a esta reserva',
          data: null,
          success: false
        };
      }
      
      return {
        statusCode: 200,
        message: response.message,
        data: this.transformReservaResponse(reserva),
        success: true
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Error al obtener la reserva',
        data: null,
        success: false
      };
    }
  }  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateReservaDto: UpdateReservaDto,
    @Request() req
  ) {
    try {
      // Verificar si el usuario es administrador
      const isAdmin = req.user.isAdmin;
      
      // Si no es admin, verificar que el usuario sea dueño de la reserva
      if (!isAdmin) {
        const reservaResponse = await this.reservaService.findOne(+id);
        if (reservaResponse.data && reservaResponse.data.idUsuario !== req.user.id) {
          return {
            statusCode: 403,
            message: 'No tiene permisos para actualizar esta reserva',
            data: null,
            success: false
          };
        }
      }
      
      const reservaResponse = await this.reservaService.update(+id, updateReservaDto, isAdmin);
      
      if (!reservaResponse.data) {
        return {
          statusCode: 404,
          message: `Reserva con ID ${id} no encontrada`,
          data: null,
          success: false
        };
      }
      
      return {
        statusCode: 200,
        message: reservaResponse.message,
        data: this.transformReservaResponse(reservaResponse.data),
        success: true
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message || 'Error al actualizar la reserva',
        data: null,
        success: false
      };
    }
  }  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      // Verificar si el usuario es administrador
      const isAdmin = req.user.isAdmin;
      
      // Si no es admin, verificar que el usuario sea dueño de la reserva
      if (!isAdmin) {
        const reservaResponse = await this.reservaService.findOne(+id);
        if (reservaResponse.data && reservaResponse.data.idUsuario !== req.user.id) {
          return {
            statusCode: 403,
            message: 'No tiene permisos para cancelar esta reserva',
            data: null,
            success: false
          };
        }
      }
      
      await this.reservaService.remove(+id, isAdmin);
      return {
        statusCode: 200,
        message: 'Reserva cancelada exitosamente',
        data: null,
        success: true
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message || 'Error al cancelar la reserva',
        data: null,
        success: false
      };
    }
  }@Get('usuario/:rut')
  async findByUsuario(@Param('rut') rut: string, @Request() req) {
    try {
      // Solo permitir ver las reservas si es admin o es el mismo usuario
      if (!req.user.isAdmin && req.user.rut !== rut) {
        return {
          statusCode: 403,
          message: 'No tiene permisos para ver las reservas de este usuario',
          data: [],
          success: false
        };
      }

      const reservasResponse = await this.reservaService.findByUsuario(rut);
      
      if (!reservasResponse.data) {
        return {
          statusCode: 200,
          message: `No hay reservas registradas para el usuario con RUT ${rut}`,
          data: [],
          success: true
        };
      }
      
      return {
        statusCode: 200,
        message: reservasResponse.message,
        data: reservasResponse.data.map(reserva => this.transformReservaResponse(reserva)),
        success: true
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Error al obtener las reservas del usuario',
        data: [],
        success: false
      };
    }
  }  @Get('cancha/:numero')
  async findByCancha(@Param('numero') numero: string) {
    try {
      const reservasResponse = await this.reservaService.findByCancha(+numero);
      
      if (!reservasResponse.data) {
        return {
          statusCode: 200,
          message: `No hay reservas registradas para la cancha número ${numero}`,
          data: [],
          success: true
        };
      }
      
      return {
        statusCode: 200,
        message: reservasResponse.message,
        data: reservasResponse.data.map(reserva => this.transformReservaResponse(reserva)),
        success: true
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Error al obtener las reservas de la cancha',
        data: [],
        success: false
      };
    }
  }@Get('disponibilidad/:numero/:fecha/:horaInicio/:horaTermino')
  async verificarDisponibilidad(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string,
    @Param('horaInicio') horaInicio: string,
    @Param('horaTermino') horaTermino: string
  ) {
    try {
      const disponibilidadResponse = await this.reservaService.verificarDisponibilidad(
        +numero, 
        fecha, 
        horaInicio, 
        horaTermino
      );
      
      const disponible = disponibilidadResponse.data ? disponibilidadResponse.data.disponible : false;
      
      return {
        statusCode: 200,
        message: disponibilidadResponse.message,
        data: { disponible },
        success: true
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message || 'Error al verificar la disponibilidad',
        data: { disponible: false },
        success: false
      };
    }
  }  @Get('disponibilidad-dia/:numero/:fecha')
  async obtenerHorariosDisponibles(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string
  ) {
    try {
      const horariosResponse = await this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
      const horarios = horariosResponse.data ? horariosResponse.data.horariosDisponibles : [];
      
      return {
        statusCode: 200,
        message: horariosResponse.message || `Horarios disponibles para la cancha #${numero} en la fecha ${fecha}`,
        data: { horariosDisponibles: horarios },
        success: true
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message || 'Error al obtener los horarios disponibles',
        data: { horariosDisponibles: [] },
        success: false
      };
    }
  }  @Get('estadisticas')
  @Roles('admin')
  async obtenerEstadisticas() {
    try {
      const estadisticasResponse = await this.reservaService.obtenerEstadisticas();
      
      if (!estadisticasResponse.data) {
        return {
          statusCode: 404,
          message: 'No hay estadísticas disponibles',
          data: null,
          success: false
        };
      }
      
      return {
        statusCode: 200,
        message: estadisticasResponse.message || 'Estadísticas obtenidas exitosamente',
        data: estadisticasResponse.data,
        success: true
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || 'Error al obtener las estadísticas',
        data: null,
        success: false
      };
    }
  }
}
