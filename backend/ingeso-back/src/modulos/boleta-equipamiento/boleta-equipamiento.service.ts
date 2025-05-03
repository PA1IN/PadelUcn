import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';
import { EquipamientoService } from '../equipamiento/equipamiento.service';

@Injectable()
export class BoletaEquipamientoService {
  constructor(
    @InjectRepository(BoletaEquipamiento)
    private boletaRepository: Repository<BoletaEquipamiento>,
    private equipamientoService: EquipamientoService,
  ) {}

  async create(createBoletaDto: CreateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>> {
    try {
      // Verificar disponibilidad de stock del equipamiento
      const equipamientoResponse = await this.equipamientoService.findOne(createBoletaDto.id_equipamiento);
      const equipamiento = equipamientoResponse.data;
      
      if (!equipamiento) {
        throw new Error(`No se encontró el equipamiento con ID ${createBoletaDto.id_equipamiento}`);
      }
      
      if (equipamiento.stock < createBoletaDto.cantidad) {
        throw new Error(`Stock insuficiente para el equipamiento ${equipamiento.tipo}`);
      }
      
      // Crear la boleta
      const newBoleta = this.boletaRepository.create(createBoletaDto);
      const savedBoleta = await this.boletaRepository.save(newBoleta);
      
      // Actualizar el stock del equipamiento
      await this.equipamientoService.actualizarStock(equipamiento.id_equipamiento, -createBoletaDto.cantidad);
      
      return CreateResponse('Boleta de equipamiento creada exitosamente', savedBoleta, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear boleta de equipamiento', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<BoletaEquipamiento[]>> {
    try {
      const boletas = await this.boletaRepository.find({
        relations: ['usuario', 'reserva', 'equipamiento'],
      });
      
      return CreateResponse('Boletas de equipamiento obtenidas exitosamente', boletas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener boletas de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<BoletaEquipamiento>> {
    try {
      const boleta = await this.boletaRepository.findOne({ 
        where: { id_boleta: id },
        relations: ['usuario', 'reserva', 'equipamiento'],
      });
      
      if (!boleta) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }
      
      return CreateResponse('Boleta de equipamiento obtenida exitosamente', boleta, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener la boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByReserva(idReserva: number): Promise<ApiResponse<BoletaEquipamiento[]>> {
    try {
      const boletas = await this.boletaRepository.find({
        where: { reserva: { id_reserva: idReserva } },
        relations: ['equipamiento'],
      });
      
      return CreateResponse('Boletas de equipamiento por reserva obtenidas exitosamente', boletas, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener boletas de equipamiento por reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateBoletaDto: UpdateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>> {
    try {
      const boleta = await this.boletaRepository.findOne({ 
        where: { id_boleta: id },
        relations: ['equipamiento'],
      });
      
      if (!boleta) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }
      
      // Si se está actualizando la cantidad, manejar el stock
      if (updateBoletaDto.cantidad && updateBoletaDto.cantidad !== boleta.cantidad) {
        const diferencia = updateBoletaDto.cantidad - boleta.cantidad;
        
        // Verificar si hay stock suficiente en caso de aumento
        if (diferencia > 0) {
          const equipamientoResponse = await this.equipamientoService.findOne(boleta.equipamiento.id_equipamiento);
          const equipamiento = equipamientoResponse.data;
          
          if (equipamiento && equipamiento.stock < diferencia) {
            throw new Error(`Stock insuficiente para aumentar la cantidad de equipamiento`);
          }
        }
        
        // Actualizar el stock
        await this.equipamientoService.actualizarStock(boleta.equipamiento.id_equipamiento, -diferencia);
      }
      
      await this.boletaRepository.update(id, updateBoletaDto);
      const updatedBoleta = await this.boletaRepository.findOne({
        where: { id_boleta: id },
        relations: ['usuario', 'reserva', 'equipamiento'],
      });
      
      if (!updatedBoleta) {
        throw new Error(`Error al obtener boleta actualizada con ID ${id}`);
      }
      
      return CreateResponse('Boleta de equipamiento actualizada exitosamente', updatedBoleta, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar la boleta de equipamiento', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const boleta = await this.boletaRepository.findOne({ 
        where: { id_boleta: id },
        relations: ['equipamiento'],
      });
      
      if (!boleta) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }
      
      // Devolver el stock del equipamiento
      await this.equipamientoService.actualizarStock(boleta.equipamiento.id_equipamiento, boleta.cantidad);
      
      await this.boletaRepository.delete(id);
      return CreateResponse('Boleta de equipamiento eliminada exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar la boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
