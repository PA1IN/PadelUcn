import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';

@Controller('boleta-equipamiento')
export class BoletaEquipamientoController {
  constructor(private readonly boletaEquipamientoService: BoletaEquipamientoService) {}

  @Post()
  create(@Body() createBoletaEquipamientoDto: CreateBoletaEquipamientoDto) {
    return this.boletaEquipamientoService.create(createBoletaEquipamientoDto);
  }

  @Get()
  findAll() {
    return this.boletaEquipamientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletaEquipamientoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoletaEquipamientoDto: UpdateBoletaEquipamientoDto) {
    return this.boletaEquipamientoService.update(+id, updateBoletaEquipamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletaEquipamientoService.remove(+id);
  }
}
