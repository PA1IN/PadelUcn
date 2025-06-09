import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CanchaService } from './cancha.service';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Cancha } from './entities/cancha.entity';

@Controller('canchas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanchaController {
  constructor(private readonly canchaService: CanchaService) {}
  @Post()
  @Roles('admin')
  async create(@Body() createCanchaDto: CreateCanchaDto): Promise<Cancha> {
    return await this.canchaService.create(createCanchaDto);
  }  @Get()
  @Public()
  async findAll() {
    const canchas = await this.canchaService.findAll();
    return canchas.map(cancha => ({
      id_cancha: cancha.id,
      numero_cancha: cancha.numero,
      nombre: cancha.nombre,
      descripcion: cancha.descripcion,
      valor: cancha.valor,
      maxJugadores: 4 // Default value for padel courts
    }));
  }  @Get('disponibles')
  @Public()
  async findAvailable() {
    const canchas = await this.canchaService.findAvailableCourts();
    return canchas.map(cancha => ({
      id_cancha: cancha.id,
      numero_cancha: cancha.numero,
      nombre: cancha.nombre,
      descripcion: cancha.descripcion,
      valor: cancha.valor,
      maxJugadores: 4 // Default value for padel courts
    }));
  }  @Get(':numero')
  @Public()
  async findOne(@Param('numero') numero: number) {
    try {
      const cancha = await this.canchaService.findByNumero(numero);
      if (!cancha) return null;
      
      return {
        id_cancha: cancha.id,
        numero_cancha: cancha.numero,
        nombre: cancha.nombre,
        descripcion: cancha.descripcion,
        valor: cancha.valor,
        maxJugadores: 4 // Default value for padel courts
      };
    } catch (error) {
      return null;
    }
  }
  @Patch(':numero')
  @Roles('admin')
  async update(@Param('numero') numero: number, @Body() updateCanchaDto: UpdateCanchaDto): Promise<Cancha | null> {
    try {
      return await this.canchaService.update(numero, updateCanchaDto);
    } catch (error) {
      return null;
    }
  }
  @Delete(':numero')
  @Roles('admin')
  async remove(@Param('numero') numero: number): Promise<null> {
    try {
      await this.canchaService.remove(numero);
      return null;
    } catch (error) {
      return null;
    }
  }
}