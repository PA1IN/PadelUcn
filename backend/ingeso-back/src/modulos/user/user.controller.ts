import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard) // Protegemos todas las rutas con JWT
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

  @Patch(':rut')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @SwaggerResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  update(@Param('rut') rut: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(rut, updateUserDto);
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
