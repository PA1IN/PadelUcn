import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipamientoService } from './equipamiento.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { Equipamiento } from './entities/equipamiento.entity';

@Controller('equipamiento')
export class EquipamientoController {
  constructor(private readonly equipamientoService: EquipamientoService) {}

  @Post()
  async create(@Body() createEquipamientoDto: CreateEquipamientoDto): Promise<Equipamiento | null> {
    const result = await this.equipamientoService.create(createEquipamientoDto);
    return result.data;
  }
  @Get()
  async findAll() {
    const result = await this.equipamientoService.findAll();
    const equipamientos = result.data || [];
    
    return equipamientos.map(equipamiento => ({
      id_equipamiento: equipamiento.id,
      nombre: equipamiento.nombre,
      tipo: equipamiento.tipo,
      costo: equipamiento.costo,
      stock: equipamiento.stock
    }));
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.equipamientoService.findOne(+id);
    const equipamiento = result.data;
    
    if (!equipamiento) return null;
    
    return {
      id_equipamiento: equipamiento.id,
      nombre: equipamiento.nombre,
      tipo: equipamiento.tipo,
      costo: equipamiento.costo,
      stock: equipamiento.stock
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEquipamientoDto: UpdateEquipamientoDto): Promise<Equipamiento | null> {
    const result = await this.equipamientoService.update(+id, updateEquipamientoDto);
    return result.data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<null> {
    await this.equipamientoService.remove(+id);
    return null;
  }
}
