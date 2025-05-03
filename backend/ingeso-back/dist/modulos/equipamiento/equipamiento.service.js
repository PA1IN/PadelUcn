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
exports.EquipamientoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const equipamiento_entity_1 = require("./entities/equipamiento.entity");
const api_response_util_1 = require("../../utils/api-response.util");
let EquipamientoService = class EquipamientoService {
    equipamientoRepository;
    constructor(equipamientoRepository) {
        this.equipamientoRepository = equipamientoRepository;
    }
    async create(createEquipamientoDto) {
        try {
            const newEquipamiento = this.equipamientoRepository.create(createEquipamientoDto);
            const savedEquipamiento = await this.equipamientoRepository.save(newEquipamiento);
            return (0, api_response_util_1.CreateResponse)('Equipamiento creado exitosamente', savedEquipamiento, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear equipamiento', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const equipamientos = await this.equipamientoRepository.find();
            return (0, api_response_util_1.CreateResponse)('Equipamientos obtenidos exitosamente', equipamientos, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener equipamientos', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const equipamiento = await this.equipamientoRepository.findOne({
                where: { id_equipamiento: id },
                relations: ['boletas'],
            });
            if (!equipamiento) {
                throw new Error(`No se encontró un equipamiento con el ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Equipamiento obtenido exitosamente', equipamiento, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Equipamiento no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener el equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateEquipamientoDto) {
        try {
            const equipamiento = await this.equipamientoRepository.findOne({ where: { id_equipamiento: id } });
            if (!equipamiento) {
                throw new Error(`No se encontró un equipamiento con el ID ${id}`);
            }
            await this.equipamientoRepository.update(id, updateEquipamientoDto);
            const updatedEquipamiento = await this.equipamientoRepository.findOne({ where: { id_equipamiento: id } });
            if (!updatedEquipamiento) {
                throw new Error(`Error al obtener equipamiento actualizado con ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Equipamiento actualizado exitosamente', updatedEquipamiento, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Equipamiento no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar el equipamiento', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const equipamiento = await this.equipamientoRepository.findOne({ where: { id_equipamiento: id } });
            if (!equipamiento) {
                throw new Error(`No se encontró un equipamiento con el ID ${id}`);
            }
            await this.equipamientoRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Equipamiento eliminado exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Equipamiento no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar el equipamiento', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async actualizarStock(id, cantidad) {
        try {
            const equipamiento = await this.equipamientoRepository.findOne({ where: { id_equipamiento: id } });
            if (!equipamiento) {
                throw new Error(`No se encontró un equipamiento con el ID ${id}`);
            }
            if (equipamiento.stock < cantidad && cantidad < 0) {
                throw new Error(`Stock insuficiente para el equipamiento ${equipamiento.tipo}`);
            }
            equipamiento.stock += cantidad;
            await this.equipamientoRepository.save(equipamiento);
            return (0, api_response_util_1.CreateResponse)('Stock actualizado exitosamente', equipamiento, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Equipamiento no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('Stock insuficiente')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Stock insuficiente', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar el stock', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EquipamientoService = EquipamientoService;
exports.EquipamientoService = EquipamientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(equipamiento_entity_1.Equipamiento)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EquipamientoService);
//# sourceMappingURL=equipamiento.service.js.map