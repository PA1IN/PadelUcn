import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioAdminDto, AddSaldoUsuarioDto, CreateUsuarioDto, UpdateAdminDto, UpdateUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const {contrasena, ...rest } = createUsuarioDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { rut: createUsuarioDto.rut },
    });
    
    if (existingUser) {
      throw new ForbiddenException('El usuario con este RUT ya existe');
    }
    

    // Crear nuevo usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const newUser = this.usuarioRepository.create({
      rut: createUsuarioDto.rut,
      nombre_usuario: createUsuarioDto.nombre_usuario,
      correo: createUsuarioDto.correo,
      telefono: createUsuarioDto.telefono,
      contrasena: hashedPassword,                    
      saldo: 0,
      is_admin: false, 
    });

    return await this.usuarioRepository.save(newUser);
  }

  async crearUsuarioDesdeAdmin(dto: CreateUsuarioAdminDto) {
    // Verificar si el usuario ya existe por RUT
    const existente = await this.usuarioRepository.findOne({ where: { rut: dto.rut } });
    if (existente) {
      throw new ConflictException('El usuario ya existe');
    }

    // (Opcional) Verificar que el correo no esté duplicado
    const correoUsado = await this.usuarioRepository.findOne({ where: { correo: dto.correo } });
    if (correoUsado) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    // Crear usuario, respetando el flag is_admin si se incluyó
    const nuevoUsuario = this.usuarioRepository.create({
      rut: dto.rut,
      nombre_usuario: dto.nombre_usuario,
      correo: dto.correo,
      telefono: dto.telefono,
      contrasena: hashedPassword,
      is_admin: dto.is_admin ?? false, // solo true si lo mandás explícitamente
      saldo: 0,
    });

    const saved = await this.usuarioRepository.save(nuevoUsuario);

    // Retornar sin exponer la contraseña
    const { contrasena, ...limpio } = saved;
    return limpio;
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      select: ['id_usuario', 'rut', 'nombre_usuario', 'correo', 'telefono', 'saldo', 'is_admin'],
    });
  }  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      select: ['id_usuario', 'rut', 'nombre_usuario', 'correo', 'telefono', 'saldo', 'is_admin'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findByRut(rut: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { rut },
      select: ['id_usuario', 'rut', 'nombre_usuario', 'correo', 'telefono', 'saldo', 'is_admin'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    return usuario;
  }  async update(id: number, updateUsuarioDto: UpdateUsuarioDto, currentUser: any): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Solo el propio usuario o un administrador pueden actualizar un perfil
    if (usuario.id_usuario !== currentUser.id_usuario && !currentUser.is_admin) {
      throw new ForbiddenException('No tiene permisos para actualizar este usuario');
    }
    
    
  if (updateUsuarioDto.contrasena) {
    updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
  }

  
  await this.usuarioRepository.update({ id_usuario: id }, updateUsuarioDto);

  const updatedUser = await this.usuarioRepository.findOne({
    where: { id_usuario: id },
    select: ['id_usuario', 'rut', 'nombre_usuario', 'correo', 'telefono', 'saldo', 'is_admin'],
  });
  //para evitar nulls
  if (!updatedUser) {
    throw new NotFoundException(`Error al obtener el usuario actualizado con ID ${id}`);
  }
  return updatedUser;
  }

  async updateByRut(rut: string, updateUsuarioDto: UpdateUsuarioDto, currentUser: any): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { rut },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    // Solo el propio usuario o un administrador pueden actualizar un perfil
    if (usuario.rut !== currentUser.rut && !currentUser.is_admin) {
      throw new ForbiddenException('No tiene permisos para actualizar este usuario');
    }

    if (updateUsuarioDto.contrasena) {
    updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
  }

    // Actualizar los campos proporcionados
    Object.assign(usuario, updateUsuarioDto);

    return await this.usuarioRepository.save(usuario);
  }

  async addSaldo(rut: string, addSaldoDto: AddSaldoUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { rut },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    // Validar que el monto sea positivo
    if (addSaldoDto.monto <= 0) {
      throw new ForbiddenException('El monto debe ser mayor que cero');
    }

    usuario.saldo += addSaldoDto.monto;
    return await this.usuarioRepository.save(usuario);
  }

  async setAdmin(rut: string, updateAdminDto: UpdateAdminDto, currentUser: any): Promise<Usuario> {
    // Solo un administrador puede hacer a otro usuario administrador
    if (!currentUser.is_admin) {
      throw new ForbiddenException('No tiene permisos para realizar esta acción');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { rut },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    usuario.is_admin = updateAdminDto.isAdmin;
    return await this.usuarioRepository.save(usuario);
  }  async remove(id: number, currentUser: any): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Solo un administrador puede eliminar usuarios
    if (!currentUser.is_admin) {
      throw new ForbiddenException('No tiene permisos para eliminar usuarios');
    }

    await this.usuarioRepository.remove(usuario);
  }

  async removeByRut(rut: string, currentUser: any): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { rut },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    // Solo un administrador puede eliminar usuarios
    if (!currentUser.is_admin) {
      throw new ForbiddenException('No tiene permisos para eliminar usuarios');
    }

    await this.usuarioRepository.remove(usuario);
  }
}
