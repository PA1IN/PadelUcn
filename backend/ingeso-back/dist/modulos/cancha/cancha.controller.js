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
exports.CanchaController = void 0;
const common_1 = require("@nestjs/common");
const cancha_service_1 = require("./cancha.service");
const cancha_dto_1 = require("./dto/cancha.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let CanchaController = class CanchaController {
    canchaService;
    constructor(canchaService) {
        this.canchaService = canchaService;
    }
    async create(createCanchaDto) {
        return await this.canchaService.create(createCanchaDto);
    }
    async findAll() {
        const canchas = await this.canchaService.findAll();
        return canchas.map(cancha => ({
            id_cancha: cancha.id,
            numero_cancha: cancha.numero,
            nombre: cancha.nombre,
            descripcion: cancha.descripcion,
            valor: cancha.valor,
            maxJugadores: 4
        }));
    }
    async findAvailable() {
        const canchas = await this.canchaService.findAvailableCourts();
        return canchas.map(cancha => ({
            id_cancha: cancha.id,
            numero_cancha: cancha.numero,
            nombre: cancha.nombre,
            descripcion: cancha.descripcion,
            valor: cancha.valor,
            maxJugadores: 4
        }));
    }
    async findOne(numero) {
        try {
            const cancha = await this.canchaService.findByNumero(numero);
            if (!cancha)
                return null;
            return {
                id_cancha: cancha.id,
                numero_cancha: cancha.numero,
                nombre: cancha.nombre,
                descripcion: cancha.descripcion,
                valor: cancha.valor,
                maxJugadores: 4
            };
        }
        catch (error) {
            return null;
        }
    }
    async update(numero, updateCanchaDto) {
        try {
            return await this.canchaService.update(numero, updateCanchaDto);
        }
        catch (error) {
            return null;
        }
    }
    async remove(numero) {
        try {
            await this.canchaService.remove(numero);
            return null;
        }
        catch (error) {
            return null;
        }
    }
};
exports.CanchaController = CanchaController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancha_dto_1.CreateCanchaDto]),
    __metadata("design:returntype", Promise)
], CanchaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CanchaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('disponibles'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CanchaController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)(':numero'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('numero')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CanchaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':numero'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('numero')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cancha_dto_1.UpdateCanchaDto]),
    __metadata("design:returntype", Promise)
], CanchaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':numero'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('numero')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CanchaController.prototype, "remove", null);
exports.CanchaController = CanchaController = __decorate([
    (0, common_1.Controller)('canchas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [cancha_service_1.CanchaService])
], CanchaController);
//# sourceMappingURL=cancha.controller.js.map