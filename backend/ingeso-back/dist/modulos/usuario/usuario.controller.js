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
exports.UsuarioController = void 0;
const common_1 = require("@nestjs/common");
const usuario_service_1 = require("./usuario.service");
const usuario_dto_1 = require("./dto/usuario.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let UsuarioController = class UsuarioController {
    usuarioService;
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
    async create(createUsuarioDto) {
        try {
            const usuario = await this.usuarioService.create(createUsuarioDto);
            return usuario;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const usuarios = await this.usuarioService.findAll();
            return usuarios;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setAdmin(rut, updateAdminDto, req) {
        try {
            const usuario = await this.usuarioService.setAdmin(rut, updateAdminDto, req.user);
            return usuario;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(rut, req) {
        try {
            if (!req.user.isAdmin && req.user.rut !== rut) {
                throw new common_1.ForbiddenException('No tiene permisos para acceder a este recurso');
            }
            const usuario = await this.usuarioService.findByRut(rut);
            return usuario;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(rut, updateUsuarioDto, req) {
        try {
            if (!req.user.isAdmin && req.user.rut !== rut) {
                throw new common_1.ForbiddenException('No tiene permisos para acceder a este recurso');
            }
            const usuario = await this.usuarioService.updateByRut(rut, updateUsuarioDto, req.user);
            return usuario;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(rut, req) {
        try {
            await this.usuarioService.removeByRut(rut, req.user);
            return null;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UsuarioController = UsuarioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_dto_1.CreateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('set-admin/:rut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('rut')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, usuario_dto_1.UpdateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "setAdmin", null);
__decorate([
    (0, common_1.Get)(':rut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('rut')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':rut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('rut')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, usuario_dto_1.UpdateUsuarioDto, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':rut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('rut')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "remove", null);
exports.UsuarioController = UsuarioController = __decorate([
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService])
], UsuarioController);
//# sourceMappingURL=usuario.controller.js.map