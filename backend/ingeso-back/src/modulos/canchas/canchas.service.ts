import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      // Verificar si ya existe una cancha con el mismo número
      const existingCancha = await this.canchaRepository.findOne({ 
        where: { numero: createCanchaDto.numero } 
      });
      
      if (existingCancha) {
        throw new Error(`Ya existe una cancha con el número ${createCanchaDto.numero}`);
      }
      
      const newCancha = this.canchaRepository.create(createCanchaDto);
      const savedCancha = await this.canchaRepository.save(newCancha);
      return CreateResponse('Cancha creada exitosamente', savedCancha, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear la cancha', null, 'BAD_REQUEST', error.message),
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
        CreateResponse('Error al obtener las canchas', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(numero: number): Promise<ApiResponse<Cancha>> {
    try {
      const cancha = await this.canchaRepository.findOne({ where: { numero } });
      
      if (!cancha) {
        throw new Error(`No se encontró una cancha con el número ${numero}`);
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
        CreateResponse('Error al obtener la cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(numero: number, updateCanchaDto: UpdateCanchaDto): Promise<ApiResponse<Cancha>> {
    try {
      const cancha = await this.canchaRepository.findOne({ where: { numero } });
      
      if (!cancha) {
        throw new Error(`No se encontró una cancha con el número ${numero}`);
      }
      
      // Actualizar solo el campo de costo, manteniendo el número igual
      const updatedCancha = this.canchaRepository.merge(cancha, updateCanchaDto);
      const result = await this.canchaRepository.save(updatedCancha);
      
      return CreateResponse('Cancha actualizada exitosamente', result, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Cancha no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar la cancha', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(numero: number): Promise<ApiResponse<null>> {
    try {
      const cancha = await this.canchaRepository.findOne({ where: { numero } });
      
      if (!cancha) {
        throw new Error(`No se encontró una cancha con el número ${numero}`);
      }
      
      await this.canchaRepository.remove(cancha);
      return CreateResponse('Cancha eliminada exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Cancha no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar la cancha', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
