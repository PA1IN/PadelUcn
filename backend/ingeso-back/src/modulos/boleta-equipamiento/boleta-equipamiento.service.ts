import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';
import { EquipamientoService } from '../equipamiento/equipamiento.service';
import { Reserva } from '../reserva/entities/reserva.entity';

@Injectable()
export class BoletaEquipamientoService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(BoletaEquipamiento)
    private boletaRepository: Repository<BoletaEquipamiento>,
    private equipamientoService: EquipamientoService,
  ) {}

  async create(createBoletaDto: CreateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>> {
    try {
      const equipamientoResponse = await this.equipamientoService.findOne(createBoletaDto.id_equipamiento);
      const equipamiento = equipamientoResponse.data;

      if (!equipamiento) {
        throw new Error(`No se encontró el equipamiento con ID ${createBoletaDto.id_equipamiento}`);
      }

      if (equipamiento.stock < createBoletaDto.cantidad) {
        throw new Error(`Stock insuficiente para el equipamiento ${equipamiento.tipo}`);
      }

      const reserva = await this.reservaRepository.findOne({
        where: { id: createBoletaDto.id_reserva },
        relations: ['cancha'],
      });

      if (!reserva) {
        throw new Error('Reserva no encontrada');
      }

      console.log('Valor cancha:', reserva.cancha?.valor);
      const valorEquipamiento = equipamiento.costo;
      const valorCancha = reserva.cancha.valor;
      const monto_total = valorCancha + (valorEquipamiento * createBoletaDto.cantidad);
      console.log('Valor Equipamiento:', valorEquipamiento);
      console.log('Valor Total:', monto_total);

      const newBoleta = this.boletaRepository.create({
        idReserva: createBoletaDto.id_reserva,
        idEquipamiento: createBoletaDto.id_equipamiento,
        cantidad: createBoletaDto.cantidad,
        montoTotal: monto_total
      });

      const savedBoleta = await this.boletaRepository.save(newBoleta);

      await this.equipamientoService.actualizarStock(equipamiento.id, -createBoletaDto.cantidad);

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
        relations: ['reserva', 'equipamiento'],
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
        where: { id: id },
        relations: ['reserva', 'equipamiento'],
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
        where: { idReserva: idReserva },
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
        where: { id: id },
        relations: ['equipamiento', 'reserva', 'reserva.cancha'],
      });

      if (!boleta) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }

      if (updateBoletaDto.cantidad && updateBoletaDto.cantidad !== boleta.cantidad) {
        const equipamiento = boleta.equipamiento;

        if (updateBoletaDto.cantidad > boleta.cantidad && equipamiento.stock < (updateBoletaDto.cantidad - boleta.cantidad)) {
          throw new Error(`Stock insuficiente para aumentar la cantidad de equipamiento`);
        }

        await this.equipamientoService.actualizarStock(equipamiento.id, updateBoletaDto.cantidad - boleta.cantidad);
      }

      const monto_total = boleta.reserva.cancha.valor + ((updateBoletaDto.cantidad || boleta.cantidad));

      await this.boletaRepository.update(id, {
        ...updateBoletaDto,
        montoTotal: monto_total
      });

      const updatedBoleta = await this.boletaRepository.findOne({
        where: { id: id },
        relations: ['reserva', 'equipamiento'],
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
        where: { id: id },
        relations: ['equipamiento'],
      });

      if (!boleta) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }

      await this.equipamientoService.actualizarStock(boleta.equipamiento.id, boleta.cantidad);

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
