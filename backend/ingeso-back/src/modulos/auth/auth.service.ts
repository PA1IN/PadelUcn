import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto, RegisterDto, LoginResponseDto, RegisterResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}  async validateUser(rut: string, password: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });
    
    if (!usuario) {
      console.log('Usuario no encontrado ');
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, usuario.contrasena);

    if (isPasswordValid) {
      console.log('Contraseña válida');
      const { contrasena, ...result } = usuario;
      return result;
    }
    console.log('Contraseña inválida');
    return null;
  }
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const usuario = await this.validateUser(loginDto.rut, loginDto.contrasena);
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { 
      sub: usuario.id_usuario,           
      rut: usuario.rut, 
      nombre_usuario: usuario.nombre_usuario,
      is_admin: usuario.is_admin           
    };
      return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: {
        id_usuario: usuario.id_usuario,         
        rut: usuario.rut,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        telefono: usuario.telefono,
        saldo: usuario.saldo,
        is_admin: usuario.is_admin,
      },
    };
  }  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({ 
      where: { rut: registerDto.rut } 
    });
    
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Crear nuevo usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 10);

    const newUser = this.usuarioRepository.create({
      rut: registerDto.rut,
      nombre_usuario: registerDto.nombre_usuario, 
      correo: registerDto.correo,
      telefono: registerDto.telefono,
      contrasena: hashedPassword,  
      is_admin: false,    
      saldo: 0,
    });

    const savedUser = await this.usuarioRepository.save(newUser);
    
    return {
      id_usuario: savedUser.id_usuario,         
      rut: savedUser.rut,
      nombre_usuario: savedUser.nombre_usuario,
      correo: savedUser.correo,
      telefono: savedUser.telefono,
      saldo: savedUser.saldo,
      is_admin: savedUser.is_admin, 
    };
  }
}