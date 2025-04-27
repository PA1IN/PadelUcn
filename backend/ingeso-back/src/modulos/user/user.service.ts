import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findOne({ where: { rut: createUserDto.rut } });
      if (existingUser) {
        throw new Error(`Ya existe un usuario con el RUT ${createUserDto.rut}`);
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      // Crear el usuario con la contraseña encriptada
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      
      const savedUser = await this.userRepository.save(newUser);
      
      // No devolver la contraseña en la respuesta
      const { password, ...result } = savedUser;
      return CreateResponse('Usuario creado exitosamente', result as User, 'CREATED');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al crear usuario', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.userRepository.find();
      
      // No devolver las contraseñas
      const usersWithoutPasswords = users.map(user => {
        const { password, ...result } = user;
        return result as User;
      });
      
      return CreateResponse('Usuarios obtenidos exitosamente', usersWithoutPasswords, 'OK');
    } catch (error) {
      throw new HttpException(
        CreateResponse('Error al obtener usuarios', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(rut: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { rut } });
      
      if (!user) {
        throw new Error(`No se encontró un usuario con el RUT ${rut}`);
      }
      
      // No devolver la contraseña
      const { password, ...result } = user;
      return CreateResponse('Usuario obtenido exitosamente', result as User, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Usuario no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al obtener usuario', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByRut(rut: string): Promise<User> {
    return await this.userRepository.findOne({ where: { rut } });
  }

  async update(rut: string, updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { rut } });
      
      if (!user) {
        throw new Error(`No se encontró un usuario con el RUT ${rut}`);
      }
      
      // Si se actualiza la contraseña, encriptarla
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      await this.userRepository.update(rut, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { rut } });
      
      // No devolver la contraseña
      const { password, ...result } = updatedUser;
      return CreateResponse('Usuario actualizado exitosamente', result as User, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Usuario no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar usuario', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(rut: string): Promise<ApiResponse<null>> {
    try {
      const user = await this.userRepository.findOne({ where: { rut } });
      
      if (!user) {
        throw new Error(`No se encontró un usuario con el RUT ${rut}`);
      }
      
      await this.userRepository.delete(rut);
      return CreateResponse('Usuario eliminado exitosamente', null, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Usuario no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al eliminar usuario', null, 'INTERNAL_SERVER_ERROR', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
