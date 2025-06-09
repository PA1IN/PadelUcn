import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UpdateAdminDto, AddSaldoUsuarioDto } from './dto/usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Usuario } from './entities/usuario.entity';
import { CreateResponse } from '../../utils/api-response.util';
import { ApiResponse } from '../../interface/Apiresponce';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<ApiResponse<Usuario>> {
    try {
      const usuario = await this.usuarioService.create(createUsuarioDto);
      return CreateResponse(
        'Usuario creado exitosamente',
        usuario,
        'CREATED'
      );
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear usuario', null, 'BAD_REQUEST', error.message, false),
        HttpStatus.BAD_REQUEST
      );
    }
  }
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(): Promise<ApiResponse<Usuario[]>> {
    try {
      const usuarios = await this.usuarioService.findAll();
      return CreateResponse(
        'Usuarios obtenidos exitosamente',
        usuarios,
        'OK'
      );
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener usuarios', null, 'BAD_REQUEST', error.message, false),
        HttpStatus.BAD_REQUEST
      );
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
  }  @Get(':rut')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('rut') rut: string, @Request() req): Promise<Usuario> {
    try {
      // Solo administradores o el propio usuario pueden ver un usuario específico
      if (!req.user.isAdmin && req.user.rut !== rut) {
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
  }  @Patch(':rut')
  @UseGuards(JwtAuthGuard)
  async update(@Param('rut') rut: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @Request() req): Promise<Usuario> {
    try {
      // Solo administradores o el propio usuario pueden actualizar un usuario
      if (!req.user.isAdmin && req.user.rut !== rut) {
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
  }  @Delete(':rut')
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
  @Post(':rut/add-saldo')
  @UseGuards(JwtAuthGuard)
  async addSaldo(@Param('rut') rut: string, @Body() addSaldoDto: AddSaldoUsuarioDto, @Request() req): Promise<ApiResponse<Usuario>> {
    try {
      // Solo administradores o el propio usuario pueden agregar saldo
      if (!req.user.isAdmin && req.user.rut !== rut) {
        throw new ForbiddenException('No tiene permisos para agregar saldo a este usuario');
      }
      
      const usuario = await this.usuarioService.addSaldo(rut, addSaldoDto);
      return CreateResponse(
        `Saldo agregado exitosamente: $${addSaldoDto.monto}`,
        usuario,
        'OK'
      );
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        CreateResponse('Error al agregar saldo', null, 'BAD_REQUEST', error.message, false),
        HttpStatus.BAD_REQUEST
      );
    }
  }
}