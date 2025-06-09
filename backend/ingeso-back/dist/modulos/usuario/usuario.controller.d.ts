import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UpdateAdminDto } from './dto/usuario.dto';
import { Usuario } from './entities/usuario.entity';
export declare class UsuarioController {
    private readonly usuarioService;
    constructor(usuarioService: UsuarioService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    setAdmin(rut: string, updateAdminDto: UpdateAdminDto, req: any): Promise<Usuario>;
    findOne(rut: string, req: any): Promise<Usuario>;
    update(rut: string, updateUsuarioDto: UpdateUsuarioDto, req: any): Promise<Usuario>;
    remove(rut: string, req: any): Promise<null>;
}
