"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
const bcrypt = require("bcrypt");
let UsuarioService = class UsuarioService {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async create(createUsuarioDto) {
        const { password, ...rest } = createUsuarioDto;
        const existingUser = await this.usuarioRepository.findOne({
            where: { rut: createUsuarioDto.rut },
        });
        if (existingUser) {
            throw new common_1.ForbiddenException('El usuario con este RUT ya existe');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usuarioRepository.create({
            ...rest,
            password: hashedPassword,
            isAdmin: false,
        });
        return await this.usuarioRepository.save(newUser);
    }
    async findAll() {
        return await this.usuarioRepository.find({
            select: ['id', 'rut', 'nombre', 'correo', 'telefono', 'saldo', 'isAdmin'],
        });
    }
    async findOne(id) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            select: ['id', 'rut', 'nombre', 'correo', 'telefono', 'saldo', 'isAdmin'],
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }
    async update(id, updateUsuarioDto, currentUser) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        if (usuario.id !== currentUser.id && !currentUser.isAdmin) {
            throw new common_1.ForbiddenException('No tiene permisos para actualizar este usuario');
        }
        Object.assign(usuario, updateUsuarioDto);
        return await this.usuarioRepository.save(usuario);
    }
    async addSaldo(rut, addSaldoDto) {
        const usuario = await this.usuarioRepository.findOne({
            where: { rut },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con RUT ${rut} no encontrado`);
        }
        if (addSaldoDto.monto <= 0) {
            throw new common_1.ForbiddenException('El monto debe ser mayor que cero');
        }
        usuario.saldo += addSaldoDto.monto;
        return await this.usuarioRepository.save(usuario);
    }
    async setAdmin(rut, updateAdminDto, currentUser) {
        if (!currentUser.isAdmin) {
            throw new common_1.ForbiddenException('No tiene permisos para realizar esta acción');
        }
        const usuario = await this.usuarioRepository.findOne({
            where: { rut },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con RUT ${rut} no encontrado`);
        }
        usuario.isAdmin = updateAdminDto.isAdmin;
        return await this.usuarioRepository.save(usuario);
    }
    async remove(id, currentUser) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
        });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        if (!currentUser.isAdmin) {
            throw new common_1.ForbiddenException('No tiene permisos para eliminar usuarios');
        }
        await this.usuarioRepository.remove(usuario);
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuarioService);
//# sourceMappingURL=usuario.service.js.map