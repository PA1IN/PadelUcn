import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) {}  async create(createEquipamientoDto: CreateEquipamientoDto): Promise<ApiResponse<Equipamiento>> {
    try {
      const newEquipamiento = this.equipamientoRepository.create(createEquipamientoDto);
      const savedEquipamiento = await this.equipamientoRepository.save(newEquipamiento);
      
      return CreateResponse<Equipamiento>('Equipamiento creado exitosamente', savedEquipamiento, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse<Equipamiento>('Error al crear equipamiento', null as unknown as Equipamiento, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<Equipamiento[]>> {
    try {
      const equipamientos = await this.equipamientoRepository.find();
      return CreateResponse<Equipamiento[]>('Equipamientos obtenidos exitosamente', equipamientos, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse<Equipamiento[]>('Error al obtener equipamientos', null as unknown as Equipamiento[], 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ 
        where: { id: id },
        relations: ['boletas'],
      });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }
      
      return CreateResponse<Equipamiento>('Equipamiento obtenido exitosamente', equipamiento, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse<Equipamiento>('Error al obtener equipamiento', null as unknown as Equipamiento, 'NOT_FOUND', error.message),
        HttpStatus.NOT_FOUND,
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
      
      return CreateResponse<Equipamiento>('Equipamiento actualizado exitosamente', updatedEquipamiento, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse<Equipamiento>('Error al actualizar equipamiento', null as unknown as Equipamiento, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ where: { id } });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }
      
      await this.equipamientoRepository.delete(id);
      
      return CreateResponse<Equipamiento>('Equipamiento eliminado exitosamente', equipamiento, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse<Equipamiento>('Error al eliminar equipamiento', null as unknown as Equipamiento, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async actualizarStock(id: number, cantidad: number): Promise<ApiResponse<Equipamiento>> {
    try {
      const equipamiento = await this.equipamientoRepository.findOne({ where: { id: id } });
      
      if (!equipamiento) {
        throw new Error(`No se encontró un equipamiento con el ID ${id}`);
      }
      
      if (equipamiento.stock < cantidad && cantidad < 0) {
        throw new Error(`Stock insuficiente para el equipamiento ${equipamiento.tipo}`);
      }
      
      equipamiento.stock += cantidad;
      await this.equipamientoRepository.save(equipamiento);
      
      return CreateResponse('Stock actualizado exitosamente', equipamiento, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Equipamiento no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      if (error.message.includes('Stock insuficiente')) {
        throw new HttpException(
          CreateResponse('Stock insuficiente', null, 'BAD_REQUEST', error.message),
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar el stock', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
