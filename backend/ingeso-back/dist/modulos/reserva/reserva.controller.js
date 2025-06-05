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
let ReservaController = class ReservaController {
    reservaService;
    constructor(reservaService) {
        this.reservaService = reservaService;
    }
    transformReservaResponse(reserva) {
        return {
            id_reserva: reserva.id,
            fecha: reserva.fecha,
            hora_inicio: reserva.hora_inicio,
            hora_termino: reserva.hora_termino,
            id_usuario: reserva.idUsuario,
            id_cancha: reserva.idCancha,
            numero_cancha: reserva.cancha?.numero || null,
            nombre_cancha: reserva.cancha?.nombre || null,
            valor_cancha: reserva.cancha?.valor || null,
            usuario: reserva.usuario ? {
                id: reserva.usuario.id,
                rut: reserva.usuario.rut,
                nombre: reserva.usuario.nombre,
                correo: reserva.usuario.correo,
                saldo: reserva.usuario.saldo
            } : null,
            cancha: reserva.cancha ? {
                id_cancha: reserva.cancha.id,
                numero_cancha: reserva.cancha.numero,
                nombre: reserva.cancha.nombre,
                descripcion: reserva.cancha.descripcion,
                valor: reserva.cancha.valor
            } : null,
            jugadores: reserva.jugadores?.map(jugador => ({
                id_jugador: jugador.id,
                nombre: jugador.nombre,
                apellido: jugador.apellido,
                rut: jugador.rut,
                edad: jugador.edad,
                id_reserva: jugador.idReserva
            })) || [],
            boletas: reserva.boletas?.map(boleta => ({
                id_boleta: boleta.id,
                cantidad: boleta.cantidad,
                monto_total: boleta.montoTotal,
                id_reserva: boleta.idReserva,
                id_equipamiento: boleta.idEquipamiento,
                equipamiento: boleta.equipamiento ? {
                    id_equipamiento: boleta.equipamiento.id,
                    nombre: boleta.equipamiento.nombre,
                    tipo: boleta.equipamiento.tipo,
                    costo: boleta.equipamiento.costo
                } : null
            })) || [],
            historial: reserva.historiales?.map(historial => ({
                id_historial: historial.id,
                estado: historial.estado,
                fecha_estado: historial.fechaEstado,
                id_reserva: historial.idReserva,
                id_usuario: historial.idUsuario
            })) || []
        };
    }
    async create(createReservaDto, req) {
        try {
            const isAdmin = req.user.isAdmin;
            const reserva = await this.reservaService.create(createReservaDto, isAdmin);
            return reserva.data ? this.transformReservaResponse(reserva.data) : null;
        }
        catch (error) {
            return null;
        }
    }
    async findAll() {
        const reservas = await this.reservaService.findAll();
        if (!reservas.data)
            return [];
        return reservas.data.map(reserva => this.transformReservaResponse(reserva));
    }
    async findOne(id, req) {
        try {
            const response = await this.reservaService.findOne(+id);
            const reserva = response.data;
            if (!reserva) {
                return null;
            }
            if (!req.user.isAdmin && reserva.idUsuario !== req.user.id) {
                return null;
            }
            return this.transformReservaResponse(reserva);
        }
        catch (error) {
            return null;
        }
    }
    async update(id, updateReservaDto, req) {
        try {
            const isAdmin = req.user.isAdmin;
            if (!isAdmin) {
                const reservaResponse = await this.reservaService.findOne(+id);
                if (reservaResponse.data && reservaResponse.data.idUsuario !== req.user.id) {
                    return null;
                }
            }
            const reserva = await this.reservaService.update(+id, updateReservaDto, isAdmin);
            return reserva.data ? this.transformReservaResponse(reserva.data) : null;
        }
        catch (error) {
            return null;
        }
    }
    async remove(id, req) {
        try {
            const isAdmin = req.user.isAdmin;
            if (!isAdmin) {
                const reservaResponse = await this.reservaService.findOne(+id);
                if (reservaResponse.data && reservaResponse.data.idUsuario !== req.user.id) {
                    return null;
                }
            }
            await this.reservaService.remove(+id, isAdmin);
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async findByUsuario(rut, req) {
        try {
            if (!req.user.isAdmin && req.user.rut !== rut) {
                return [];
            }
            const reservas = await this.reservaService.findByUsuario(rut);
            if (!reservas.data)
                return [];
            return reservas.data.map(reserva => this.transformReservaResponse(reserva));
        }
        catch (error) {
            return [];
        }
    }
    async findByCancha(numero) {
        try {
            const reservas = await this.reservaService.findByCancha(+numero);
            if (!reservas.data)
                return [];
            return reservas.data.map(reserva => this.transformReservaResponse(reserva));
        }
        catch (error) {
            return [];
        }
    }
    async verificarDisponibilidad(numero, fecha, horaInicio, horaTermino) {
        try {
            const disponibilidad = await this.reservaService.verificarDisponibilidad(+numero, fecha, horaInicio, horaTermino);
            return { disponible: disponibilidad.data ? disponibilidad.data.disponible : false };
        }
        catch (error) {
            return { disponible: false };
        }
    }
    async obtenerHorariosDisponibles(numero, fecha) {
        try {
            const horarios = await this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
            return { horariosDisponibles: horarios };
        }
        catch (error) {
            return { horariosDisponibles: [] };
        }
    }
    async obtenerEstadisticas() {
        try {
            const estadisticas = await this.reservaService.obtenerEstadisticas();
            return estadisticas.data;
        }
        catch (error) {
            return null;
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