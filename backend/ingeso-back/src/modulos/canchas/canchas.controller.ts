import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('canchas')
@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Crear una nueva cancha (solo administradores)' })
  @SwaggerResponse({ status: 201, description: 'Cancha creada exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  create(@Body() createCanchaDto: CreateCanchaDto) {
    return this.canchasService.create(createCanchaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las canchas' })
  @SwaggerResponse({ status: 200, description: 'Lista de canchas obtenida exitosamente' })
  findAll() {
    return this.canchasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cancha por su ID' })
  @SwaggerResponse({ status: 200, description: 'Cancha obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  findOne(@Param('id') id: string) {
    return this.canchasService.findOne(+id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar una cancha existente (solo administradores)' })
  @SwaggerResponse({ status: 200, description: 'Cancha actualizada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  update(@Param('id') id: string, @Body() updateCanchaDto: UpdateCanchaDto) {
    return this.canchasService.update(+id, updateCanchaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Eliminar una cancha (solo administradores)' })
  @SwaggerResponse({ status: 200, description: 'Cancha eliminada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  remove(@Param('id') id: string) {
    return this.canchasService.remove(+id);
  }
}
