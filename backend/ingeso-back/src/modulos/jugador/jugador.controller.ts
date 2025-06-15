import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { CreateJugadorDto } from './dto/jugador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponse } from '../../interface/Apiresponce';

@Controller('jugador')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JugadorController {
  constructor(private readonly jugadorService: JugadorService) {}

  @Post()
  async create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadorService.create(createJugadorDto);
  } 
  @Get()
  async findAll() {
    return this.jugadorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jugadorService.findOne(+id);
  }
  /**
   * Crea múltiples jugadores en lote
   * Esta función procesa un array de jugadores y los crea uno por uno,
   * registrando tanto los éxitos como los errores.
   */
  @Post('batch')
  @Roles('admin')
  async createBatch(@Body() createJugadoresDto: CreateJugadorDto[]) {
  if (!Array.isArray(createJugadoresDto)) {
    throw new BadRequestException('El cuerpo de la solicitud debe ser un arreglo de jugadores');
  }

  if (createJugadoresDto.length === 0) {
    throw new BadRequestException('Debe proporcionar al menos un jugador');
  }
    return this.jugadorService.createBatch(createJugadoresDto);

  }
}