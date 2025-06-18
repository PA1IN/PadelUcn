import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UpdateAdminDto, AddSaldoUsuarioDto } from './dto/usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Usuario } from './entities/usuario.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { CreateResponse } from '../../common/helpers/create-response.helper';
import { ReservaService } from '../reserva/reserva.service';

// este es para los recordatorios, que no se por que los otros me dieron eror y cree este como global
interface ResultadoRecordatorio {
  rut: string;
  nombre?: string;
  enviado: boolean;
  error?: string;
}

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly notificacionesService: NotificacionesService,
    private readonly reservaService: ReservaService,
  ) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const usuario = await this.usuarioService.create(createUsuarioDto);
      return usuario;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(): Promise<Usuario[]> {
    try {
      const usuarios = await this.usuarioService.findAll();
      return usuarios;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('set-admin/:rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async setAdmin(@Param('rut') rut: string, @Body() updateAdminDto: UpdateAdminDto, @Request() req): Promise<Usuario> {
    try {
      const usuario = await this.usuarioService.setAdmin(rut, updateAdminDto, req.user);
      return usuario;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':rut')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('rut') rut: string, @Request() req): Promise<Usuario> {
    try {
      // Solo administradores o el propio usuario pueden ver un usuario específico
      if (!req.user.is_admin && req.user.rut !== rut) {
        throw new ForbiddenException('No tiene permisos para acceder a este recurso');
      }
      
      const usuario = await this.usuarioService.findByRut(rut);
      return usuario;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':rut')
  @UseGuards(JwtAuthGuard)
  async update(@Param('rut') rut: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @Request() req): Promise<Usuario> {
    try {
      // Solo administradores o el propio usuario pueden actualizar un usuario
      if (!req.user.is_admin && req.user.rut !== rut) {
        throw new ForbiddenException('No tiene permisos para acceder a este recurso');
      }
      
      const usuario = await this.usuarioService.updateByRut(rut, updateUsuarioDto, req.user);
      return usuario;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':rut/addSaldo') 
  @ApiOperation ({summary: 'Agregar saldo a la cuenta de un usuario'})
  @ApiResponse({status: 200, description: 'Saldo actulizado exitosamente'})
  @ApiResponse({status:404, description: 'Usuario no encontrado'})
  @ApiResponse({status: 400, description: 'Datos invalidos'})
  @ApiResponse({status: 401, description: 'No autorizado'})
  async addSaldo(
    @Param('rut') rut: string,
    @Body() addSaldoDto: AddSaldoUsuarioDto
  ){
    return this.usuarioService.addSaldo(rut, addSaldoDto);
  }
  
  @Delete(':rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('rut') rut: string, @Request() req): Promise<null> {
    try {
      await this.usuarioService.removeByRut(rut, req.user);
      return null;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @Post('recordatorios/individual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async enviarRecordatorioIndividual(
    @Body() data: { 
      rut: string; 
      titulo: string; 
      mensaje: string; 
      idReserva?: number 
    }
  ) {
    try {
      // Buscar usuario por RUT
      const usuario = await this.usuarioService.findByRut(data.rut);
      
      if (!usuario) {
        return CreateResponse(
          'Usuario no encontrado',
          null,
          'ERROR'
        );
      }

      // Crear notificación de recordatorio
      await this.notificacionesService.create({
        titulo: data.titulo,
        mensaje: data.mensaje,
        tipoEvento: 'recordatorio',
        idUsuario: usuario.id_usuario,
        idReserva: data.idReserva || null
      });

      return CreateResponse(
        `Recordatorio enviado exitosamente a ${data.rut}`,
        { 
          rut: data.rut,
          nombre: usuario.nombre_usuario,
          titulo: data.titulo 
        },
        'SUCCESS' 
      );
    } catch (error) {
      return CreateResponse(
        'Error al enviar recordatorio',
        null,
        'ERROR'
      );
    }
  }

  @Post('recordatorios/masivo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async enviarRecordatorioMasivo(
    @Body() data: { 
      ruts: string[]; 
      titulo: string; 
      mensaje: string 
    }
  ) {
    try {
      
      const resultados: ResultadoRecordatorio[] = [];
      
      for (const rut of data.ruts) {
        try {
          const usuario = await this.usuarioService.findByRut(rut);
          
          if (usuario) {
            await this.notificacionesService.create({
              titulo: data.titulo,
              mensaje: data.mensaje,
              tipoEvento: 'recordatorio',
              idUsuario: usuario.id_usuario,
              idReserva: null
            });
            
            resultados.push({
              rut,
              nombre: usuario.nombre_usuario,
              enviado: true
            });
          } else {
            resultados.push({
              rut,
              enviado: false,
              error: 'Usuario no encontrado'
            });
          }
        } catch (error) {
          resultados.push({
            rut,
            enviado: false,
            error: error.message
          });
        }
      }

      const exitosos = resultados.filter(r => r.enviado).length;
      const fallidos = resultados.filter(r => !r.enviado).length;

      return CreateResponse(
        `Recordatorios procesados: ${exitosos} exitosos, ${fallidos} fallidos`,
        {
          resumen: { exitosos, fallidos, total: data.ruts.length },
          detalle: resultados
        },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al procesar recordatorios masivos',
        null,
        'ERROR'
      );
    }
  }

  @Post('recordatorios/reservas-proximas')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin')
  async recordarReservasProximas(
    @Body() data: { 
      horasAntes: number;
      mensaje?: string 
    }
  ) {
    try {
      
      const reservasResponse = await this.reservaService.obtenerReservasActivas();
      
      if (!reservasResponse.success || !reservasResponse.data) {
        return CreateResponse(
          'No se pudieron obtener las reservas activas',
          null,
          'ERROR'
        );
      }

      //proximas reservas
      const ahora = new Date();
      const fechaLimite = new Date();
      fechaLimite.setHours(fechaLimite.getHours() + data.horasAntes);
      
      const reservasProximas = reservasResponse.data.filter(reserva => {
        // Combinar fecha y hora de la reserva
        const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora_inicio}`);
        
        // Verificar si está dentro del rango de tiempo
        return fechaReserva >= ahora && fechaReserva <= fechaLimite;
      });

      
      const recordatoriosEnviados: ResultadoRecordatorio[] = [];
      
      for (const reserva of reservasProximas) {
        try {
          
          const numeroCancha = reserva.cancha?.numero || 'N/A';
          const mensajePersonalizado = data.mensaje || 
            ` Recordatorio: Tienes una reserva para ${reserva.fecha} a las ${reserva.hora_inicio} en la cancha ${numeroCancha}. ¡No olvides asistir!`;
          
          await this.notificacionesService.create({
            titulo: 'Recordatorio de Reserva Próxima',
            mensaje: mensajePersonalizado,
            tipoEvento: 'recordatorio',
            idUsuario: reserva.usuario.id_usuario,
            idReserva: reserva.id 
          });
          
          recordatoriosEnviados.push({
            rut: reserva.usuario.rut,
            nombre: reserva.usuario.nombre_usuario,
            enviado: true
          });
        } catch (error) {
          recordatoriosEnviados.push({
            rut: reserva.usuario?.rut || 'Desconocido',
            nombre: reserva.usuario?.nombre_usuario || 'Desconocido',
            enviado: false,
            error: error.message
          });
        }
      }

      const exitosos = recordatoriosEnviados.filter(r => r.enviado).length;
      const fallidos = recordatoriosEnviados.filter(r => !r.enviado).length;

      return CreateResponse(
        `Recordatorios automáticos procesados: ${exitosos} enviados, ${fallidos} fallidos`,
        {
          horasAntes: data.horasAntes,
          reservasEncontradas: reservasProximas.length,
          recordatoriosEnviados: exitosos,
          recordatoriosFallidos: fallidos,
          detalle: recordatoriosEnviados.map(r => ({
            rut: r.rut,
            nombre: r.nombre,
            enviado: r.enviado,
            ...(r.error && { error: r.error })
          }))
        },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al enviar recordatorios de reservas próximas',
        null,
        'ERROR'
      );
    }
  }
}