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
        relations: ['cancha', 'jugadores']
      });

      if (!reserva) {
        throw new NotFoundException(`Reserva con ID ${createJugadorDto.id_reserva} no encontrada`);
      }

      // Obtener la cancha para verificar la cantidad máxima de jugadores
      const cancha = await this.canchaRepository.findOne({
        where: { id: reserva.idCancha }
      });

      if (!cancha) {
        throw new NotFoundException(`Cancha con ID ${reserva.idCancha} no encontrada`);
      }

      // Contar jugadores actuales
      const jugadoresActuales = await this.jugadorRepository.count({
        where: { idReserva: createJugadorDto.id_reserva }
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
        idReserva: createJugadorDto.id_reserva
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
}