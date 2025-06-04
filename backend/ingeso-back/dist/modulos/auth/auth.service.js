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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const usuario_entity_1 = require("../usuario/entities/usuario.entity");
let AuthService = class AuthService {
    usuarioRepository;
    jwtService;
    constructor(usuarioRepository, jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }
    async validateUser(rut, password) {
        const usuario = await this.usuarioRepository.findOne({ where: { rut } });
        if (!usuario) {
            return null;
        }
        console.log('Validating user: ', rut);
        console.log('Password provided: ', password);
        console.log('Stored password hash: ', usuario.password);
        if (usuario && await bcrypt.compare(password, usuario.password)) {
            const { password: _, ...result } = usuario;
            return result;
        }
        console.log('Password validation failed');
        return null;
    }
    async login(loginDto) {
        const usuario = await this.validateUser(loginDto.rut, loginDto.contraseña);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
    }
    async register(registerDto) {
        const existingUser = await this.usuarioRepository.findOne({
            where: { rut: registerDto.rut }
        });
        if (existingUser) {
            throw new common_1.ConflictException('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(registerDto.contraseña, 10);
        const newUser = this.usuarioRepository.create({
            rut: registerDto.rut,
            nombre: registerDto.nombre_usuario,
            correo: registerDto.correo,
            telefono: registerDto.telefono,
            password: hashedPassword,
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map