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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcryptjs");
const api_response_util_1 = require("../../utils/api-response.util");
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(rut, password) {
        const user = await this.userService.findByRut(rut);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        try {
            const payload = { rut: user.rut, isAdmin: user.isAdmin };
            const token = this.jwtService.sign(payload);
            return (0, api_response_util_1.CreateResponse)('Inicio de sesión exitoso', {
                rut: user.rut,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.isAdmin ? 'admin' : 'usuario',
                token: token
            }, 'OK');
        }
        catch (error) {
            throw new common_1.UnauthorizedException((0, api_response_util_1.CreateResponse)('Error al iniciar sesión', null, 'UNAUTHORIZED', error.message));
        }
    }
    async register(createUserDto) {
        try {
            return await this.userService.create(createUserDto);
        }
        catch (error) {
            throw new common_1.UnauthorizedException((0, api_response_util_1.CreateResponse)('Error al registrar usuario', null, 'BAD_REQUEST', error.message));
        }
    }
    async getProfile(rut) {
        try {
            const userResponse = await this.userService.findOne(rut);
            if (!userResponse.data) {
                throw new Error('Usuario no encontrado');
            }
            return userResponse;
        }
        catch (error) {
            throw new common_1.UnauthorizedException((0, api_response_util_1.CreateResponse)('Error al obtener perfil', null, 'NOT_FOUND', error.message));
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map