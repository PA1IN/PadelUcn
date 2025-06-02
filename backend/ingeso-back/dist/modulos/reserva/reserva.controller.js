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
const reserva_dto_1 = require("./dto/reserva.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const api_response_util_1 = require("../../utils/api-response.util");
let ReservaController = class ReservaController {
    reservaService;
    constructor(reservaService) {
        this.reservaService = reservaService;
    }
    async create(createReservaDto, req) {
        try {
            const isAdmin = req.user.isAdmin;
            const reserva = await this.reservaService.create(createReservaDto, isAdmin);
            return (0, api_response_util_1.CreateResponse)('Reserva creada exitosamente', reserva, 'CREATED');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al crear la reserva', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findAll() {
        try {
            const reservas = await this.reservaService.findAll();
            return (0, api_response_util_1.CreateResponse)('Reservas obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener reservas', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findOne(id, req) {
        try {
            const response = await this.reservaService.findOne(+id);
            const reserva = response.data;
            if (!reserva) {
                return (0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', 'La reserva solicitada no existe', false);
            }
            if (!req.user.isAdmin && reserva.idUsuario !== req.user.id) {
                return (0, api_response_util_1.CreateResponse)('No tienes permisos para ver esta reserva', null, 'FORBIDDEN', 'Acceso denegado', false);
            }
            return (0, api_response_util_1.CreateResponse)('Reserva obtenida exitosamente', reserva, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener la reserva', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async update(id, updateReservaDto, req) {
        try {
            const isAdmin = req.user.isAdmin;
            if (!isAdmin) {
                const reservaResponse = await this.reservaService.findOne(+id);
                if (reservaResponse.data && reservaResponse.data.idUsuario !== req.user.id) {
                    return (0, api_response_util_1.CreateResponse)('No tienes permisos para modificar esta reserva', null, 'FORBIDDEN', 'Acceso denegado', false);
                }
            }
            const reserva = await this.reservaService.update(+id, updateReservaDto, isAdmin);
            return (0, api_response_util_1.CreateResponse)('Reserva actualizada exitosamente', reserva, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al actualizar la reserva', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async remove(id, req) {
        try {
            const isAdmin = req.user.isAdmin;
            if (!isAdmin) {
                const reservaResponse = await this.reservaService.findOne(+id);
                if (reservaResponse.data && reservaResponse.data.idUsuario !== req.user.id) {
                    return (0, api_response_util_1.CreateResponse)('No tienes permisos para cancelar esta reserva', null, 'FORBIDDEN', 'Acceso denegado', false);
                }
            }
            await this.reservaService.remove(+id, isAdmin);
            return (0, api_response_util_1.CreateResponse)('Reserva cancelada exitosamente', null, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al cancelar la reserva', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findByUsuario(rut, req) {
        try {
            if (!req.user.isAdmin && req.user.rut !== rut) {
                return (0, api_response_util_1.CreateResponse)('No tienes permisos para ver estas reservas', null, 'FORBIDDEN', 'Acceso denegado', false);
            }
            const reservas = await this.reservaService.findByUsuario(rut);
            return (0, api_response_util_1.CreateResponse)('Reservas del usuario obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener las reservas del usuario', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findByCancha(numero) {
        try {
            const reservas = await this.reservaService.findByCancha(+numero);
            return (0, api_response_util_1.CreateResponse)('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener las reservas de la cancha', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async verificarDisponibilidad(numero, fecha, horaInicio, horaTermino) {
        try {
            const disponibilidad = await this.reservaService.verificarDisponibilidad(+numero, fecha, horaInicio, horaTermino);
            return (0, api_response_util_1.CreateResponse)(disponibilidad.data && disponibilidad.data.disponible
                ? `La cancha #${numero} está disponible en el horario solicitado`
                : `La cancha #${numero} no está disponible en el horario solicitado`, { disponible: disponibilidad.data ? disponibilidad.data.disponible : false }, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al verificar disponibilidad', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async obtenerHorariosDisponibles(numero, fecha) {
        try {
            const horarios = await this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
            return (0, api_response_util_1.CreateResponse)(`Horarios disponibles para la cancha #${numero} en la fecha ${fecha}`, { horariosDisponibles: horarios }, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener horarios disponibles', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async obtenerEstadisticas() {
        try {
            const estadisticas = await this.reservaService.obtenerEstadisticas();
            return (0, api_response_util_1.CreateResponse)('Estadísticas obtenidas exitosamente', estadisticas, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener estadísticas', null, 'BAD_REQUEST', error.message, false);
        }
    }
};
exports.ReservaController = ReservaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reserva_dto_1.CreateReservaDto, Object]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reserva_dto_1.UpdateReservaDto, Object]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('usuario/:rut'),
    __param(0, (0, common_1.Param)('rut')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('cancha/:numero'),
    __param(0, (0, common_1.Param)('numero')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "findByCancha", null);
__decorate([
    (0, common_1.Get)('disponibilidad/:numero/:fecha/:horaInicio/:horaTermino'),
    __param(0, (0, common_1.Param)('numero')),
    __param(1, (0, common_1.Param)('fecha')),
    __param(2, (0, common_1.Param)('horaInicio')),
    __param(3, (0, common_1.Param)('horaTermino')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "verificarDisponibilidad", null);
__decorate([
    (0, common_1.Get)('disponibilidad-dia/:numero/:fecha'),
    __param(0, (0, common_1.Param)('numero')),
    __param(1, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "obtenerHorariosDisponibles", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservaController.prototype, "obtenerEstadisticas", null);
exports.ReservaController = ReservaController = __decorate([
    (0, common_1.Controller)('reservas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reserva_service_1.ReservaService])
], ReservaController);
//# sourceMappingURL=reserva.controller.js.map