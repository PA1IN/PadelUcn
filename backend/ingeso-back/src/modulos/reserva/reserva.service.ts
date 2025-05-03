import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<ApiResponse<Reserva>> {
    try {
      // Verificar disponibilidad de la cancha en el horario solicitado
      const existingReserva = await this.reservaRepository.findOne({
        where: {
          fecha: new Date(createReservaDto.fecha),
          cancha: { numero: createReservaDto.numero_cancha },
          // Verificar traslape de horarios
          // (hora_inicio < end AND hora_termino > start)
        },
        relations: ['cancha'],
      });

      if (existingReserva) {
        throw new Error(`La cancha no está disponible en el horario solicitado`);
      }

      const newReserva = this.reservaRepository.create({
        ...createReservaDto,
        fecha: new Date(createReservaDto.fecha),
      });
      const savedReserva = await this.reservaRepository.save(newReserva);

      return CreateResponse('Reserva creada exitosamente', savedReserva, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear la reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        relations: ['usuario', 'cancha', 'administrador'],
      });
      return CreateResponse('Reservas obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener reservas', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({ 
        where: { id_reserva: id },
        relations: ['usuario', 'cancha', 'administrador', 'boletas', 'boletas.equipamiento'],
      });
      
      if (!reserva) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      return CreateResponse('Reserva obtenida exitosamente', reserva, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener la reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUser(rutUsuario: string): Promise<ApiResponse<Reserva[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        where: { usuario: { rut: rutUsuario } },
        relations: ['cancha', 'boletas', 'boletas.equipamiento'],
      });
      
      return CreateResponse('Reservas del usuario obtenidas exitosamente', reservas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener las reservas del usuario', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateReservaDto: UpdateReservaDto): Promise<ApiResponse<Reserva>> {
    try {
      const reserva = await this.reservaRepository.findOne({ 
        where: { id_reserva: id },
        relations: ['usuario', 'cancha'],
      });
      
      if (!reserva) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      // Si se está cambiando la hora o fecha, verificar disponibilidad
      if (updateReservaDto.fecha || updateReservaDto.hora_inicio || updateReservaDto.hora_termino) {
        // Lógica para verificar disponibilidad
      }
      
      // Convertir fecha a Date si está presente
      if (updateReservaDto.fecha) {
        updateReservaDto.fecha = new Date(updateReservaDto.fecha) as any;
      }
      
      await this.reservaRepository.update(id, updateReservaDto);
      const updatedReserva = await this.reservaRepository.findOne({
        where: { id_reserva: id },
        relations: ['usuario', 'cancha', 'administrador'],
      });
      
      if (!updatedReserva) {
        throw new Error(`Error al obtener reserva actualizada con ID ${id}`);
      }
      
      return CreateResponse('Reserva actualizada exitosamente', updatedReserva, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar la reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const reserva = await this.reservaRepository.findOne({ where: { id_reserva: id } });
      
      if (!reserva) {
        throw new Error(`No se encontró una reserva con el ID ${id}`);
      }
      
      await this.reservaRepository.delete(id);
      return CreateResponse('Reserva eliminada exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar la reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
