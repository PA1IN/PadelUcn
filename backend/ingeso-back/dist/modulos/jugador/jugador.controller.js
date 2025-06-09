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
exports.JugadorController = void 0;
const common_1 = require("@nestjs/common");
const jugador_service_1 = require("./jugador.service");
const jugador_dto_1 = require("./dto/jugador.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let JugadorController = class JugadorController {
    jugadorService;
    constructor(jugadorService) {
        this.jugadorService = jugadorService;
    }
    async create(createJugadorDto) {
        return this.jugadorService.create(createJugadorDto);
    }
    async findAll() {
        return this.jugadorService.findAll();
    }
    async findOne(id) {
        return this.jugadorService.findOne(+id);
    }
    async createBatch(createJugadoresDto) {
        if (!Array.isArray(createJugadoresDto)) {
            throw new common_1.BadRequestException('El cuerpo de la solicitud debe ser un arreglo de jugadores');
        }
        const resultados = [];
        for (const jugadorDto of createJugadoresDto) {
            try {
                const resultado = await this.jugadorService.create(jugadorDto);
                resultados.push(resultado);
            }
            catch (error) {
                resultados.push({
                    success: false,
                    message: error.message || 'Error al crear jugador',
                    data: jugadorDto,
                    error: error.message
                });
            }
        }
        return {
            message: 'Proceso de creación de jugadores completado',
            data: resultados,
            statusCode: 201,
            success: true
        };
    }
};
exports.JugadorController = JugadorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jugador_dto_1.CreateJugadorDto]),
    __metadata("design:returntype", Promise)
], JugadorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JugadorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JugadorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], JugadorController.prototype, "createBatch", null);
exports.JugadorController = JugadorController = __decorate([
    (0, common_1.Controller)('jugador'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [jugador_service_1.JugadorService])
], JugadorController);
//# sourceMappingURL=jugador.controller.js.map