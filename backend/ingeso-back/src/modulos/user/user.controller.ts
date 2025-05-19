import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('users')
@Controller(['users', 'user']) // Aceptar tanto 'users' como 'user' como rutas
// Comentamos temporalmente la protección JWT para pruebas
// @UseGuards(JwtAuthGuard) // Protegemos todas las rutas con JWT
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario (administradores)' })
  @SwaggerResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o usuario ya existente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @SwaggerResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.userService.findAll();
  }
  @Get(':rut')
  @ApiOperation({ summary: 'Obtener un usuario por su RUT' })
  @SwaggerResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('rut') rut: string) {
    return this.userService.findOne(rut);
  }
  
  // ENDPOINT TEMPORAL PARA HACER ADMIN - REMOVER EN PRODUCCIÓN
  @Get(':rut/make-admin')
  @ApiOperation({ summary: 'Convertir usuario en administrador (temporal)' })
  @SwaggerResponse({ status: 200, description: 'Usuario convertido en admin exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  async makeAdmin(@Param('rut') rut: string) {
    return this.userService.updateRole(rut, true);
  }

  @Patch(':rut')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @SwaggerResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  update(@Param('rut') rut: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(rut, updateUserDto);
  }  @Patch(':rut/role')
  @ApiOperation({ summary: 'Actualizar rol de un usuario (administradores)' })
  @SwaggerResponse({ status: 200, description: 'Rol de usuario actualizado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  // Temporalmente desactivamos las guardias para pruebas
  // @UseGuards(JwtAuthGuard, AdminGuard) // Solo administradores pueden actualizar roles
  updateRole(@Param('rut') rut: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userService.updateRole(rut, updateRoleDto.isAdmin);
  }

  @Delete(':rut')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @SwaggerResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('rut') rut: string) {
    return this.userService.remove(rut);
  }
}
