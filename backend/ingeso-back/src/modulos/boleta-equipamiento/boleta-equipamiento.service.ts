import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';
import { ReservaService } from '../reserva/reserva.service';
import { EquipamientoService } from '../equipamiento/equipamiento.service';
import { UserService } from '../user/user.service';

@Injectable()
export class BoletaEquipamientoService {
  constructor(
    @InjectRepository(BoletaEquipamiento)
    private boletaRepository: Repository<BoletaEquipamiento>,
    private reservaService: ReservaService,
    private equipamientoService: EquipamientoService,
    private userService: UserService,
  ) {}

  async create(createBoletaDto: CreateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>> {
    try {
      // Verificar si la reserva existe
      const reservaResponse = await this.reservaService.findOne(createBoletaDto.reservaId);
      if (!reservaResponse.data) {
        throw new Error(`No se encontró una reserva con el ID ${createBoletaDto.reservaId}`);
      }
      const reserva = reservaResponse.data;
      
      // Verificar si el equipamiento existe
      const equipamientoResponse = await this.equipamientoService.findOne(createBoletaDto.equipamientoId);
      if (!equipamientoResponse.data) {
        throw new Error(`No se encontró un equipamiento con el ID ${createBoletaDto.equipamientoId}`);
      }
      const equipamiento = equipamientoResponse.data;
      
      // Verificar si hay stock suficiente
      if (equipamiento.stock < createBoletaDto.cantidad) {
        throw new Error(`Stock insuficiente. Se solicitaron ${createBoletaDto.cantidad} unidades, pero solo hay ${equipamiento.stock} disponibles`);
      }
      
      // Verificar si el usuario tiene saldo suficiente
      const userResponse = await this.userService.findOne(reserva.usuario.rut);
      if (!userResponse.data) {
        throw new Error(`No se encontró un usuario con el RUT ${reserva.usuario.rut}`);
      }
      const user = userResponse.data;
      
      // Calcular el costo total del equipamiento
      const montoTotal = equipamiento.costo * createBoletaDto.cantidad;
      
      // Verificar saldo
      if (user.saldo < montoTotal) {
        throw new Error(`Saldo insuficiente. El costo es de ${montoTotal} y el usuario tiene ${user.saldo}`);
      }
      
      // Crear la boleta
      const boleta = this.boletaRepository.create({
        ...createBoletaDto,
        montoTotal,
      });
      
      const savedBoleta = await this.boletaRepository.save(boleta);
      
      // Actualizar el stock del equipamiento
      await this.equipamientoService.updateStock(equipamiento.id, -createBoletaDto.cantidad);
      
      // Descontar del saldo del usuario
      await this.userService.update(user.rut, { saldo: user.saldo - montoTotal });
      
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
        relations: ['reserva', 'equipamiento', 'reserva.usuario'],
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
        where: { id },
        relations: ['reserva', 'equipamiento', 'reserva.usuario'],
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
        CreateResponse('Error al obtener boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateBoletaDto: UpdateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>> {
    try {
      // Obtener la boleta actual
      const boletaResponse = await this.findOne(id);
      if (!boletaResponse.data) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }
      const boletaActual = boletaResponse.data;
      
      // Si se cambia la cantidad, verificar stock y actualizar saldo
      if (updateBoletaDto.cantidad && updateBoletaDto.cantidad !== boletaActual.cantidad) {
        // Verificar si el equipamiento existe
        const equipamientoResponse = await this.equipamientoService.findOne(boletaActual.equipamientoId);
        if (!equipamientoResponse.data) {
          throw new Error(`No se encontró un equipamiento con el ID ${boletaActual.equipamientoId}`);
        }
        const equipamiento = equipamientoResponse.data;
        
        // Calcular diferencia de unidades
        const diferencia = updateBoletaDto.cantidad - boletaActual.cantidad;
        
        // Verificar stock si se aumenta la cantidad
        if (diferencia > 0 && equipamiento.stock < diferencia) {
          throw new Error(`Stock insuficiente. Se requieren ${diferencia} unidades adicionales, pero solo hay ${equipamiento.stock} disponibles`);
        }
        
        // Actualizar el stock del equipamiento
        await this.equipamientoService.updateStock(equipamiento.id, -diferencia);
        
        // Obtener la reserva y el usuario
        const reservaResponse = await this.reservaService.findOne(boletaActual.reservaId);
        if (!reservaResponse.data) {
          throw new Error(`No se encontró una reserva con el ID ${boletaActual.reservaId}`);
        }
        const user = reservaResponse.data.usuario;
        
        // Calcular diferencia de monto
        const montoActual = boletaActual.montoTotal;
        const montoNuevo = equipamiento.costo * updateBoletaDto.cantidad;
        const diferenciaMonto = montoNuevo - montoActual;
        
        // Si el monto aumenta, verificar saldo
        if (diferenciaMonto > 0) {
          const userResponse = await this.userService.findOne(user.rut);
          if (!userResponse.data) {
            throw new Error(`No se encontró un usuario con el RUT ${user.rut}`);
          }
          
          if (userResponse.data.saldo < diferenciaMonto) {
            throw new Error(`Saldo insuficiente. El costo adicional es de ${diferenciaMonto} y el usuario tiene ${userResponse.data.saldo}`);
          }
          
          // Descontar del saldo del usuario
          await this.userService.update(user.rut, { saldo: userResponse.data.saldo - diferenciaMonto });
        } else if (diferenciaMonto < 0) {
          // Si el monto disminuye, devolver al usuario
          const userResponse = await this.userService.findOne(user.rut);
          if (!userResponse.data) {
            throw new Error(`No se encontró un usuario con el RUT ${user.rut}`);
          }
          
          // Devolver al saldo del usuario
          await this.userService.update(user.rut, { saldo: userResponse.data.saldo - diferenciaMonto });
        }
        
        // Actualizar el monto total
        updateBoletaDto['montoTotal'] = montoNuevo;
      }
      
      await this.boletaRepository.update(id, updateBoletaDto);
      const updatedBoleta = await this.boletaRepository.findOne({
        where: { id },
        relations: ['reserva', 'equipamiento'],
      });
      
      return CreateResponse('Boleta de equipamiento actualizada exitosamente', updatedBoleta, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar boleta de equipamiento', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      // Obtener la boleta actual
      const boletaResponse = await this.findOne(id);
      if (!boletaResponse.data) {
        throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
      }
      const boleta = boletaResponse.data;
      
      // Devolver el equipamiento al stock
      await this.equipamientoService.updateStock(boleta.equipamientoId, boleta.cantidad);
      
      // Devolver el dinero al usuario
      const reservaResponse = await this.reservaService.findOne(boleta.reservaId);
      if (!reservaResponse.data) {
        throw new Error(`No se encontró una reserva con el ID ${boleta.reservaId}`);
      }
      const user = reservaResponse.data.usuario;
      
      const userResponse = await this.userService.findOne(user.rut);
      if (!userResponse.data) {
        throw new Error(`No se encontró un usuario con el RUT ${user.rut}`);
      }
      
      // Devolver al saldo del usuario
      await this.userService.update(user.rut, { saldo: userResponse.data.saldo + boleta.montoTotal });
      
      // Eliminar la boleta
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
        CreateResponse('Error al eliminar boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByReserva(reservaId: number): Promise<ApiResponse<BoletaEquipamiento[]>> {
    try {
      // Verificar si la reserva existe
      const reservaResponse = await this.reservaService.findOne(reservaId);
      if (!reservaResponse.data) {
        throw new Error(`No se encontró una reserva con el ID ${reservaId}`);
      }
      
      const boletas = await this.boletaRepository.find({
        where: { reservaId },
        relations: ['equipamiento'],
      });
      
      return CreateResponse('Boletas de equipamiento por reserva obtenidas exitosamente', boletas, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Reserva no encontrada', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener boletas de equipamiento por reserva', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
