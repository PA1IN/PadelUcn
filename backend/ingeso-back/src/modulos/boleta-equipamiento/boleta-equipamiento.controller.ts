import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
// Define it as a type to avoid import issues
import { IsNumber, IsOptional } from 'class-validator';

// Proper implementation of UpdateDTO with optional fields
export class UpdateBoletaEquipamientoDto {
  @IsNumber()
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  monto_total?: number;

  @IsNumber()
  @IsOptional()
  id_reserva?: number;

  @IsNumber()
  @IsOptional()
  id_equipamiento?: number;
}

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
