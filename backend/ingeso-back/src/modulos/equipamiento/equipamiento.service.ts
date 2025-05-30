import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { Equipamiento } from './entities/equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class EquipamientoService {
  constructor(
    @InjectRepository(Equipamiento)
    private equipamientoRepository: Repository<Equipamiento>,
  ) {}

  async create(createEquipamientoDto: CreateEquipamientoDto): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = this.equipamientoRepository.create(createEquipamientoDto);
      const result = await this.equipamientoRepository.save(equipamiento);
      return CreateResponse('Equipamiento creado exitosamente', result, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear equipamiento', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<Equipamiento[]>> {
    try {
      const equipamientos = await this.equipamientoRepository.find();
      return CreateResponse('Equipamientos obtenidos exitosamente', equipamientos, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener equipamientos', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }
      
      return CreateResponse('Equipamiento obtenido exitosamente', equipamiento, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Equipamiento no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateEquipamientoDto: UpdateEquipamientoDto): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }
      
      await this.equipamientoRepository.update(id, updateEquipamientoDto);
      const updatedEquipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      return CreateResponse('Equipamiento actualizado exitosamente', updatedEquipamiento, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Equipamiento no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar equipamiento', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }
      
      await this.equipamientoRepository.delete(id);
      return CreateResponse('Equipamiento eliminado exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Equipamiento no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStock(id: number, cantidad: number): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }

      if (equipamiento.stock < cantidad && cantidad < 0) {
        throw new Error(`Stock insuficiente para el equipamiento ${equipamiento.nombre}`);
      }
      
      const nuevoStock = equipamiento.stock + cantidad;
      if (nuevoStock < 0) {
        throw new Error(`El stock resultante no puede ser negativo`);
      }
      
      await this.equipamientoRepository.update(id, { stock: nuevoStock });
      const updatedEquipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      return CreateResponse('Stock de equipamiento actualizado exitosamente', updatedEquipamiento, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Equipamiento no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      } else if (error.message.includes('Stock insuficiente') || error.message.includes('no puede ser negativo')) {
        throw new HttpException(
          CreateResponse('Error de stock', null, 'BAD_REQUEST', error.message),
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar stock de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
