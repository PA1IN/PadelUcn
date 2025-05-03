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
exports.ReservaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserva_entity_1 = require("./entities/reserva.entity");
const api_response_util_1 = require("../../utils/api-response.util");
let ReservaService = class ReservaService {
    reservaRepository;
    constructor(reservaRepository) {
        this.reservaRepository = reservaRepository;
    }
    async create(createReservaDto) {
        try {
            const existingReserva = await this.reservaRepository.findOne({
                where: {
                    fecha: new Date(createReservaDto.fecha),
                    cancha: { numero: createReservaDto.numero_cancha },
                },
                relations: ['cancha'],
            });
            if (existingReserva) {
                throw new Error(`La cancha no está disponible en el horario solicitado`);
            }
            const newReserva = this.reservaRepository.create({
                ...createReservaDto,
                fecha: new Date(createReservaDto.fecha),
            });
            const savedReserva = await this.reservaRepository.save(newReserva);
            return (0, api_response_util_1.CreateResponse)('Reserva creada exitosamente', savedReserva, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear la reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const reservas = await this.reservaRepository.find({
                relations: ['usuario', 'cancha', 'administrador'],
            });
            return (0, api_response_util_1.CreateResponse)('Reservas obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener reservas', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const reserva = await this.reservaRepository.findOne({
                where: { id_reserva: id },
                relations: ['usuario', 'cancha', 'administrador', 'boletas', 'boletas.equipamiento'],
            });
            if (!reserva) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Reserva obtenida exitosamente', reserva, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener la reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByUser(rutUsuario) {
        try {
            const reservas = await this.reservaRepository.find({
                where: { usuario: { rut: rutUsuario } },
                relations: ['cancha', 'boletas', 'boletas.equipamiento'],
            });
            return (0, api_response_util_1.CreateResponse)('Reservas del usuario obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener las reservas del usuario', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateReservaDto) {
        try {
            const reserva = await this.reservaRepository.findOne({
                where: { id_reserva: id },
                relations: ['usuario', 'cancha'],
            });
            if (!reserva) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            if (updateReservaDto.fecha || updateReservaDto.hora_inicio || updateReservaDto.hora_termino) {
            }
            if (updateReservaDto.fecha) {
                updateReservaDto.fecha = new Date(updateReservaDto.fecha);
            }
            await this.reservaRepository.update(id, updateReservaDto);
            const updatedReserva = await this.reservaRepository.findOne({
                where: { id_reserva: id },
                relations: ['usuario', 'cancha', 'administrador'],
            });
            if (!updatedReserva) {
                throw new Error(`Error al obtener reserva actualizada con ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Reserva actualizada exitosamente', updatedReserva, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar la reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const reserva = await this.reservaRepository.findOne({ where: { id_reserva: id } });
            if (!reserva) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            await this.reservaRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Reserva eliminada exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar la reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ReservaService = ReservaService;
exports.ReservaService = ReservaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservaService);
//# sourceMappingURL=reserva.service.js.map