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
exports.BloqueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bloque_entity_1 = require("./entities/bloque.entity");
const api_response_util_1 = require("../../utils/api-response.util");
let BloqueService = class BloqueService {
    bloqueRepository;
    constructor(bloqueRepository) {
        this.bloqueRepository = bloqueRepository;
        this.inicializarBloquesDefault();
    }
    async inicializarBloquesDefault() {
        const count = await this.bloqueRepository.count();
        if (count === 0) {
            const bloquesDefault = [];
            for (let hora = 8; hora < 20; hora++) {
                const horaInicio = `${hora.toString().padStart(2, '0')}:00:00`;
                const horaTermino = `${(hora + 1).toString().padStart(2, '0')}:00:00`;
                const bloque = new bloque_entity_1.Bloque();
                bloque.hora_inicio = horaInicio;
                bloque.hora_termino = horaTermino;
                bloque.activo = true;
                bloque.dias = 'Lunes a Viernes';
                bloquesDefault.push(bloque);
            }
            await this.bloqueRepository.save(bloquesDefault);
        }
    }
    async create(createBloqueDto) {
        try {
            const bloque = this.bloqueRepository.create(createBloqueDto);
            const savedBloque = await this.bloqueRepository.save(bloque);
            return (0, api_response_util_1.CreateResponse)('Bloque horario creado exitosamente', savedBloque, 'CREATED');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al crear el bloque horario', null, 'BAD_REQUEST', error.message, false);
        }
    }
    async findAll() {
        try {
            const bloques = await this.bloqueRepository.find({
                order: { hora_inicio: 'ASC' }
            });
            return (0, api_response_util_1.CreateResponse)('Bloques horarios obtenidos exitosamente', bloques, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener los bloques horarios', null, 'INTERNAL_SERVER_ERROR', error.message, false);
        }
    }
    async findOne(id) {
        try {
            const bloque = await this.bloqueRepository.findOne({ where: { id } });
            if (!bloque) {
                throw new common_1.NotFoundException(`No se encontró el bloque horario con ID ${id}`);
            }
            return (0, api_response_util_1.CreateResponse)('Bloque horario obtenido exitosamente', bloque, 'OK');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return (0, api_response_util_1.CreateResponse)('Bloque horario no encontrado', null, 'NOT_FOUND', error.message, false);
            }
            return (0, api_response_util_1.CreateResponse)('Error al obtener el bloque horario', null, 'INTERNAL_SERVER_ERROR', error.message, false);
        }
    }
    async update(id, updateBloqueDto) {
        try {
            const bloque = await this.bloqueRepository.findOne({ where: { id } });
            if (!bloque) {
                throw new common_1.NotFoundException(`No se encontró el bloque horario con ID ${id}`);
            }
            await this.bloqueRepository.update(id, updateBloqueDto);
            const updatedBloque = await this.bloqueRepository.findOne({ where: { id } });
            return (0, api_response_util_1.CreateResponse)('Bloque horario actualizado exitosamente', updatedBloque, 'OK');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return (0, api_response_util_1.CreateResponse)('Bloque horario no encontrado', null, 'NOT_FOUND', error.message, false);
            }
            return (0, api_response_util_1.CreateResponse)('Error al actualizar el bloque horario', null, 'INTERNAL_SERVER_ERROR', error.message, false);
        }
    }
    async remove(id) {
        try {
            const bloque = await this.bloqueRepository.findOne({ where: { id } });
            if (!bloque) {
                throw new common_1.NotFoundException(`No se encontró el bloque horario con ID ${id}`);
            }
            await this.bloqueRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Bloque horario eliminado exitosamente', null, 'OK');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return (0, api_response_util_1.CreateResponse)('Bloque horario no encontrado', null, 'NOT_FOUND', error.message, false);
            }
            return (0, api_response_util_1.CreateResponse)('Error al eliminar el bloque horario', null, 'INTERNAL_SERVER_ERROR', error.message, false);
        }
    }
    async findActivos() {
        try {
            const bloquesActivos = await this.bloqueRepository.find({
                where: { activo: true },
                order: { hora_inicio: 'ASC' }
            });
            return (0, api_response_util_1.CreateResponse)('Bloques horarios activos obtenidos exitosamente', bloquesActivos, 'OK');
        }
        catch (error) {
            return (0, api_response_util_1.CreateResponse)('Error al obtener los bloques horarios activos', null, 'INTERNAL_SERVER_ERROR', error.message, false);
        }
    }
};
exports.BloqueService = BloqueService;
exports.BloqueService = BloqueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bloque_entity_1.Bloque)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BloqueService);
//# sourceMappingURL=bloque.service.js.map