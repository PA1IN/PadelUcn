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
exports.CanchasController = void 0;
const common_1 = require("@nestjs/common");
const canchas_service_1 = require("./canchas.service");
const create_cancha_dto_1 = require("./dto/create-cancha.dto");
const update_cancha_dto_1 = require("./dto/update-cancha.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const swagger_1 = require("@nestjs/swagger");
let CanchasController = class CanchasController {
    canchasService;
    constructor(canchasService) {
        this.canchasService = canchasService;
    }
    create(createCanchaDto) {
        return this.canchasService.create(createCanchaDto);
    }
    findAll() {
        return this.canchasService.findAll();
    }
    findOne(id) {
        return this.canchasService.findOne(+id);
    }
    update(id, updateCanchaDto) {
        return this.canchasService.update(+id, updateCanchaDto);
    }
    remove(id) {
        return this.canchasService.remove(+id);
    }
};
exports.CanchasController = CanchasController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva cancha (solo administradores)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cancha creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permisos insuficientes' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cancha_dto_1.CreateCanchaDto]),
    __metadata("design:returntype", void 0)
], CanchasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las canchas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de canchas obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CanchasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una cancha por su ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancha obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CanchasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una cancha existente (solo administradores)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancha actualizada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permisos insuficientes' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cancha_dto_1.UpdateCanchaDto]),
    __metadata("design:returntype", void 0)
], CanchasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una cancha (solo administradores)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancha eliminada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permisos insuficientes' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CanchasController.prototype, "remove", null);
exports.CanchasController = CanchasController = __decorate([
    (0, swagger_1.ApiTags)('canchas'),
    (0, common_1.Controller)('canchas'),
    __metadata("design:paramtypes", [canchas_service_1.CanchasService])
], CanchasController);
//# sourceMappingURL=canchas.controller.js.map