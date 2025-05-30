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
exports.ReservaController = void 0;
const common_1 = require("@nestjs/common");
const reserva_service_1 = require("./reserva.service");
const create_reserva_dto_1 = require("./dto/create-reserva.dto");
const update_reserva_dto_1 = require("./dto/update-reserva.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const swagger_1 = require("@nestjs/swagger");
let ReservaController = class ReservaController {
    reservaService;
    constructor(reservaService) {
        this.reservaService = reservaService;
    }
    create(createReservaDto, req) {
        return this.reservaService.create(createReservaDto, req.user.id);
    }
    findAll() {
        return this.reservaService.findAll();
    }
    findOne(id) {
        return this.reservaService.findOne(+id);
    }
    update(id, updateReservaDto, req) {
        return this.reservaService.update(+id, updateReservaDto, req.user.id);
    }
    remove(id, req) {
        return this.reservaService.cancelar(+id, req.user.id);
    }
    findByUsuario(rut) {
        return this.reservaService.findByUsuario(rut);
    }
    findByCancha(id) {
        return this.reservaService.findByCancha(+id);
    }
    verificarDisponibilidad(numero, fecha, horaInicio, horaTermino) {
        return this.reservaService.verificarDisponibilidad(+numero, fecha, horaInicio, horaTermino);
    }
    obtenerHorariosDisponibles(numero, fecha) {
        return this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
    }
    obtenerHistorial(id) {
        return this.reservaService.obtenerHistorial(+id);
    }
    obtenerEstadisticas() {
        return this.reservaService.obtenerEstadisticas();
    }
};
exports.ReservaController = ReservaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva reserva' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reserva creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o conflictos de horario' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reserva_dto_1.CreateReservaDto, Object]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las reservas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de reservas obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una reserva por su ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reserva obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una reserva existente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reserva actualizada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o conflictos de horario' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reserva_dto_1.UpdateReservaDto, Object]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar una reserva' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reserva cancelada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('usuario/:rut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las reservas de un usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de reservas obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('rut')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('cancha/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las reservas de una cancha' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de reservas obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "findByCancha", null);
__decorate([
    (0, common_1.Get)('disponibilidad/:numero/:fecha/:horaInicio/:horaTermino'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar disponibilidad de una cancha en un horario específico' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disponibilidad verificada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    __param(0, (0, common_1.Param)('numero')),
    __param(1, (0, common_1.Param)('fecha')),
    __param(2, (0, common_1.Param)('horaInicio')),
    __param(3, (0, common_1.Param)('horaTermino')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "verificarDisponibilidad", null);
__decorate([
    (0, common_1.Get)('disponibilidad-dia/:numero/:fecha'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los horarios disponibles de una cancha en una fecha' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Horarios disponibles obtenidos exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cancha no encontrada' }),
    __param(0, (0, common_1.Param)('numero')),
    __param(1, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "obtenerHorariosDisponibles", null);
__decorate([
    (0, common_1.Get)('historial/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el historial de una reserva' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "obtenerHistorial", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de uso de las canchas (solo administradores)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permisos insuficientes' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservaController.prototype, "obtenerEstadisticas", null);
exports.ReservaController = ReservaController = __decorate([
    (0, swagger_1.ApiTags)('reservas'),
    (0, common_1.Controller)('reservas'),
    __metadata("design:paramtypes", [reserva_service_1.ReservaService])
], ReservaController);
//# sourceMappingURL=reserva.controller.js.map