import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bloque } from './entities/bloque.entity';
import { CreateBloqueDto, UpdateBloqueDto } from './dto/bloque.dto';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class BloqueService {
  constructor(
    @InjectRepository(Bloque)
    private bloqueRepository: Repository<Bloque>,
  ) {
    // Inicializar bloques predeterminados si no existen
    //this.inicializarBloquesDefault();
  } //probando cosas........
  /*
  async inicializarBloquesDefault() {
    const count = await this.bloqueRepository.count();
    
    if (count === 0) {
      // Crear bloques horarios de 1 hora desde 8:00 hasta 20:00
      const bloquesDefault: Bloque[] = [];
      
      for (let hora = 8; hora < 20; hora++) {
        const horaInicio = `${hora.toString().padStart(2, '0')}:00:00`;
        const horaFin = `${(hora + 1).toString().padStart(2, '0')}:00:00`;
        
        const bloque = new Bloque();
        bloque.hora_inicio = horaInicio;
        bloque.hora_fin = horaFin;
        bloque.activo = true;
        bloque.dias = 'Lunes a Viernes';
        
        bloquesDefault.push(bloque);
      }
      
      await this.bloqueRepository.save(bloquesDefault);
    }
  }
    */
  async create(createBloqueDto: CreateBloqueDto): Promise<ApiResponse<Bloque>> {
    try {
      const bloque = this.bloqueRepository.create(createBloqueDto);
      const savedBloque = await this.bloqueRepository.save(bloque);
      
      return CreateResponse<Bloque>(
        'Bloque horario creado exitosamente',
        savedBloque,
        'CREATED'
      );
    } catch (error) {
      return CreateResponse<Bloque>(
        'Error al crear el bloque horario',
        null as unknown as Bloque,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  async findAll(): Promise<ApiResponse<Bloque[]>> {
    try {
      const bloques = await this.bloqueRepository.find({
        order: { hora_inicio: 'ASC' }
      });
      
      return CreateResponse<Bloque[]>(
        'Bloques horarios obtenidos exitosamente',
        bloques,
        'OK'
      );
    } catch (error) {
      return CreateResponse<Bloque[]>(
        'Error al obtener los bloques horarios',
        null as unknown as Bloque[],
        'INTERNAL_SERVER_ERROR',
        error.message,
        false
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Bloque>> {
    try {
      const bloque = await this.bloqueRepository.findOne({ where: { id_bloque: id } });
      
      if (!bloque) {
        throw new NotFoundException(`No se encontró el bloque horario con ID ${id}`);
      }
      
      return CreateResponse<Bloque>(
        'Bloque horario obtenido exitosamente',
        bloque,
        'OK'
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return CreateResponse<Bloque>(
          'Bloque horario no encontrado',
          null as unknown as Bloque,
          'NOT_FOUND',
          error.message,
          false
        );
      }
      
      return CreateResponse<Bloque>(
        'Error al obtener el bloque horario',
        null as unknown as Bloque,
        'INTERNAL_SERVER_ERROR',
        error.message,
        false
      );
    }
  }

  async update(id: number, updateBloqueDto: UpdateBloqueDto): Promise<ApiResponse<Bloque>> {
    try {
      const bloque = await this.bloqueRepository.findOne({ where: { id_bloque: id} });
      
      if (!bloque) {
        throw new NotFoundException(`No se encontró el bloque horario con ID ${id}`);
      }
      
      await this.bloqueRepository.update({ id_bloque: id }, updateBloqueDto);
      
      const updatedBloque = await this.bloqueRepository.findOne({ where: { id_bloque: id } });
      
      return CreateResponse<Bloque>(
        'Bloque horario actualizado exitosamente',
        updatedBloque,
        'OK'
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return CreateResponse<Bloque>(
          'Bloque horario no encontrado',
          null as unknown as Bloque,
          'NOT_FOUND',
          error.message,
          false
        );
      }
      
      return CreateResponse<Bloque>(
        'Error al actualizar el bloque horario',
        null as unknown as Bloque,
        'INTERNAL_SERVER_ERROR',
        error.message,
        false
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const bloque = await this.bloqueRepository.findOne({ where: { id_bloque: id } });
      
      if (!bloque) {
        throw new NotFoundException(`No se encontró el bloque horario con ID ${id}`);
      }
      
      await this.bloqueRepository.delete({ id_bloque: id });
      
      return CreateResponse<null>(
        'Bloque horario eliminado exitosamente',
        null,
        'OK'
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return CreateResponse<null>(
          'Bloque horario no encontrado',
          null,
          'NOT_FOUND',
          error.message,
          false
        );
      }
      
      return CreateResponse<null>(
        'Error al eliminar el bloque horario',
        null,
        'INTERNAL_SERVER_ERROR',
        error.message,
        false
      );
    }
  }
  
  async findActivos(): Promise<ApiResponse<Bloque[]>> {
    try {
      const bloquesActivos = await this.bloqueRepository.find({ 
        where: { activo: true },
        order: { hora_inicio: 'ASC' }
      });
      
      return CreateResponse<Bloque[]>(
        'Bloques horarios activos obtenidos exitosamente',
        bloquesActivos,
        'OK'
      );
    } catch (error) {
      return CreateResponse<Bloque[]>(
        'Error al obtener los bloques horarios activos',
        null as unknown as Bloque[],
        'INTERNAL_SERVER_ERROR',
        error.message,
        false
      );
    }
  }
}
