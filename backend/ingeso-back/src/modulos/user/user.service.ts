import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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
  ) {}  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findOne({ where: { rut: createUserDto.rut } });
      if (existingUser) {
        throw new Error(`Ya existe un usuario con el RUT ${createUserDto.rut}`);
      }

      console.log('Creating user with data:', { ...createUserDto, password: '[HIDDEN]' });

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      console.log('Password hashed successfully');
      
      // Crear el usuario con la contraseña encriptada
      // Mapeo explícito del DTO a la entidad teniendo en cuenta los nombres de columna diferentes
      const newUser = this.userRepository.create({
        rut: createUserDto.rut,
        password: hashedPassword, // Será mapeado a 'contrase??a' por la entidad
        nombre: createUserDto.nombre, // Será mapeado a 'nombre_usuario' por la entidad
        correo: createUserDto.correo,
        telefono: createUserDto.telefono,
        saldo: createUserDto.saldo || 0,
        isAdmin: createUserDto.isAdmin || false,
      });
      
      console.log('User entity created:', { ...newUser, password: '[HIDDEN]' });
      
      try {
        const savedUser = await this.userRepository.save(newUser);
        console.log('User saved successfully:', { ...savedUser, password: '[HIDDEN]' });
        
        // No devolver la contraseña en la respuesta
        const { password, ...result } = savedUser;
        return CreateResponse('Usuario creado exitosamente', result as User, 'CREATED');
      } catch (saveError) {
        console.error('Error saving user to database:', saveError);
        console.error('Stack trace:', saveError.stack);
        throw saveError;
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      console.error('Stack trace:', error.stack);
      
      // Try to get more detailed error information
      if (error.name === 'QueryFailedError') {
        console.error('SQL Error:', error.detail || error.message);
      }
      
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
  }  async findByRut(rut: string): Promise<User | null> {
    console.log('Finding user by RUT:', rut);
    const user = await this.userRepository.findOne({ where: { rut } });
    console.log('User found:', user ? { ...user, password: typeof user.password } : 'User not found');
    return user;
  }
  
  async findById(id: number): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new Error(`No se encontró un usuario con el ID ${id}`);
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
  
  async updateSaldo(userId: number, monto: number): Promise<ApiResponse<User>> {
    try {
      const userResponse = await this.findById(userId);
      if (!userResponse.data) {
        throw new Error(`Usuario con ID ${userId} no encontrado`);
      }
      
      const user = userResponse.data;
      const nuevoSaldo = user.saldo + monto;
      
      if (nuevoSaldo < 0) {
        throw new Error('El saldo no puede ser negativo');
      }
      
      await this.userRepository.update(userId, { saldo: nuevoSaldo });
      
      const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
      if (!updatedUser) {
        throw new Error(`Error al obtener usuario actualizado con ID ${userId}`);
      }
      
      // No devolver la contraseña
      const { password, ...result } = updatedUser;
      return CreateResponse('Saldo actualizado exitosamente', result as User, 'OK');
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(
          CreateResponse('Usuario no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      } else if (error.message.includes('no puede ser negativo')) {
        throw new HttpException(
          CreateResponse('Error de saldo', null, 'BAD_REQUEST', error.message),
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al actualizar saldo', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
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
      
      if (!updatedUser) {
        throw new Error(`Error al obtener usuario actualizado con RUT ${rut}`);
      }
      
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

  async promoteToAdmin(rut: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { rut } });
      
      if (!user) {
        throw new Error(`No se encontró un usuario con el RUT ${rut}`);
      }

      if (user.isAdmin) {
        return CreateResponse('El usuario ya es administrador', { rut: user.rut, isAdmin: true } as User, 'OK');
      }
      
      await this.userRepository.update(rut, { isAdmin: true });
      const updatedUser = await this.userRepository.findOne({ where: { rut } });
      
      if (!updatedUser) {
        throw new Error(`Error al obtener usuario actualizado con RUT ${rut}`);
      }
      
      // No devolver la contraseña
      const { password, ...result } = updatedUser;
      return CreateResponse('Usuario promovido a administrador exitosamente', result as User, 'OK');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw new HttpException(
          CreateResponse('Usuario no encontrado', null, 'NOT_FOUND', error.message),
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        CreateResponse('Error al promover usuario a administrador', null, 'BAD_REQUEST', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
