import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialReserva } from './entities/historial-reserva.entity';

interface CreateHistorialDto {
  estado: string;
  idReserva: number;
  idUsuario: number;
  observaciones?: string;
}

@Injectable()
export class HistorialReservaService {
  constructor(
    @InjectRepository(HistorialReserva)
    private historialRepository: Repository<HistorialReserva>,
  ) {}

  // ✅ MÉTODO CORREGIDO - VERSIÓN SIMPLE
  async create(createHistorialDto: CreateHistorialDto): Promise<void> {
    try {
      // ✅ INSERTAR DIRECTAMENTE CON QUERY - EVITA PROBLEMAS DE TIPOS
      await this.historialRepository.query(`
        INSERT INTO historial_reserva (estado, observaciones, fecha_estado, id_reserva, id_usuario)
        VALUES ($1, $2, NOW(), $3, $4)
      `, [
        createHistorialDto.estado,
        createHistorialDto.observaciones || null,
        createHistorialDto.idReserva,
        createHistorialDto.idUsuario
      ]);
      
      console.log(`✅ Historial creado: ${createHistorialDto.estado} para reserva ${createHistorialDto.idReserva}`);
    } catch (error) {
      console.error('❌ Error al crear historial (no crítico):', error.message);
      // No throw - permitir que la operación principal continúe
    }
  }

  // ✅ TODO LO DEMÁS QUEDA IGUAL
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