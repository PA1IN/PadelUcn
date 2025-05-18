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
exports.HistorialReservaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const historial_reserva_entity_1 = require("../entities/historial-reserva.entity");
const api_response_util_1 = require("../../../utils/api-response.util");
let HistorialReservaService = class HistorialReservaService {
    historialReservaRepository;
    constructor(historialReservaRepository) {
        this.historialReservaRepository = historialReservaRepository;
    }
    async create(createHistorialReservaDto) {
        try {
            const nuevoHistorial = this.historialReservaRepository.create(createHistorialReservaDto);
            const savedHistorial = await this.historialReservaRepository.save(nuevoHistorial);
            return (0, api_response_util_1.CreateResponse)('Historial de reserva creado exitosamente', savedHistorial, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear historial de reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const historiales = await this.historialReservaRepository.find({
                relations: ['reserva', 'usuario'],
            });
            return (0, api_response_util_1.CreateResponse)('Historiales de reserva obtenidos exitosamente', historiales, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener historiales de reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByReserva(idReserva) {
        try {
            const historiales = await this.historialReservaRepository.find({
                where: { idReserva },
                relations: ['usuario'],
                order: { fechaEstado: 'DESC' },
            });
            return (0, api_response_util_1.CreateResponse)('Historiales de reserva obtenidos exitosamente', historiales, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener historiales de reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByUsuario(idUsuario) {
        try {
            const historiales = await this.historialReservaRepository.find({
                where: { idUsuario },
                relations: ['reserva'],
                order: { fechaEstado: 'DESC' },
            });
            return (0, api_response_util_1.CreateResponse)('Historiales de reserva obtenidos exitosamente', historiales, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener historiales de reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const historial = await this.historialReservaRepository.findOne({
                where: { id },
                relations: ['reserva', 'usuario'],
            });
            if (!historial) {
                throw new Error(`No se encontró un historial con el ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Historial de reserva obtenido exitosamente', historial, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Historial de reserva no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener historial de reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.HistorialReservaService = HistorialReservaService;
exports.HistorialReservaService = HistorialReservaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_reserva_entity_1.HistorialReserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HistorialReservaService);
//# sourceMappingURL=historial-reserva.service.js.map