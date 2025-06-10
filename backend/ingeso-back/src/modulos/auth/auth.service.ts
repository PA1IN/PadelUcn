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
  ) {}
  async validateUser(rut: string, password: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });
    
    if (!usuario) {
      return null;
    }    
    // Add logging to debug password comparison
    console.log('Validating user: ', rut);
    console.log('Password provided: ', password);
    console.log('Stored password hash: ', usuario.contrasena);
    
    if (usuario && await bcrypt.compare(password, usuario.contrasena)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contrasena: _, ...result } = usuario;
      return result;
    }
    
    console.log('Password validation failed');
    return null;
  }  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const usuario = await this.validateUser(loginDto.rut, loginDto.contrasena);
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { 
      sub: usuario.id, 
      rut: usuario.rut, 
      nombre: usuario.nombre,
      isAdmin: usuario.isAdmin 
    };
      return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: {
        id: usuario.id,
        rut: usuario.rut,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        saldo: usuario.saldo,
        isAdmin: usuario.isAdmin,
      },
    };
  }  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({ 
      where: { rut: registerDto.rut } 
    });
    
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }    // Crear nuevo usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 10);
    const newUser = this.usuarioRepository.create({
      rut: registerDto.rut,
      nombre: registerDto.nombre_usuario,
      correo: registerDto.correo,
      telefono: registerDto.telefono,
      contrasena: hashedPassword,
      isAdmin: false,
      saldo: 0,
    });

    const savedUser = await this.usuarioRepository.save(newUser);
    
    return {
      id: savedUser.id,
      rut: savedUser.rut,
      nombre: savedUser.nombre,
      correo: savedUser.correo,
      telefono: savedUser.telefono,
      saldo: savedUser.saldo,
      isAdmin: savedUser.isAdmin,
    };
  }
}