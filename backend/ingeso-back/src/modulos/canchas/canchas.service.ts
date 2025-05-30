import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { Cancha } from './entities/cancha.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(Cancha)
    private canchaRepository: Repository<Cancha>,
  ) {}

  async create(createCanchaDto: CreateCanchaDto): Promise<ApiResponse<Cancha>> {
    try {
      const cancha = this.canchaRepository.create(createCanchaDto);
      const result = await this.canchaRepository.save(cancha);
      return CreateResponse('Cancha creada exitosamente', result, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear cancha', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<Cancha[]>> {
    try {
      const canchas = await this.canchaRepository.find();
      return CreateResponse('Canchas obtenidas exitosamente', canchas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener canchas', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Cancha>> {
    try {
      const cancha = await this.canchaRepository.findOne({ where: { id } });
      
      if (!cancha) {
        throw new Error(`No se encontró una cancha con el ID ${id}`);
      }
      
      return CreateResponse('Cancha obtenida exitosamente', cancha, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Cancha no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateCanchaDto: UpdateCanchaDto): Promise<ApiResponse<Cancha>> {
    try {
      const cancha = await this.canchaRepository.findOne({ where: { id } });
      
      if (!cancha) {
        throw new Error(`No se encontró una cancha con el ID ${id}`);
      }
      
      await this.canchaRepository.update(id, updateCanchaDto);
      const updatedCancha = await this.canchaRepository.findOne({ where: { id } });
      
      return CreateResponse('Cancha actualizada exitosamente', updatedCancha, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Cancha no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar cancha', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const cancha = await this.canchaRepository.findOne({ where: { id } });
      
      if (!cancha) {
        throw new Error(`No se encontró una cancha con el ID ${id}`);
      }
      
      await this.canchaRepository.delete(id);
      return CreateResponse('Cancha eliminada exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Cancha no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
