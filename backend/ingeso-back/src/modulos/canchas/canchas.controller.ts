import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cancha } from './entities/cancha.entity';

@ApiTags('canchas')
@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cancha' })
  @ApiResponse({ status: 201, description: 'Cancha creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o cancha ya existente' })
  async create(@Body() createCanchaDto: CreateCanchaDto) {
    return await this.canchasService.create(createCanchaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las canchas' })
  @ApiResponse({ status: 200, description: 'Lista de canchas obtenida exitosamente' })
  async findAll() {
    return await this.canchasService.findAll();
  }

  @Get(':numero')
  @ApiOperation({ summary: 'Obtener una cancha por su número' })
  @ApiResponse({ status: 200, description: 'Cancha obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Cancha no encontrada' })
  async findOne(@Param('numero') numero: string) {
    return await this.canchasService.findOne(+numero);
  }

  @Patch(':numero')
  @ApiOperation({ summary: 'Actualizar una cancha existente' })
  @ApiResponse({ status: 200, description: 'Cancha actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cancha no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async update(@Param('numero') numero: string, @Body() updateCanchaDto: UpdateCanchaDto) {
    return await this.canchasService.update(+numero, updateCanchaDto);
  }

  @Delete(':numero')
  @ApiOperation({ summary: 'Eliminar una cancha' })
  @ApiResponse({ status: 200, description: 'Cancha eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cancha no encontrada' })
  async remove(@Param('numero') numero: string) {
    return await this.canchasService.remove(+numero);
  }
}
