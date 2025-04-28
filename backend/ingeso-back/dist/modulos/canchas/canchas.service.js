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
exports.CanchasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cancha_entity_1 = require("./entities/cancha.entity");
const api_response_util_1 = require("../../utils/api-response.util");
let CanchasService = class CanchasService {
    canchaRepository;
    constructor(canchaRepository) {
        this.canchaRepository = canchaRepository;
    }
    async create(createCanchaDto) {
        try {
            const existingCancha = await this.canchaRepository.findOne({
                where: { numero: createCanchaDto.numero }
            });
            if (existingCancha) {
                throw new Error(`Ya existe una cancha con el número ${createCanchaDto.numero}`);
            }
            const newCancha = this.canchaRepository.create(createCanchaDto);
            const savedCancha = await this.canchaRepository.save(newCancha);
            return (0, api_response_util_1.CreateResponse)('Cancha creada exitosamente', savedCancha, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear la cancha', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const canchas = await this.canchaRepository.find();
            return (0, api_response_util_1.CreateResponse)('Canchas obtenidas exitosamente', canchas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener las canchas', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(numero) {
        try {
            const cancha = await this.canchaRepository.findOne({ where: { numero } });
            if (!cancha) {
                throw new Error(`No se encontró una cancha con el número ${numero}`);
            }
            return (0, api_response_util_1.CreateResponse)('Cancha obtenida exitosamente', cancha, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Cancha no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener la cancha', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(numero, updateCanchaDto) {
        try {
            const cancha = await this.canchaRepository.findOne({ where: { numero } });
            if (!cancha) {
                throw new Error(`No se encontró una cancha con el número ${numero}`);
            }
            const updatedCancha = this.canchaRepository.merge(cancha, updateCanchaDto);
            const result = await this.canchaRepository.save(updatedCancha);
            return (0, api_response_util_1.CreateResponse)('Cancha actualizada exitosamente', result, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Cancha no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar la cancha', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(numero) {
        try {
            const cancha = await this.canchaRepository.findOne({ where: { numero } });
            if (!cancha) {
                throw new Error(`No se encontró una cancha con el número ${numero}`);
            }
            await this.canchaRepository.remove(cancha);
            return (0, api_response_util_1.CreateResponse)('Cancha eliminada exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Cancha no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al eliminar la cancha', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CanchasService = CanchasService;
exports.CanchasService = CanchasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cancha_entity_1.Cancha)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CanchasService);
//# sourceMappingURL=canchas.service.js.map