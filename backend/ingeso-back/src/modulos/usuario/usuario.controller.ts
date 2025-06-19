import { Controller, Get, Post, Body, Patch, Param, Query, Delete, UseGuards, Request, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
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
import { CanchaService } from '../cancha/cancha.service';
import { EquipamientoService } from '../equipamiento/equipamiento.service';
import { TransaccionService } from '../transaccion/transaccion.service';


interface ResultadoRecordatorio {
  id: number;
  tipo: string;
  destinatario: string;
  mensaje: string;
  fecha_envio: string;
  estado: string;
}

// para cancha
interface NuevaCanchaDto {
  numero: number;
  nombre: string;
  descripcion: string;
  valor: number;
  cantidad_max_jugadores: number;
}

// nuevo equipamiento
interface NuevoEquipamientoDto {
  nombre: string;
  tipo: string;
  costo: number;
  stock: number;
}

// nuevo cliente
interface NuevoClienteDto {
  rut: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion?: string;
  contraseña: string;
  saldo?: number;
  is_admin?: boolean;
}

// estadisticas del cliente (afinar esto)
interface ClienteConEstadisticas {
  id_usuario: number;
  rut: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion?: string;
  saldo: number;
  is_admin: boolean;
  fecha_registro?: string;
  total_reservas: number;
  ultima_reserva: string | null;
}

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly notificacionesService: NotificacionesService,
    private readonly reservaService: ReservaService,
    private readonly canchaService: CanchaService,
    private readonly equipamientoService: EquipamientoService,
    private readonly transaccionService: TransaccionService,
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

  // GET /api/admin/canchas (para front)
  @Get('/admin/canchas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async obtenerCanchasAdminFrontend() {
    try {
      const canchas = await this.canchaService.obtenerTodasLasCanchas();
      
      return CreateResponse(
        `${canchas.length} canchas encontradas`,
        canchas,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener canchas',
        error.message,
        'ERROR'
      );
    }
  }

  // POST /api/admin/canchas (para front)
  @Post('/admin/canchas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async crearCanchaAdminFrontend(@Body() nuevaCancha: NuevaCanchaDto) {
    try {
      // Verificar que no exista una cancha con el mismo número
      const canchaExistente = await this.canchaService.obtenerCanchaPorNumero(nuevaCancha.numero);
      
      if (canchaExistente) {
        return CreateResponse(
          'Ya existe una cancha con este número',
          null,
          'ERROR'
        );
      }

      const cancha = await this.canchaService.crearCancha({
        numero: nuevaCancha.numero,
        nombre: nuevaCancha.nombre,
        descripcion: nuevaCancha.descripcion,
        valor: nuevaCancha.valor,
        cantidad_max_jugadores: nuevaCancha.cantidad_max_jugadores,
        mantenimienti: false // Default: no en mantenimiento
      });

      //  notificacion a todos los usuarios de una nueva cancha
      await this.notificarNuevaCancha(cancha);

      return CreateResponse(
        'Cancha creada exitosamente',
        cancha,
        'CREATED'
      );
    } catch (error) {
      return CreateResponse(
        'Error al crear cancha',
        error.message,
        'ERROR'
      );
    }
  }

  // PATCH /api/admin/canchas/:id (para el front)
  @Patch('/admin/canchas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async actualizarCanchaAdminFrontend(
    @Param('id') id: number,
    @Body() datosActualizacion: Partial<NuevaCanchaDto>
  ) {
    try {
      const cancha = await this.canchaService.obtenerCanchaPorId(id);
      
      if (!cancha) {
        return CreateResponse(
          'Cancha no encontrada',
          null,
          'ERROR'
        );
      }

      // Si se está cambiando el número, verificar que no exista otro con ese número
      if (datosActualizacion.numero && datosActualizacion.numero !== cancha.numero) {
        const canchaConNumero = await this.canchaService.obtenerCanchaPorNumero(datosActualizacion.numero);
        
        if (canchaConNumero && canchaConNumero.id !== id) {
          return CreateResponse(
            'Ya existe una cancha con este número',
            null,
            'ERROR'
          );
        }
      }

      const canchaActualizada = await this.canchaService.actualizarCancha(id, datosActualizacion);

      return CreateResponse(
        'Cancha actualizada exitosamente',
        canchaActualizada,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al actualizar cancha',
        error.message,
        'ERROR'
      );
    }
  }

  //  DELETE /api/admin/canchas/:id  (para el front)
  @Delete('/admin/canchas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async eliminarCanchaAdminFrontend(@Param('id') id: number) {
    try {
      const cancha = await this.canchaService.obtenerCanchaPorId(id);
      
      if (!cancha) {
        return CreateResponse(
          'Cancha no encontrada',
          null,
          'ERROR'
        );
      }

      // Verificar si tiene reservas activas
      const tieneReservasActivas = await this.reservaService.verificarReservasActivasCancha(id);
      
      if (tieneReservasActivas) {
        return CreateResponse(
          'No se puede eliminar la cancha porque tiene reservas activas',
          null,
          'ERROR'
        );
      }

      await this.canchaService.eliminarCancha(id);

      return CreateResponse(
        'Cancha eliminada exitosamente',
        { id_cancha: id },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al eliminar cancha',
        error.message,
        'ERROR'
      );
    }
  }

  // PATCH /api/admin/canchas/:id/mantenimiento (para el front)
  @Patch('/admin/canchas/:id/mantenimiento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async cambiarEstadoMantenimientoFrontend(
    @Param('id') id: number,
    @Body() data: { mantenimiento: boolean }
  ) {
    try {
      const cancha = await this.canchaService.obtenerCanchaPorId(id);
      
      if (!cancha) {
        return CreateResponse(
          'Cancha no encontrada',
          null,
          'ERROR'
        );
      }

      const canchaActualizada = await this.canchaService.actualizarCancha(id, {
        mantenimiento: data.mantenimiento
      });

      const estado = data.mantenimiento ? 'en mantenimiento' : 'disponible';

      return CreateResponse(
        `Cancha marcada como ${estado}`,
        canchaActualizada,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al cambiar estado de mantenimiento',
        error.message,
        'ERROR'
      );
    }
  }

  //  GET /api/admin/recordatorios (para el front)
  @Get('/admin/recordatorios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getHistorialRecordatoriosFrontend() {
    try {
      // Obtener todas las notificaciones de tipo recordatorio
      const query = `
        SELECT 
          n.id_notificacion as id,
          n.tipo_evento as tipo,
          u.rut as destinatario,
          n.mensaje,
          n.fecha_creacion as fecha_envio,
          CASE WHEN n.id_notificacion IS NOT NULL THEN 'enviado' ELSE 'fallido' END as estado
        FROM notificacion n
        JOIN usuario u ON n.id_usuario = u.id_usuario
        WHERE n.tipo_evento IN ('reserva', 'cancha_nueva', 'pago_pendiente', 'recordatorio')
        ORDER BY n.fecha_creacion DESC;
      `;
      
      const historial = await this.notificacionesService['notificacionRepository'].query(query);

      return CreateResponse(
        `${historial.length} recordatorios en historial`,
        historial,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener historial de recordatorios',
        error.message,
        'ERROR'
      );
    }
  }

  //  POST /api/admin/recordatorios (para el front)
  @Post('/admin/recordatorios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async enviarRecordatorioFrontend(
    @Body() data: { 
      tipo: "reserva" | "cancha_nueva" | "pago_pendiente";
      destinatarios: string[];
      mensaje: string;
      id_reserva?: number;
      id_cancha?: number;
    }
  ) {
    try {
      if (data.destinatarios.length === 1) {
        const rut = data.destinatarios[0];
        const usuario = await this.usuarioService.findByRut(rut);
        
        if (!usuario) {
          return CreateResponse(
            'Usuario no encontrado',
            null,
            'ERROR'
          );
        }

        await this.notificacionesService.create({
          titulo: this.getTituloByTipo(data.tipo),
          mensaje: data.mensaje,
          tipoEvento: data.tipo,
          idUsuario: usuario.id_usuario,
          idReserva: data.id_reserva || null
        });

        const resultado: ResultadoRecordatorio = {
          id: Date.now(),
          tipo: data.tipo,
          destinatario: rut,
          mensaje: data.mensaje,
          fecha_envio: new Date().toISOString(),
          estado: 'enviado'
        };

        return CreateResponse(
          'Recordatorio enviado exitosamente',
          resultado,
          'SUCCESS'
        );
      } else {
        return this.enviarRecordatorioMasivoFrontend(data);
      }
    } catch (error) {
      return CreateResponse(
        'Error al enviar recordatorio',
        error.message,
        'ERROR'
      );
    }
  }

  // POST /api/admin/recordatorios/masivo (para el front)
  @Post('/admin/recordatorios/masivo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async enviarRecordatorioMasivoFrontend(
    @Body() data: { 
      tipo: "reserva" | "cancha_nueva" | "pago_pendiente";
      destinatarios: string[];
      mensaje: string;
      id_reserva?: number;
      id_cancha?: number;
    }
  ) {
    try {
      const resultados: ResultadoRecordatorio[] = [];
      
      for (const rut of data.destinatarios) {
        try {
          const usuario = await this.usuarioService.findByRut(rut);
          
          if (usuario) {
            await this.notificacionesService.create({
              titulo: this.getTituloByTipo(data.tipo),
              mensaje: data.mensaje,
              tipoEvento: data.tipo,
              idUsuario: usuario.id_usuario,
              idReserva: data.id_reserva || null
            });
            
            resultados.push({
              id: Date.now() + Math.random(),
              tipo: data.tipo,
              destinatario: rut,
              mensaje: data.mensaje,
              fecha_envio: new Date().toISOString(),
              estado: 'enviado'
            });
          } else {
            resultados.push({
              id: Date.now() + Math.random(),
              tipo: data.tipo,
              destinatario: rut,
              mensaje: data.mensaje,
              fecha_envio: new Date().toISOString(),
              estado: 'fallido'
            });
          }
        } catch (error) {
          resultados.push({
            id: Date.now() + Math.random(),
            tipo: data.tipo,
            destinatario: rut,
            mensaje: data.mensaje,
            fecha_envio: new Date().toISOString(),
            estado: 'fallido'
          });
        }
      }

      const exitosos = resultados.filter(r => r.estado === 'enviado').length;
      const fallidos = resultados.filter(r => r.estado === 'fallido').length;

      return CreateResponse(
        `Recordatorios masivos: ${exitosos} exitosos, ${fallidos} fallidos`,
        resultados,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al enviar recordatorios masivos',
        error.message,
        'ERROR'
      );
    }
  }

  // POST /api/admin/recordatorios/anticipados (para el front)
  @Post('/admin/recordatorios/anticipados')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async recordarReservasProximasFrontend(
    @Body() data: { 
      horasAntes: number;
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

      const ahora = new Date();
      const fechaLimite = new Date();
      fechaLimite.setHours(fechaLimite.getHours() + data.horasAntes);
      
      const reservasProximas = reservasResponse.data.filter(reserva => {
        const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora_inicio}`);
        return fechaReserva >= ahora && fechaReserva <= fechaLimite;
      });

      const recordatoriosEnviados: ResultadoRecordatorio[] = [];
      
      for (const reserva of reservasProximas) {
        try {
          const numeroCancha = reserva.cancha?.numero || 'N/A';
          const mensaje = `Recordatorio: Tienes una reserva para ${reserva.fecha} a las ${reserva.hora_inicio} en la cancha ${numeroCancha}. ¡No olvides asistir!`;
          
          await this.notificacionesService.create({
            titulo: 'Recordatorio de Reserva Próxima',
            mensaje,
            tipoEvento: 'reserva',
            idUsuario: reserva.usuario.id_usuario,
            idReserva: reserva.id 
          });
          
          recordatoriosEnviados.push({
            id: Date.now() + Math.random(),
            tipo: 'reserva',
            destinatario: reserva.usuario.rut,
            mensaje,
            fecha_envio: new Date().toISOString(),
            estado: 'enviado'
          });
        } catch (error) {
          recordatoriosEnviados.push({
            id: Date.now() + Math.random(),
            tipo: 'reserva',
            destinatario: reserva.usuario?.rut || 'Desconocido',
            mensaje: 'Error al enviar',
            fecha_envio: new Date().toISOString(),
            estado: 'fallido'
          });
        }
      }

      return CreateResponse(
        `Recordatorios anticipados enviados: ${recordatoriosEnviados.length}`,
        recordatoriosEnviados,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al enviar recordatorios anticipados',
        error.message,
        'ERROR'
      );
    }
  }

  //GET /api/admin/equipamientos (para el front)
  @Get('/admin/equipamientos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async obtenerEquipamientosAdminFrontend() {
    try {
      const equipamientosResponse = await this.equipamientoService.findAll();
      
      if (!equipamientosResponse || !equipamientosResponse.data) {
        return CreateResponse(
          'No se pudieron obtener los equipamientos',
          [],
          'ERROR'
        );
      }
      
      return CreateResponse(
        `${equipamientosResponse.data.length} equipamientos encontrados`,
        equipamientosResponse.data,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener equipamientos',
        error.message,
        'ERROR'
      );
    }
  }

  // POST /api/admin/equipamiento - (para el frontend)
  @Post('/admin/equipamiento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async crearEquipamientoAdminFrontend(@Body() nuevoEquipamiento: NuevoEquipamientoDto) {
    try {
      const equipamientoResponse = await this.equipamientoService.create({
        nombre: nuevoEquipamiento.nombre,
        tipo: nuevoEquipamiento.tipo,
        costo: nuevoEquipamiento.costo,
        stock: nuevoEquipamiento.stock
      });

      if (!equipamientoResponse || !equipamientoResponse.data) {
        return CreateResponse(
          'Error al crear equipamiento',
          null,
          'ERROR'
        );
      }

      return CreateResponse(
        'Equipamiento creado exitosamente',
        equipamientoResponse.data,
        'CREATED'
      );
    } catch (error) {
      return CreateResponse(
        'Error al crear equipamiento',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ PATCH /api/admin/equipamiento/:id - COMPATIBLE CON FRONTEND
  @Patch('/admin/equipamiento/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async actualizarEquipamientoAdminFrontend(
    @Param('id') id: number,
    @Body() datosActualizacion: Partial<NuevoEquipamientoDto>
  ) {
    try {
      const equipamientoResponse = await this.equipamientoService.update(id, datosActualizacion);

      if (!equipamientoResponse || !equipamientoResponse.data) {
        return CreateResponse(
          'Error al actualizar equipamiento',
          null,
          'ERROR'
        );
      }

      return CreateResponse(
        'Equipamiento actualizado exitosamente',
        equipamientoResponse.data,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al actualizar equipamiento',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ GET /api/admin/clientes - COMPATIBLE CON FRONTEND
  @Get('/admin/clientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async obtenerClientesAdminFrontend() {
    try {
      const usuarios = await this.usuarioService.findAll();
      const clientesConEstadisticas: ClienteConEstadisticas[] = [];
      
      for (const usuario of usuarios) {
        const estadisticas = await this.obtenerEstadisticasUsuario(usuario.id_usuario);
        
        clientesConEstadisticas.push({
          id_usuario: usuario.id_usuario,
          rut: usuario.rut,
          nombre: usuario.nombre_usuario,
          correo: usuario.correo,
          telefono: usuario.telefono,
          direccion: undefined,
          saldo: usuario.saldo,
          is_admin: usuario.is_admin,
          fecha_registro: undefined,
          total_reservas: estadisticas.totalReservas,
          ultima_reserva: estadisticas.ultimaReserva
        });
      }
      
      return CreateResponse(
        `${clientesConEstadisticas.length} clientes encontrados`,
        clientesConEstadisticas,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener clientes',
        error.message,
        'ERROR'
      );
    }
  }

  // ✅ POST /api/admin/clientes - COMPATIBLE CON FRONTEND
  @Post('/admin/clientes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async crearClienteAdminFrontend(@Body() nuevoCliente: NuevoClienteDto) {
    try {
      const createUsuarioDto: CreateUsuarioDto = {
        rut: nuevoCliente.rut,
        nombre_usuario: nuevoCliente.nombre,
        correo: nuevoCliente.correo,
        telefono: nuevoCliente.telefono,
        contrasena: nuevoCliente.contraseña
      };

      const usuario = await this.usuarioService.create(createUsuarioDto);

      if (nuevoCliente.saldo && nuevoCliente.saldo > 0) {
        await this.usuarioService.addSaldo(usuario.rut, { monto: nuevoCliente.saldo });
      }

      if (nuevoCliente.is_admin) {
        await this.usuarioService.setAdmin(usuario.rut, { isAdmin: true }, { is_admin: true });
      }

      const usuarioActualizado = await this.usuarioService.findByRut(usuario.rut);
      const estadisticas = await this.obtenerEstadisticasUsuario(usuarioActualizado.id_usuario);

      const clienteRespuesta: ClienteConEstadisticas = {
        id_usuario: usuarioActualizado.id_usuario,
        rut: usuarioActualizado.rut,
        nombre: usuarioActualizado.nombre_usuario,
        correo: usuarioActualizado.correo,
        telefono: usuarioActualizado.telefono,
        direccion: undefined,
        saldo: usuarioActualizado.saldo,
        is_admin: usuarioActualizado.is_admin,
        fecha_registro: undefined,
        total_reservas: estadisticas.totalReservas,
        ultima_reserva: estadisticas.ultimaReserva
      };

      return CreateResponse(
        'Cliente creado exitosamente',
        clienteRespuesta,
        'CREATED'
      );
    } catch (error) {
      return CreateResponse(
        'Error al crear cliente',
        error.message,
        'ERROR'
      );
    }
  }

  // PATCH /api/usuarios/admin/clientes/:rut - ACTUALIZAR CLIENTE (ADMIN)
  @Patch('admin/clientes/:rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async actualizarClienteAdmin(
    @Param('rut') rut: string,
    @Body() datosActualizacion: Partial<NuevoClienteDto>
  ) {
    try {
      const usuario = await this.usuarioService.findByRut(rut);
      
      if (!usuario) {
        return CreateResponse(
          'Cliente no encontrado',
          null,
          'ERROR'
        );
      }

      // Mapear los datos para actualización
      const updateUsuarioDto: UpdateUsuarioDto = {};
      
      if (datosActualizacion.nombre) {
        updateUsuarioDto.nombre_usuario = datosActualizacion.nombre;
      }
      if (datosActualizacion.correo) {
        updateUsuarioDto.correo = datosActualizacion.correo;
      }
      if (datosActualizacion.telefono) {
        updateUsuarioDto.telefono = datosActualizacion.telefono;
      }
      if (datosActualizacion.contraseña) {
        updateUsuarioDto.contrasena = datosActualizacion.contraseña;
      }

      // Actualizar datos básicos
      const usuarioActualizado = await this.usuarioService.updateByRut(
        rut, 
        updateUsuarioDto, 
        { is_admin: true } // Simular usuario admin
      );

      // Actualizar saldo si se especifica
      if (datosActualizacion.saldo !== undefined) {
        const diferenciaSaldo = datosActualizacion.saldo - usuarioActualizado.saldo;
        if (diferenciaSaldo !== 0) {
          await this.usuarioService.addSaldo(rut, { monto: diferenciaSaldo });
        }
      }

      // Actualizar rol de admin si se especifica
      if (datosActualizacion.is_admin !== undefined) {
        await this.usuarioService.setAdmin(
          rut, 
          { isAdmin: datosActualizacion.is_admin }, 
          { is_admin: true }
        );
      }

      // Obtener el usuario final actualizado
      const usuarioFinal = await this.usuarioService.findByRut(rut);
      const estadisticas = await this.obtenerEstadisticasUsuario(usuarioFinal.id_usuario);

      const clienteRespuesta: ClienteConEstadisticas = {
        id_usuario: usuarioFinal.id_usuario,
        rut: usuarioFinal.rut,
        nombre: usuarioFinal.nombre_usuario,
        correo: usuarioFinal.correo,
        telefono: usuarioFinal.telefono,
        direccion: undefined,
        saldo: usuarioFinal.saldo,
        is_admin: usuarioFinal.is_admin,
        fecha_registro: undefined,
        total_reservas: estadisticas.totalReservas,
        ultima_reserva: estadisticas.ultimaReserva
      };

      return CreateResponse(
        'Cliente actualizado exitosamente',
        clienteRespuesta,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al actualizar cliente',
        error.message,
        'ERROR'
      );
    }
  }

  // DELETE /api/usuarios/admin/clientes/:rut - ELIMINAR CLIENTE (ADMIN)
  @Delete('admin/clientes/:rut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async eliminarClienteAdmin(@Param('rut') rut: string) {
    try {
      await this.usuarioService.removeByRut(rut, { is_admin: true });

      return CreateResponse(
        'Cliente eliminado exitosamente',
        { rut },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al eliminar cliente',
        error.message,
        'ERROR'
      );
    }
  }

  // PATCH /api/usuarios/admin/clientes/:rut/saldo - ACTUALIZAR SALDO CLIENTE
  @Patch('admin/clientes/:rut/saldo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async actualizarSaldoCliente(
    @Param('rut') rut: string,
    @Body() data: { monto: number }
  ) {
    try {
      const usuarioActualizado = await this.usuarioService.addSaldo(rut, { monto: data.monto });

      return CreateResponse(
        'Saldo actualizado exitosamente',
        {
          rut: usuarioActualizado.rut,
          saldo_anterior: usuarioActualizado.saldo - data.monto,
          saldo_nuevo: usuarioActualizado.saldo,
          monto_agregado: data.monto
        },
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al actualizar saldo',
        error.message,
        'ERROR'
      );
    }
  }

  // GET /api/admin/estadisticas - COMPATIBLE CON FRONTEND
  @Get('/admin/estadisticas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async obtenerEstadisticasAdmin() {
    try {
      const estadisticasResponse = await this.transaccionService.getEstadisticas();
      
      
      if (estadisticasResponse.statusCode !== 200 || !estadisticasResponse.data) {
        return CreateResponse(
          'No se pudieron obtener las estadísticas',
          null,
          'ERROR'
        );
      }
      
      return estadisticasResponse; 
    } catch (error) {
      return CreateResponse(
        'Error al obtener estadísticas',
        error.message,
        'ERROR'
      );
    }
  }

  // GET /api/admin/transacciones - COMPATIBLE CON FRONTEND
  @Get('/admin/transacciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async obtenerTransaccionesAdmin() {
    try {
      const transaccionesResponse = await this.transaccionService.findAllCompletas();
      
      
      if (transaccionesResponse.statusCode !== 200 || !transaccionesResponse.data) {
        return CreateResponse(
          'No se pudieron obtener las transacciones',
          [],
          'ERROR'
        );
      }
      
      return transaccionesResponse; 
    } catch (error) {
      return CreateResponse(
        'Error al obtener transacciones',
        error.message,
        'ERROR'
      );
    }
  }

  // GET /api/admin/transacciones/periodo - COMPATIBLE CON FRONTEND
  @Get('/admin/transacciones/periodo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async obtenerTransaccionesPorPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    try {
      const transaccionesResponse = await this.transaccionService.findByPeriodo(fechaInicio, fechaFin);
      
      if (!transaccionesResponse.success || !transaccionesResponse.data) {
        return CreateResponse(
          'No se pudieron obtener las transacciones del período',
          [],
          'ERROR'
        );
      }
      
      return CreateResponse(
        transaccionesResponse.message,
        transaccionesResponse.data,
        'SUCCESS'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener transacciones por período',
        error.message,
        'ERROR'
      );
    }
  }

  private getTituloByTipo(tipo: string): string {
    switch (tipo) {
      case 'reserva':
        return 'Recordatorio de Reserva';
      case 'cancha_nueva':
        return 'Nueva Cancha Disponible';
      case 'pago_pendiente':
        return 'Pago Pendiente';
      default:
        return 'Recordatorio';
    }
  }

  private async notificarNuevaCancha(cancha: any) {
    try {
      // Obtener todos los usuarios para notificar
      const usuarios = await this.usuarioService.findAll();
      
      for (const usuario of usuarios) {
        await this.notificacionesService.create({
          titulo: 'Nueva Cancha Disponible',
          mensaje: `¡Tenemos una nueva cancha disponible! ${cancha.nombre} - Cancha ${cancha.numero}. ¡Haz tu reserva ahora!`,
          tipoEvento: 'cancha_nueva',
          idUsuario: usuario.id_usuario,
          idReserva: null
        });
      }
    } catch (error) {
      console.error('Error al notificar nueva cancha:', error);
    }
  }

  // obtener estadisticas del usuario (revisar)
  private async obtenerEstadisticasUsuario(idUsuario: number): Promise<{
    totalReservas: number;
    ultimaReserva: string | null;
  }> {
    try {
      // Query para obtener estadísticas de reservas
      const query = `
        SELECT 
          COUNT(*) as total_reservas,
          MAX(fecha) as ultima_reserva
        FROM reserva 
        WHERE id_usuario = $1;
      `;
      
      const resultado = await this.reservaService['reservaRepository'].query(query, [idUsuario]);
      
      return {
        totalReservas: parseInt(resultado[0].total_reservas) || 0,
        ultimaReserva: resultado[0].ultima_reserva || null
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de usuario:', error);
      return {
        totalReservas: 0,
        ultimaReserva: null
      };
    }
  }

}