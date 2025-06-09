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
  @Roles('admin')
  async findAll() {
    return this.jugadorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jugadorService.findOne(+id);
  }  /**
   * Crea múltiples jugadores en lote
   * Esta función procesa un array de jugadores y los crea uno por uno,
   * registrando tanto los éxitos como los errores.
   */
  @Post('batch')
  async createBatch(@Body() createJugadoresDto: CreateJugadorDto[]) {
    if (!Array.isArray(createJugadoresDto)) {
      throw new BadRequestException('El cuerpo de la solicitud debe ser un arreglo de jugadores');
    }
    
    // Define el tipo correcto para el array de resultados que coincide con la estructura ApiResponse
    const resultados: Array<{
      success: boolean;
      message: string;
      data: any;
      statusCode?: number;
      error?: string;
    }> = [];
    
    for (const jugadorDto of createJugadoresDto) {
      try {
        // Cada llamada a create devuelve un objeto ApiResponse
        const resultado = await this.jugadorService.create(jugadorDto);
        resultados.push(resultado);
      } catch (error) {
        // Si hay un error, creamos un objeto con la misma estructura pero con success=false
        resultados.push({
          success: false,
          message: error.message || 'Error al crear jugador',
          data: jugadorDto,
          error: error.message
        });
      }
    }
      // Devolvemos un objeto que cumple con la estructura ApiResponse
    return {
      message: 'Proceso de creación de jugadores completado',
      data: resultados,
      statusCode: 201,
      success: true
    } as ApiResponse<typeof resultados>;
  }
}