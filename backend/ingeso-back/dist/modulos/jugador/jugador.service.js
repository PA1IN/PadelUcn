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
exports.JugadorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jugador_entity_1 = require("./entities/jugador.entity");
const api_response_util_1 = require("../../utils/api-response.util");
const reserva_entity_1 = require("../reserva/entities/reserva.entity");
const cancha_entity_1 = require("../cancha/entities/cancha.entity");
let JugadorService = class JugadorService {
    jugadorRepository;
    reservaRepository;
    canchaRepository;
    constructor(jugadorRepository, reservaRepository, canchaRepository) {
        this.jugadorRepository = jugadorRepository;
        this.reservaRepository = reservaRepository;
        this.canchaRepository = canchaRepository;
    }
    async create(createJugadorDto) {
        try {
            const reserva = await this.reservaRepository.findOne({
                where: { id: createJugadorDto.id_reserva },
                relations: ['cancha', 'jugadores']
            });
            if (!reserva) {
                throw new common_1.NotFoundException(`Reserva con ID ${createJugadorDto.id_reserva} no encontrada`);
            }
            const cancha = await this.canchaRepository.findOne({
                where: { id: reserva.idCancha }
            });
            if (!cancha) {
                throw new common_1.NotFoundException(`Cancha con ID ${reserva.idCancha} no encontrada`);
            }
            const jugadoresActuales = await this.jugadorRepository.count({
                where: { idReserva: createJugadorDto.id_reserva }
            });
            if (jugadoresActuales >= cancha.cantidadMaxJugador) {
                throw new common_1.BadRequestException(`No se puede agregar más jugadores. La cancha tiene un máximo de ${cancha.cantidadMaxJugador} jugadores.`);
            }
            const nuevoJugador = this.jugadorRepository.create({
                nombre: createJugadorDto.nombre,
                apellido: createJugadorDto.apellido,
                rut: createJugadorDto.rut,
                edad: createJugadorDto.edad,
                idReserva: createJugadorDto.id_reserva
            });
            const jugadorGuardado = await this.jugadorRepository.save(nuevoJugador);
            return (0, api_response_util_1.CreateResponse)('Jugador creado exitosamente', jugadorGuardado, 'CREATED');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Error al crear jugador: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const jugadores = await this.jugadorRepository.find({
                relations: ['reserva']
            });
            return (0, api_response_util_1.CreateResponse)('Jugadores obtenidos exitosamente', jugadores, 'OK');
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error al obtener jugadores: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const jugador = await this.jugadorRepository.findOne({
                where: { id },
                relations: ['reserva']
            });
            if (!jugador) {
                throw new common_1.NotFoundException(`Jugador con ID ${id} no encontrado`);
            }
            return (0, api_response_util_1.CreateResponse)('Jugador obtenido exitosamente', jugador, 'OK');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Error al obtener jugador: ${error.message}`);
        }
    }
};
exports.JugadorService = JugadorService;
exports.JugadorService = JugadorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(jugador_entity_1.Jugador)),
    __param(1, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __param(2, (0, typeorm_1.InjectRepository)(cancha_entity_1.Cancha)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], JugadorService);
//# sourceMappingURL=jugador.service.js.map