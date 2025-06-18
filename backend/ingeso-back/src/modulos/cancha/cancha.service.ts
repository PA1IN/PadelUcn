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

  async obtenerTodasLasCanchas(): Promise<Cancha[]> {
    return await this.findAll();
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

  async obtenerCanchaPorNumero(numero: number): Promise<Cancha | null> {
    try {
      return await this.findByNumero(numero);
    } catch (error) {
      return null;
    }
  }

  // ✅ CORREGIR: usar 'id' en lugar de 'id_cancha'
  async findById(id: number): Promise<Cancha | null> {
    const cancha = await this.canchaRepository.findOne({
      where: { id: id }, // ✅ USAR 'id' (propiedad del entity)
    });
    return cancha;
  }

  async obtenerCanchaPorId(id: number): Promise<Cancha | null> {
    return await this.findById(id);
  }

  async update(numero: number, updateCanchaDto: UpdateCanchaDto): Promise<Cancha> {
    const cancha = await this.findByNumero(numero);
    Object.assign(cancha, updateCanchaDto);
    return await this.canchaRepository.save(cancha);
  }

  async updateById(id: number, updateData: Partial<Cancha>): Promise<Cancha | null> {
    const cancha = await this.findById(id);
    
    if (!cancha) {
      return null;
    }

    Object.assign(cancha, updateData);
    return await this.canchaRepository.save(cancha);
  }

  async actualizarCancha(id: number, updateData: Partial<Cancha>): Promise<Cancha | null> {
    return await this.updateById(id, updateData);
  }

  // ✅ CORREGIR: usar nombres de propiedades correctos del entity
  async crearCancha(canchaData: {
    numero: number;
    nombre: string;
    descripcion: string;
    valor: number;
    cantidad_max_jugadores: number;
    mantenimienti: boolean;
  }): Promise<Cancha> {
    // Verificar si ya existe una cancha con ese número
    const existingCancha = await this.canchaRepository.findOne({
      where: { numero: canchaData.numero },
    });

    if (existingCancha) {
      throw new ConflictException(`Ya existe una cancha con el número ${canchaData.numero}`);
    }

    // ✅ USAR NOMBRES CORRECTOS DE LAS PROPIEDADES DEL ENTITY
    const newCancha = this.canchaRepository.create({
      numero: canchaData.numero,
      nombre: canchaData.nombre,
      descripcion: canchaData.descripcion,
      valor: canchaData.valor,
      cantidadMaxJugador: canchaData.cantidad_max_jugadores, // ✅ NOMBRE CORRECTO
      mantenimiento: canchaData.mantenimienti,
    });

    return await this.canchaRepository.save(newCancha);
  }

  async remove(numero: number): Promise<void> {
    const cancha = await this.findByNumero(numero);
    await this.canchaRepository.remove(cancha);
  }

  async removeById(id: number): Promise<void> {
    const cancha = await this.findById(id);
    
    if (!cancha) {
      throw new NotFoundException(`Cancha con ID ${id} no encontrada`);
    }

    await this.canchaRepository.remove(cancha);
  }

  async eliminarCancha(id: number): Promise<void> {
    return await this.removeById(id);
  }
  
  async findAvailableCourts(): Promise<Cancha[]> {
    return await this.canchaRepository.find({
      where: { mantenimiento: false },
    });
  }
}