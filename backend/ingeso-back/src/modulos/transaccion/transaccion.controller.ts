import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('transacciones')
export class TransaccionController {
  constructor(private readonly transaccionService: TransaccionService) {}

  // crea transaccion (es parael tema de las reservas tengan una transaccion registrada)
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTransaccionDto: CreateTransaccionDto) {
    return await this.transaccionService.create(createTransaccionDto);
  }

  // obtener todas las transacciones
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAllCompletas() {
    return await this.transaccionService.findAllCompletas();
  }

  // obtener estadisticas
  @Get('estadisticas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getEstadisticas() {
    return await this.transaccionService.getEstadisticas();
  }

  // obtener transacciones por periodo
  @Get('periodo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findByPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return await this.transaccionService.findByPeriodo(fechaInicio, fechaFin);
  }
}
