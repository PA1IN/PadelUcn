import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { AddSaldoUsuarioDto, CreateUsuarioDto, UpdateAdminDto, UpdateUsuarioDto } from './dto/usuario.dto';
export declare class UsuarioService {
    private usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    findByRut(rut: string): Promise<Usuario>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto, currentUser: any): Promise<Usuario>;
    updateByRut(rut: string, updateUsuarioDto: UpdateUsuarioDto, currentUser: any): Promise<Usuario>;
    addSaldo(rut: string, addSaldoDto: AddSaldoUsuarioDto): Promise<Usuario>;
    setAdmin(rut: string, updateAdminDto: UpdateAdminDto, currentUser: any): Promise<Usuario>;
    remove(id: number, currentUser: any): Promise<void>;
    removeByRut(rut: string, currentUser: any): Promise<void>;
}
