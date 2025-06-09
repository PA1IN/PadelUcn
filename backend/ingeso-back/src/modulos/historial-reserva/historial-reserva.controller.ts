import { Controller, Get, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { HistorialReservaService } from './historial-reserva.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { HistorialReserva } from './entities/historial-reserva.entity';

@Controller('historial-reservas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HistorialReservaController {
  constructor(private readonly historialReservaService: HistorialReservaService) {}
  @Get()
  @Roles('admin')
  async findAll(): Promise<HistorialReserva[]> {
    try {
      const historiales = await this.historialReservaService.findAll();
      return historiales;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string): Promise<HistorialReserva> {
    try {
      const historial = await this.historialReservaService.findOne(+id);
      return historial;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Get('reserva/:id')
  async findByReserva(@Param('id') id: string): Promise<HistorialReserva[]> {
    try {
      const historiales = await this.historialReservaService.findByReserva(+id);
      return historiales;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('usuario/:id')
  @Roles('admin')
  async findByUsuario(@Param('id') id: string): Promise<HistorialReserva[]> {
    try {
      const historiales = await this.historialReservaService.findByUsuario(+id);
      return historiales;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
