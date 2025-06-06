import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UpdateAdminDto } from './dto/usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
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
}