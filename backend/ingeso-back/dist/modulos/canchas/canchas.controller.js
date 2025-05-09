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
const swagger_1 = require("@nestjs/swagger");
let CanchasController = class CanchasController {
    canchasService;
    constructor(canchasService) {
        this.canchasService = canchasService;
    }
    async create(createCanchaDto) {
        return await this.canchasService.create(createCanchaDto);
    }
    async findAll() {
        return await this.canchasService.findAll();
    }
    async findOne(numero) {
        return await this.canchasService.findOne(+numero);
    }
    async update(numero, updateCanchaDto) {
        return await this.canchasService.update(+numero, updateCanchaDto);
    }
    async remove(numero) {
        return await this.canchasService.remove(+numero);
    }
};
exports.CanchasController = CanchasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva cancha' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cancha creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o cancha ya existente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cancha_dto_1.CreateCanchaDto]),
    __metadata("design:returntype", Promise)
], CanchasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las canchas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de canchas obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CanchasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':numero'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una cancha por su número' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancha obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    __param(0, (0, common_1.Param)('numero')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanchasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':numero'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una cancha existente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancha actualizada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Param)('numero')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cancha_dto_1.UpdateCanchaDto]),
    __metadata("design:returntype", Promise)
], CanchasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':numero'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una cancha' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancha eliminada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    __param(0, (0, common_1.Param)('numero')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanchasController.prototype, "remove", null);
exports.CanchasController = CanchasController = __decorate([
    (0, swagger_1.ApiTags)('canchas'),
    (0, common_1.Controller)('canchas'),
    __metadata("design:paramtypes", [canchas_service_1.CanchasService])
], CanchasController);
//# sourceMappingURL=canchas.controller.js.map