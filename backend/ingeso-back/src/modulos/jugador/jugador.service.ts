import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jugador } from './entities/jugador.entity';
import { CreateJugadorDto } from './dto/jugador.dto';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Cancha } from '../cancha/entities/cancha.entity';

@Injectable()
export class JugadorService {
  constructor(
    @InjectRepository(Jugador)
    private jugadorRepository: Repository<Jugador>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Cancha)
    private canchaRepository: Repository<Cancha>
  ) {}
  
  async create(createJugadorDto: CreateJugadorDto): Promise<ApiResponse<Jugador>> {
    try {
      // Verificar que la reserva existe
      const reserva = await this.reservaRepository.findOne({
        where: { id: createJugadorDto.id_reserva },
        relations: ['cancha']  
    });

      if (!reserva) {
        throw new NotFoundException(`Reserva con ID ${createJugadorDto.id_reserva} no encontrada`);
      }

      // Obtener la cancha para verificar la cantidad máxima de jugadores
      const cancha = await this.canchaRepository.findOne({
        where: { id: reserva.cancha.id }
      });

      if (!cancha) {
        throw new NotFoundException(`Cancha con ID ${reserva.cancha.id} no encontrada`);
      }

      // Contar jugadores actuales
      const jugadoresActuales = await this.jugadorRepository.count({
        where: { reserva: { id: createJugadorDto.id_reserva } }
      });

      // Verificar si se excede la cantidad máxima permitida
      if (jugadoresActuales >= cancha.cantidadMaxJugador) {
        throw new BadRequestException(
          `No se puede agregar más jugadores. La cancha tiene un máximo de ${cancha.cantidadMaxJugador} jugadores.`
        );
      }

      // Crear nuevo jugador
      const nuevoJugador = this.jugadorRepository.create({
        nombre: createJugadorDto.nombre,
        apellido: createJugadorDto.apellido, 
        rut: createJugadorDto.rut,
        edad: createJugadorDto.edad,
        reserva: { id: createJugadorDto.id_reserva }
      });

      const jugadorGuardado = await this.jugadorRepository.save(nuevoJugador);
      
      return CreateResponse('Jugador creado exitosamente', jugadorGuardado, 'CREATED');
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear jugador: ${error.message}`);
    }
  }
  
  async findAll(): Promise<ApiResponse<Jugador[]>> {
    try {
      const jugadores = await this.jugadorRepository.find({
        relations: ['reserva']
      });
      
      return CreateResponse('Jugadores obtenidos exitosamente', jugadores, 'OK');
    } catch (error) {
      throw new BadRequestException(`Error al obtener jugadores: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<ApiResponse<Jugador>> {
    try {
      const jugador = await this.jugadorRepository.findOne({
        where: { id },
        relations: ['reserva']
      });

      if (!jugador) {
        throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
      }
      
      return CreateResponse('Jugador obtenido exitosamente', jugador, 'OK');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener jugador: ${error.message}`);
    }
  }
  
async createBatch(createJugadoresDto: CreateJugadorDto[]): Promise<ApiResponse<any>> {
  if (!Array.isArray(createJugadoresDto) || createJugadoresDto.length === 0) {
    throw new BadRequestException('Debe proporcionar al menos un jugador');
  }

  const primerIdReserva = createJugadoresDto[0].id_reserva;
  const todosLaMismaReserva = createJugadoresDto.every(j => j.id_reserva === primerIdReserva);
  
  if (!todosLaMismaReserva) {
    throw new BadRequestException('Todos los jugadores deben pertenecer a la misma reserva');
  }

  const reserva = await this.reservaRepository.findOne({
    where: { id: primerIdReserva },
    relations: ['cancha']
  });

  if (!reserva) {
    throw new BadRequestException(`Reserva con ID ${primerIdReserva} no encontrada`);
  }

  const jugadoresActuales = await this.jugadorRepository.count({
    where: { reserva: { id: primerIdReserva } }
  });

  const totalDespues = jugadoresActuales + createJugadoresDto.length;
  
  if (totalDespues > reserva.cancha.cantidadMaxJugador) {
    throw new BadRequestException(
      `No se pueden agregar ${createJugadoresDto.length} jugadores. ` +
      `Actuales: ${jugadoresActuales}, Máximo: ${reserva.cancha.cantidadMaxJugador}`
    );
  }

  try {
    // ✅ CREAR TODOS DE UNA VEZ (MÁS EFICIENTE)
    const nuevosJugadores = createJugadoresDto.map(dto => 
      this.jugadorRepository.create({
        nombre: dto.nombre,
        apellido: dto.apellido, 
        rut: dto.rut,
        edad: dto.edad,
        reserva: { id: dto.id_reserva }
      })
    );

    const jugadoresGuardados = await this.jugadorRepository.save(nuevosJugadores);
    
    return CreateResponse(
      `${jugadoresGuardados.length} jugadores creados exitosamente`,
      jugadoresGuardados,
      'CREATED'
    );
  } catch (error) {
    throw new BadRequestException(`Error al crear jugadores en lote: ${error.message}`);
  }
}
}