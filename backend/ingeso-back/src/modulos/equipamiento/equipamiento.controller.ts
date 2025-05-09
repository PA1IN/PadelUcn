import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipamientoService } from './equipamiento.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';

@Controller('equipamiento')
export class EquipamientoController {
  constructor(private readonly equipamientoService: EquipamientoService) {}

  @Post()
  create(@Body() createEquipamientoDto: CreateEquipamientoDto) {
    return this.equipamientoService.create(createEquipamientoDto);
  }

  @Get()
  findAll() {
    return this.equipamientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipamientoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipamientoDto: UpdateEquipamientoDto) {
    return this.equipamientoService.update(+id, updateEquipamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipamientoService.remove(+id);
  }
}
