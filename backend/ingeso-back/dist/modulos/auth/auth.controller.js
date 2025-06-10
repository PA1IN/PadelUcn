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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const usuario_service_1 = require("../usuario/usuario.service");
const api_response_util_1 = require("../../utils/api-response.util");
let AuthController = class AuthController {
    authService;
    usuarioService;
    constructor(authService, usuarioService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
    }
    async login(loginDto) {
        console.log('Login request received:', loginDto);
        try {
            const result = await this.authService.login(loginDto);
            console.log('Login successful');
            return result;
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    async register(createUserDto) {
        try {
            const result = await this.authService.register(createUserDto);
            return (0, api_response_util_1.CreateResponse)('Usuario registrado exitosamente', result, 'CREATED');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al registrar usuario', null, 'BAD_REQUEST', error.message, false);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        usuario_service_1.UsuarioService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map