import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiResponse } from '../../interface/Apiresponce';
import { User } from '../user/entities/user.entity';
import { CreateResponse } from '../../utils/api-response.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(rut: string, password: string): Promise<any> {
    const user = await this.userService.findByRut(rut);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<ApiResponse<{access_token: string}>> {
    try {
      const payload = { rut: user.rut };
      const token = this.jwtService.sign(payload);
      
      return CreateResponse(
        'Inicio de sesión exitoso',
        { access_token: token },
        'OK'
      );
    } catch (error) {
      throw new UnauthorizedException(
        CreateResponse(
          'Error al iniciar sesión',
          null,
          'UNAUTHORIZED',
          error.message
        )
      );
    }
  }

  async register(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new UnauthorizedException(
        CreateResponse(
          'Error al registrar usuario',
          null,
          'BAD_REQUEST',
          error.message
        )
      );
    }
  }

  async getProfile(rut: string): Promise<ApiResponse<User>> {
    try {
      const userResponse = await this.userService.findOne(rut);
      if (!userResponse.data) {
        throw new Error('Usuario no encontrado');
      }
      return userResponse;
    } catch (error) {
      throw new UnauthorizedException(
        CreateResponse(
          'Error al obtener perfil',
          null,
          'NOT_FOUND',
          error.message
        )
      );
    }
  }
}