import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialReserva } from './entities/historial-reserva.entity';

interface CreateHistorialDto {
  estado: string;
  idReserva: number;
  idUsuario: number;
}

@Injectable()
export class HistorialReservaService {
  constructor(
    @InjectRepository(HistorialReserva)
    private historialRepository: Repository<HistorialReserva>,
  ) {}

  async create(createHistorialDto: CreateHistorialDto): Promise<HistorialReserva> {
    const newHistorial = this.historialRepository.create({
      estado: createHistorialDto.estado,
      fechaEstado: new Date(),
      reserva: { id: createHistorialDto.idReserva },
      usuario: { id_usuario: createHistorialDto.idUsuario },
    });

    return await this.historialRepository.save(newHistorial);
  }

  async findAll(): Promise<HistorialReserva[]> {
    return await this.historialRepository.find({
      relations: ['reserva', 'usuario'],
      order: { fechaEstado: 'DESC' },
    });
  }

  async findOne(id: number): Promise<HistorialReserva> {
    const historial = await this.historialRepository.findOne({
      where: { id },
      relations: ['reserva', 'usuario'],
    });

    if (!historial) {
      throw new NotFoundException(`Historial con ID ${id} no encontrado`);
    }

    return historial;
  }

  async findByReserva(idReserva: number): Promise<HistorialReserva[]> {
    return await this.historialRepository.find({
      where: { reserva: { id: idReserva } },
      relations: ['usuario'],
      order: { fechaEstado: 'DESC' },
    });
  }

  async findByUsuario(idUsuario: number): Promise<HistorialReserva[]> {
    return await this.historialRepository.find({
      where: { usuario: { id_usuario: idUsuario } },
      relations: ['reserva'],
      order: { fechaEstado: 'DESC' },
    });
  }
}