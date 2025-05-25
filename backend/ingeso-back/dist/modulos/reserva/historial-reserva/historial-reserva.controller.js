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
exports.HistorialReservaController = void 0;
const common_1 = require("@nestjs/common");
const historial_reserva_service_1 = require("./historial-reserva.service");
const create_historial_reserva_dto_1 = require("./dto/create-historial-reserva.dto");
const swagger_1 = require("@nestjs/swagger");
let HistorialReservaController = class HistorialReservaController {
    historialReservaService;
    constructor(historialReservaService) {
        this.historialReservaService = historialReservaService;
    }
    create(createHistorialReservaDto) {
        return this.historialReservaService.create(createHistorialReservaDto);
    }
    findAll() {
        return this.historialReservaService.findAll();
    }
    findByReserva(id) {
        return this.historialReservaService.findByReserva(+id);
    }
    findByUsuario(id) {
        return this.historialReservaService.findByUsuario(+id);
    }
    findOne(id) {
        return this.historialReservaService.findOne(+id);
    }
};
exports.HistorialReservaController = HistorialReservaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo registro de historial de reserva' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Historial creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_historial_reserva_dto_1.CreateHistorialReservaDto]),
    __metadata("design:returntype", void 0)
], HistorialReservaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los registros de historial de reservas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de historiales obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HistorialReservaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('reserva/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historiales de una reserva específica' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historiales obtenidos exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialReservaController.prototype, "findByReserva", null);
__decorate([
    (0, common_1.Get)('usuario/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historiales de un usuario específico' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historiales obtenidos exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialReservaController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un historial específico por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Historial no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialReservaController.prototype, "findOne", null);
exports.HistorialReservaController = HistorialReservaController = __decorate([
    (0, swagger_1.ApiTags)('historial-reservas'),
    (0, common_1.Controller)('historial-reservas'),
    __metadata("design:paramtypes", [historial_reserva_service_1.HistorialReservaService])
], HistorialReservaController);
//# sourceMappingURL=historial-reserva.controller.js.map