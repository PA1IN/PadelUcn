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
const api_response_util_1 = require("../../utils/api-response.util");
let CanchaController = class CanchaController {
    canchaService;
    constructor(canchaService) {
        this.canchaService = canchaService;
    }
    async create(createCanchaDto) {
        try {
            const cancha = await this.canchaService.create(createCanchaDto);
            return (0, api_response_util_1.CreateResponse)('Cancha creada exitosamente', cancha, 'CREATED');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al crear la cancha', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findAll() {
        try {
            const canchas = await this.canchaService.findAll();
            return (0, api_response_util_1.CreateResponse)('Canchas obtenidas exitosamente', canchas, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener las canchas', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findAvailable() {
        try {
            const canchas = await this.canchaService.findAvailableCourts();
            return (0, api_response_util_1.CreateResponse)('Canchas disponibles obtenidas exitosamente', canchas, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener canchas disponibles', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findOne(numero) {
        try {
            const cancha = await this.canchaService.findByNumero(numero);
            return (0, api_response_util_1.CreateResponse)('Cancha obtenida exitosamente', cancha, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener la cancha', null, 'NOT_FOUND', error.message, false);
        }
    }
    async update(numero, updateCanchaDto) {
        try {
            const cancha = await this.canchaService.update(numero, updateCanchaDto);
            return (0, api_response_util_1.CreateResponse)('Cancha actualizada exitosamente', cancha, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al actualizar la cancha', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async remove(numero) {
        try {
            await this.canchaService.remove(numero);
            return (0, api_response_util_1.CreateResponse)('Cancha eliminada exitosamente', null, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al eliminar la cancha', null, 'BAD_REQUEST', error.message, false);
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