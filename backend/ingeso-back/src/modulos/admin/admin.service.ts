import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<ApiResponse<Admin>> {
    try {
      // Verificar si ya existe un administrador con el mismo nombre de usuario
      const existingAdmin = await this.adminRepository.findOne({ 
        where: { nombre_usuario: createAdminDto.nombre_usuario } 
      });
      
      if (existingAdmin) {
        throw new Error(`Ya existe un administrador con el nombre de usuario ${createAdminDto.nombre_usuario}`);
      }
      
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
      
      // Crear el administrador con la contraseña encriptada
      const newAdmin = this.adminRepository.create({
        ...createAdminDto,
        password: hashedPassword,
      });
      
      const savedAdmin = await this.adminRepository.save(newAdmin);
      
      // No devolver la contraseña en la respuesta
      const { password, ...result } = savedAdmin;
      return CreateResponse('Administrador creado exitosamente', result as Admin, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear administrador', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<Admin[]>> {
    try {
      const admins = await this.adminRepository.find();
      
      // No devolver las contraseñas
      const adminsWithoutPasswords = admins.map(admin => {
        const { password, ...result } = admin;
        return result as Admin;
      });
      
      return CreateResponse('Administradores obtenidos exitosamente', adminsWithoutPasswords, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener administradores', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<Admin>> {
    try {
      const admin = await this.adminRepository.findOne({ where: { id_admin: id } });
      
      if (!admin) {
        throw new Error(`No se encontró un administrador con el ID ${id}`);
      }
      
      // No devolver la contraseña
      const { password, ...result } = admin;
      return CreateResponse('Administrador obtenido exitosamente', result as Admin, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Administrador no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener administrador', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { nombre_usuario: username } });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<ApiResponse<Admin>> {
    try {
      const admin = await this.adminRepository.findOne({ where: { id_admin: id } });
      
      if (!admin) {
        throw new Error(`No se encontró un administrador con el ID ${id}`);
      }
      
      // Si se actualiza la contraseña, encriptarla
      if (updateAdminDto.password) {
        updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
      }
      
      await this.adminRepository.update(id, updateAdminDto);
      const updatedAdmin = await this.adminRepository.findOne({ where: { id_admin: id } });
      
      if (!updatedAdmin) {
        throw new Error(`Error al obtener administrador actualizado con ID ${id}`);
      }
      
      // No devolver la contraseña
      const { password, ...result } = updatedAdmin;
      return CreateResponse('Administrador actualizado exitosamente', result as Admin, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Administrador no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar administrador', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const admin = await this.adminRepository.findOne({ where: { id_admin: id } });
      
      if (!admin) {
        throw new Error(`No se encontró un administrador con el ID ${id}`);
      }
      
      await this.adminRepository.delete(id);
      return CreateResponse('Administrador eliminado exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Administrador no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar administrador', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
