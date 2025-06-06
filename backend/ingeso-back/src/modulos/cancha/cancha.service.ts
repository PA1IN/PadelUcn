import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancha } from './entities/cancha.entity';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';

@Injectable()
export class CanchaService {
  constructor(
    @InjectRepository(Cancha)
    private canchaRepository: Repository<Cancha>,
  ) {}

  async create(createCanchaDto: CreateCanchaDto): Promise<Cancha> {
    // Verificar si ya existe una cancha con ese número
    const existingCancha = await this.canchaRepository.findOne({
      where: { numero: createCanchaDto.numero },
    });

    if (existingCancha) {
      throw new ConflictException(`Ya existe una cancha con el número ${createCanchaDto.numero}`);
    }

    const newCancha = this.canchaRepository.create(createCanchaDto);
    return await this.canchaRepository.save(newCancha);
  }

  async findAll(): Promise<Cancha[]> {
    return await this.canchaRepository.find();
  }

  async findByNumero(numero: number): Promise<Cancha> {
    const cancha = await this.canchaRepository.findOne({
      where: { numero },
    });

    if (!cancha) {
      throw new NotFoundException(`Cancha con número ${numero} no encontrada`);
    }

    return cancha;
  }

  async update(numero: number, updateCanchaDto: UpdateCanchaDto): Promise<Cancha> {
    const cancha = await this.findByNumero(numero);
    
    // Actualizar los campos proporcionados
    Object.assign(cancha, updateCanchaDto);

    return await this.canchaRepository.save(cancha);
  }

  async remove(numero: number): Promise<void> {
    const cancha = await this.findByNumero(numero);
    await this.canchaRepository.remove(cancha);
  }
  
  async findAvailableCourts(): Promise<Cancha[]> {
    // Obtener solo las canchas que no están en mantenimiento
    return await this.canchaRepository.find({
      where: { mantenimiento: false },
    });
  }
}