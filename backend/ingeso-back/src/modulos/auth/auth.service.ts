import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateUsuarioDto, LoginUsuarioDto } from '../usuario/dto/usuario.dto';

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
    console.log('Stored password hash: ', usuario.password);
    
    if (usuario && await bcrypt.compare(password, usuario.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = usuario;
      return result;
    }
    
    console.log('Password validation failed');
    return null;
  }
  async login(loginDto: LoginUsuarioDto) {
    const usuario = await this.validateUser(loginDto.rut, loginDto.password);
    
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
      usuario,
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }

  async register(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({ 
      where: { rut: createUsuarioDto.rut } 
    });
    
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Crear nuevo usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    const newUser = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
      isAdmin: false,
    });

    const savedUser = await this.usuarioRepository.save(newUser);
    const { password, ...result } = savedUser;
    
    const payload = { 
      sub: result.id, 
      rut: result.rut, 
      nombre: result.nombre,
      isAdmin: result.isAdmin 
    };
    
    return {
      usuario: result,
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }
}