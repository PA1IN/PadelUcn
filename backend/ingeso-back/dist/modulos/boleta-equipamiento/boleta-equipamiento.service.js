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
const reserva_service_1 = require("../reserva/reserva.service");
const equipamiento_service_1 = require("../equipamiento/equipamiento.service");
const user_service_1 = require("../user/user.service");
let BoletaEquipamientoService = class BoletaEquipamientoService {
    boletaRepository;
    reservaService;
    equipamientoService;
    userService;
    constructor(boletaRepository, reservaService, equipamientoService, userService) {
        this.boletaRepository = boletaRepository;
        this.reservaService = reservaService;
        this.equipamientoService = equipamientoService;
        this.userService = userService;
    }
    async create(createBoletaDto) {
        try {
            const reservaResponse = await this.reservaService.findOne(createBoletaDto.reservaId);
            if (!reservaResponse.data) {
                throw new Error(`No se encontró una reserva con el ID ${createBoletaDto.reservaId}`);
            }
            const reserva = reservaResponse.data;
            const equipamientoResponse = await this.equipamientoService.findOne(createBoletaDto.equipamientoId);
            if (!equipamientoResponse.data) {
                throw new Error(`No se encontró un equipamiento con el ID ${createBoletaDto.equipamientoId}`);
            }
            const equipamiento = equipamientoResponse.data;
            if (equipamiento.stock < createBoletaDto.cantidad) {
                throw new Error(`Stock insuficiente. Se solicitaron ${createBoletaDto.cantidad} unidades, pero solo hay ${equipamiento.stock} disponibles`);
            }
            const userResponse = await this.userService.findOne(reserva.usuario.rut);
            if (!userResponse.data) {
                throw new Error(`No se encontró un usuario con el RUT ${reserva.usuario.rut}`);
            }
            const user = userResponse.data;
            const montoTotal = equipamiento.costo * createBoletaDto.cantidad;
            if (user.saldo < montoTotal) {
                throw new Error(`Saldo insuficiente. El costo es de ${montoTotal} y el usuario tiene ${user.saldo}`);
            }
            const boleta = this.boletaRepository.create({
                ...createBoletaDto,
                montoTotal,
            });
            const savedBoleta = await this.boletaRepository.save(boleta);
            await this.equipamientoService.updateStock(equipamiento.id, -createBoletaDto.cantidad);
            await this.userService.update(user.rut, { saldo: user.saldo - montoTotal });
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento creada exitosamente', savedBoleta, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear boleta de equipamiento', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const boletas = await this.boletaRepository.find({
                relations: ['reserva', 'equipamiento', 'reserva.usuario'],
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
                where: { id },
                relations: ['reserva', 'equipamiento', 'reserva.usuario'],
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
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateBoletaDto) {
        try {
            const boletaResponse = await this.findOne(id);
            if (!boletaResponse.data) {
                throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
            }
            const boletaActual = boletaResponse.data;
            if (updateBoletaDto.cantidad && updateBoletaDto.cantidad !== boletaActual.cantidad) {
                const equipamientoResponse = await this.equipamientoService.findOne(boletaActual.equipamientoId);
                if (!equipamientoResponse.data) {
                    throw new Error(`No se encontró un equipamiento con el ID ${boletaActual.equipamientoId}`);
                }
                const equipamiento = equipamientoResponse.data;
                const diferencia = updateBoletaDto.cantidad - boletaActual.cantidad;
                if (diferencia > 0 && equipamiento.stock < diferencia) {
                    throw new Error(`Stock insuficiente. Se requieren ${diferencia} unidades adicionales, pero solo hay ${equipamiento.stock} disponibles`);
                }
                await this.equipamientoService.updateStock(equipamiento.id, -diferencia);
                const reservaResponse = await this.reservaService.findOne(boletaActual.reservaId);
                if (!reservaResponse.data) {
                    throw new Error(`No se encontró una reserva con el ID ${boletaActual.reservaId}`);
                }
                const user = reservaResponse.data.usuario;
                const montoActual = boletaActual.montoTotal;
                const montoNuevo = equipamiento.costo * updateBoletaDto.cantidad;
                const diferenciaMonto = montoNuevo - montoActual;
                if (diferenciaMonto > 0) {
                    const userResponse = await this.userService.findOne(user.rut);
                    if (!userResponse.data) {
                        throw new Error(`No se encontró un usuario con el RUT ${user.rut}`);
                    }
                    if (userResponse.data.saldo < diferenciaMonto) {
                        throw new Error(`Saldo insuficiente. El costo adicional es de ${diferenciaMonto} y el usuario tiene ${userResponse.data.saldo}`);
                    }
                    await this.userService.update(user.rut, { saldo: userResponse.data.saldo - diferenciaMonto });
                }
                else if (diferenciaMonto < 0) {
                    const userResponse = await this.userService.findOne(user.rut);
                    if (!userResponse.data) {
                        throw new Error(`No se encontró un usuario con el RUT ${user.rut}`);
                    }
                    await this.userService.update(user.rut, { saldo: userResponse.data.saldo - diferenciaMonto });
                }
                updateBoletaDto['montoTotal'] = montoNuevo;
            }
            await this.boletaRepository.update(id, updateBoletaDto);
            const updatedBoleta = await this.boletaRepository.findOne({
                where: { id },
                relations: ['reserva', 'equipamiento'],
            });
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento actualizada exitosamente', updatedBoleta, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar boleta de equipamiento', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const boletaResponse = await this.findOne(id);
            if (!boletaResponse.data) {
                throw new Error(`No se encontró una boleta de equipamiento con el ID ${id}`);
            }
            const boleta = boletaResponse.data;
            await this.equipamientoService.updateStock(boleta.equipamientoId, boleta.cantidad);
            const reservaResponse = await this.reservaService.findOne(boleta.reservaId);
            if (!reservaResponse.data) {
                throw new Error(`No se encontró una reserva con el ID ${boleta.reservaId}`);
            }
            const user = reservaResponse.data.usuario;
            const userResponse = await this.userService.findOne(user.rut);
            if (!userResponse.data) {
                throw new Error(`No se encontró un usuario con el RUT ${user.rut}`);
            }
            await this.userService.update(user.rut, { saldo: userResponse.data.saldo + boleta.montoTotal });
            await this.boletaRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Boleta de equipamiento eliminada exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Boleta de equipamiento no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar boleta de equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByReserva(reservaId) {
        try {
            const reservaResponse = await this.reservaService.findOne(reservaId);
            if (!reservaResponse.data) {
                throw new Error(`No se encontró una reserva con el ID ${reservaId}`);
            }
            const boletas = await this.boletaRepository.find({
                where: { reservaId },
                relations: ['equipamiento'],
            });
            return (0, api_response_util_1.CreateResponse)('Boletas de equipamiento por reserva obtenidas exitosamente', boletas, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener boletas de equipamiento por reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BoletaEquipamientoService = BoletaEquipamientoService;
exports.BoletaEquipamientoService = BoletaEquipamientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(boleta_equipamiento_entity_1.BoletaEquipamiento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        reserva_service_1.ReservaService,
        equipamiento_service_1.EquipamientoService,
        user_service_1.UserService])
], BoletaEquipamientoService);
//# sourceMappingURL=boleta-equipamiento.service.js.map