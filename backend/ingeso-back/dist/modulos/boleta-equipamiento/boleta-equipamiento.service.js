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
exports.BoletaEquipamientoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const boleta_equipamiento_entity_1 = require("./entities/boleta-equipamiento.entity");
const api_response_util_1 = require("../../utils/api-response.util");
const equipamiento_service_1 = require("../equipamiento/equipamiento.service");
let BoletaEquipamientoService = class BoletaEquipamientoService {
    boletaRepository;
    equipamientoService;
    constructor(boletaRepository, equipamientoService) {
        this.boletaRepository = boletaRepository;
        this.equipamientoService = equipamientoService;
    }
    async create(createBoletaDto) {
        try {
            const equipamientoResponse = await this.equipamientoService.findOne(createBoletaDto.id_equipamiento);
            const equipamiento = equipamientoResponse.data;
            if (!equipamiento) {
                throw new Error(`No se encontró el equipamiento con ID ${createBoletaDto.id_equipamiento}`);
            }
            if (equipamiento.stock < createBoletaDto.cantidad) {
                throw new Error(`Stock insuficiente para el equipamiento ${equipamiento.tipo}`);
            }
            const newBoleta = this.boletaRepository.create(createBoletaDto);
            const savedBoleta = await this.boletaRepository.save(newBoleta);
            await this.equipamientoService.actualizarStock(equipamiento.id_equipamiento, -createBoletaDto.cantidad);
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento creada exitosamente', savedBoleta, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear boleta de equipamiento', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const boletas = await this.boletaRepository.find({
                relations: ['usuario', 'reserva', 'equipamiento'],
            });
            return (0, api_response_util_1.CreateResponse)('Boletas de equipamiento obtenidas exitosamente', boletas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener boletas de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const boleta = await this.boletaRepository.findOne({
                where: { id_boleta: id },
                relations: ['usuario', 'reserva', 'equipamiento'],
            });
            if (!boleta) {
                throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento obtenida exitosamente', boleta, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener la boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByReserva(idReserva) {
        try {
            const boletas = await this.boletaRepository.find({
                where: { reserva: { id_reserva: idReserva } },
                relations: ['equipamiento'],
            });
            return (0, api_response_util_1.CreateResponse)('Boletas de equipamiento por reserva obtenidas exitosamente', boletas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener boletas de equipamiento por reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateBoletaDto) {
        try {
            const boleta = await this.boletaRepository.findOne({
                where: { id_boleta: id },
                relations: ['equipamiento'],
            });
            if (!boleta) {
                throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
            }
            if (updateBoletaDto.cantidad && updateBoletaDto.cantidad !== boleta.cantidad) {
                const diferencia = updateBoletaDto.cantidad - boleta.cantidad;
                if (diferencia > 0) {
                    const equipamientoResponse = await this.equipamientoService.findOne(boleta.equipamiento.id_equipamiento);
                    const equipamiento = equipamientoResponse.data;
                    if (equipamiento && equipamiento.stock < diferencia) {
                        throw new Error(`Stock insuficiente para aumentar la cantidad de equipamiento`);
                    }
                }
                await this.equipamientoService.actualizarStock(boleta.equipamiento.id_equipamiento, -diferencia);
            }
            await this.boletaRepository.update(id, updateBoletaDto);
            const updatedBoleta = await this.boletaRepository.findOne({
                where: { id_boleta: id },
                relations: ['usuario', 'reserva', 'equipamiento'],
            });
            if (!updatedBoleta) {
                throw new Error(`Error al obtener boleta actualizada con ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento actualizada exitosamente', updatedBoleta, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar la boleta de equipamiento', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const boleta = await this.boletaRepository.findOne({
                where: { id_boleta: id },
                relations: ['equipamiento'],
            });
            if (!boleta) {
                throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
            }
            await this.equipamientoService.actualizarStock(boleta.equipamiento.id_equipamiento, boleta.cantidad);
            await this.boletaRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento eliminada exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar la boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BoletaEquipamientoService = BoletaEquipamientoService;
exports.BoletaEquipamientoService = BoletaEquipamientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(boleta_equipamiento_entity_1.BoletaEquipamiento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        equipamiento_service_1.EquipamientoService])
], BoletaEquipamientoService);
//# sourceMappingURL=boleta-equipamiento.service.js.map