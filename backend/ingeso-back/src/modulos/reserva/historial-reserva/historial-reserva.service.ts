import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialReserva } from '../entities/historial-reserva.entity';
import { CreateHistorialReservaDto } from './dto/create-historial-reserva.dto';
import { ApiResponse } from '../../../interface/Apiresponce';
import { CreateResponse } from '../../../utils/api-response.util';

@Injectable()
export class HistorialReservaService {
  constructor(
    @InjectRepository(HistorialReserva)
    private historialReservaRepository: Repository<HistorialReserva>,
  ) {}

  async create(createHistorialReservaDto: CreateHistorialReservaDto): Promise<ApiResponse<HistorialReserva>> {
    try {
      const nuevoHistorial = this.historialReservaRepository.create(createHistorialReservaDto);
      const savedHistorial = await this.historialReservaRepository.save(nuevoHistorial);
      
      return CreateResponse('Historial de reserva creado exitosamente', savedHistorial, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear historial de reserva', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<HistorialReserva[]>> {
    try {
      const historiales = await this.historialReservaRepository.find({
        relations: ['reserva', 'usuario'],
      });
      
      return CreateResponse('Historiales de reserva obtenidos exitosamente', historiales, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener historiales de reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByReserva(idReserva: number): Promise<ApiResponse<HistorialReserva[]>> {
    try {
      const historiales = await this.historialReservaRepository.find({
        where: { idReserva },
        relations: ['usuario'],
        order: { fechaEstado: 'DESC' },
      });
      
      return CreateResponse('Historiales de reserva obtenidos exitosamente', historiales, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener historiales de reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUsuario(idUsuario: number): Promise<ApiResponse<HistorialReserva[]>> {
    try {
      const historiales = await this.historialReservaRepository.find({
        where: { idUsuario },
        relations: ['reserva'],
        order: { fechaEstado: 'DESC' },
      });
      
      return CreateResponse('Historiales de reserva obtenidos exitosamente', historiales, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener historiales de reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<HistorialReserva>> {
    try {
      const historial = await this.historialReservaRepository.findOne({
        where: { id },
        relations: ['reserva', 'usuario'],
      });
      
      if (!historial) {
        throw new Error(`No se encontró un historial con el ID ${id}`);
      }
      
      return CreateResponse('Historial de reserva obtenido exitosamente', historial, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Historial de reserva no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener historial de reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
