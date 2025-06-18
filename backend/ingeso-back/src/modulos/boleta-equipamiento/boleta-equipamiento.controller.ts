import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';




@Controller('boleta-equipamiento')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BoletaEquipamientoController {
  constructor(private readonly boletaEquipamientoService: BoletaEquipamientoService) {}

  @Post()
  @Roles('admin')
  create(@Body() createBoletaEquipamientoDto: CreateBoletaEquipamientoDto) {
    return this.boletaEquipamientoService.create(createBoletaEquipamientoDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.boletaEquipamientoService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.boletaEquipamientoService.findOne(+id);
  }

  @Get('reserva/:idReserva')
  @Roles('admin')
  findByReserva(@Param('idReserva') idReserva: string) {
    return this.boletaEquipamientoService.findByReserva(+idReserva);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateBoletaEquipamientoDto: UpdateBoletaEquipamientoDto) {
    return this.boletaEquipamientoService.update(+id, updateBoletaEquipamientoDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.boletaEquipamientoService.remove(+id);
  }
}
