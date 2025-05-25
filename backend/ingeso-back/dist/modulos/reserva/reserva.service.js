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
            const fecha = new Date(createReservaDto.fecha);
            const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            const existingReservas = await this.reservaRepository
                .createQueryBuilder('reserva')
                .innerJoin('reserva.cancha', 'cancha')
                .where('cancha.numero = :numeroCancha', { numeroCancha: createReservaDto.numero_cancha })
                .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
                horaInicio: createReservaDto.hora_inicio,
                horaTermino: createReservaDto.hora_termino,
            })
                .getMany();
            if (existingReservas.length > 0) {
                throw new Error(`La cancha #${createReservaDto.numero_cancha} no está disponible en el horario solicitado`);
            }
            const newReserva = this.reservaRepository.create({
                ...createReservaDto,
                fecha: fechaFormateada,
            });
            const savedReserva = await this.reservaRepository.save(newReserva);
            const reservaCompleta = await this.reservaRepository.findOne({
                where: { id: savedReserva.id },
                relations: ['usuario', 'cancha'],
            });
            return (0, api_response_util_1.CreateResponse)(`Reserva #${savedReserva.id} creada exitosamente para la cancha #${createReservaDto.numero_cancha}`, reservaCompleta, 'CREATED');
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
                where: { id: id },
                relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'historial'],
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
    async findByUsuario(rutUsuario) {
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
    async findByCancha(numeroCancha) {
        try {
            const reservas = await this.reservaRepository.find({
                where: { cancha: { numero: numeroCancha } },
                relations: ['usuario', 'administrador', 'boletas'],
                order: { fecha: 'ASC', hora_inicio: 'ASC' },
            });
            return (0, api_response_util_1.CreateResponse)('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener las reservas de la cancha', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateReservaDto) {
        try {
            const reserva = await this.reservaRepository.findOne({
                where: { id: id },
                relations: ['usuario', 'cancha'],
            });
            if (!reserva) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            if (updateReservaDto.fecha || updateReservaDto.hora_inicio || updateReservaDto.hora_termino || updateReservaDto.numero_cancha) {
                const numeroCancha = updateReservaDto.numero_cancha || reserva.cancha.numero;
                const fechaStr = updateReservaDto.fecha || reserva.fecha.toISOString().split('T')[0];
                const fecha = new Date(fechaStr);
                const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
                const horaInicio = updateReservaDto.hora_inicio || reserva.hora_inicio;
                const horaTermino = updateReservaDto.hora_termino || reserva.hora_termino;
                const existingReservas = await this.reservaRepository
                    .createQueryBuilder('reserva')
                    .innerJoin('reserva.cancha', 'cancha')
                    .where('cancha.numero = :numeroCancha', { numeroCancha })
                    .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                    .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
                    horaInicio,
                    horaTermino,
                })
                    .andWhere('reserva.id != :id', { id })
                    .getMany();
                if (existingReservas.length > 0) {
                    throw new Error(`La cancha #${numeroCancha} no está disponible en el horario solicitado`);
                }
            }
            if (updateReservaDto.fecha) {
                const fecha = new Date(updateReservaDto.fecha);
                updateReservaDto.fecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            }
            await this.reservaRepository.update(id, updateReservaDto);
            const updatedReserva = await this.reservaRepository.findOne({
                where: { id: id },
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
            const reserva = await this.reservaRepository.findOne({
                where: { id: id },
                relations: ['boletas'],
            });
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
    async verificarDisponibilidad(numeroCancha, fechaStr, horaInicio, horaTermino) {
        try {
            const fecha = new Date(fechaStr);
            const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            const existingReservas = await this.reservaRepository
                .createQueryBuilder('reserva')
                .innerJoin('reserva.cancha', 'cancha')
                .where('cancha.numero = :numeroCancha', { numeroCancha })
                .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
                horaInicio,
                horaTermino,
            })
                .getMany();
            const disponible = existingReservas.length === 0;
            return (0, api_response_util_1.CreateResponse)(disponible
                ? `La cancha #${numeroCancha} está disponible en el horario solicitado`
                : `La cancha #${numeroCancha} no está disponible en el horario solicitado`, { disponible }, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al verificar disponibilidad', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async obtenerHorariosDisponibles(numeroCancha, fechaStr) {
        try {
            const fecha = new Date(fechaStr);
            const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            const reservas = await this.reservaRepository
                .createQueryBuilder('reserva')
                .innerJoin('reserva.cancha', 'cancha')
                .where('cancha.numero = :numeroCancha', { numeroCancha })
                .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                .orderBy('reserva.hora_inicio', 'ASC')
                .select(['reserva.hora_inicio', 'reserva.hora_termino'])
                .getMany();
            const horaApertura = '08:00:00';
            const horaCierre = '22:00:00';
            const horariosDisponibles = [];
            let horaActual = horaApertura;
            while (horaActual < horaCierre) {
                const [horas, minutos] = horaActual.split(':').map(Number);
                let horaFinNum = horas + 1;
                const horaFin = `${horaFinNum.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`;
                const ocupado = reservas.some(reserva => (horaActual < reserva.hora_termino && horaFin > reserva.hora_inicio));
                if (!ocupado && horaFin <= horaCierre) {
                    horariosDisponibles.push({
                        inicio: horaActual,
                        fin: horaFin
                    });
                }
                horaActual = horaFin;
            }
            return (0, api_response_util_1.CreateResponse)(`Horarios disponibles para la cancha #${numeroCancha} en la fecha ${fechaStr}`, { horariosDisponibles }, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener horarios disponibles', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async obtenerEstadisticas() {
        try {
            const totalReservas = await this.reservaRepository.count();
            const reservasPorCancha = await this.reservaRepository
                .createQueryBuilder('reserva')
                .innerJoin('reserva.cancha', 'cancha')
                .select('cancha.numero', 'numeroCancha')
                .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
                .groupBy('cancha.numero')
                .orderBy('totalReservas', 'DESC')
                .getRawMany();
            const usuariosConMasReservas = await this.reservaRepository
                .createQueryBuilder('reserva')
                .innerJoin('reserva.usuario', 'usuario')
                .select('usuario.rut', 'rutUsuario')
                .addSelect('usuario.nombre', 'nombreUsuario')
                .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
                .groupBy('usuario.rut, usuario.nombre')
                .orderBy('totalReservas', 'DESC')
                .limit(10)
                .getRawMany();
            const reservasPorDia = await this.reservaRepository
                .createQueryBuilder('reserva')
                .select("TO_CHAR(reserva.fecha, 'Day')", 'diaSemana')
                .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
                .groupBy("TO_CHAR(reserva.fecha, 'Day')")
                .orderBy('totalReservas', 'DESC')
                .getRawMany();
            const horasMasSolicitadas = await this.reservaRepository
                .createQueryBuilder('reserva')
                .select('reserva.hora_inicio', 'hora')
                .addSelect('COUNT(reserva.id_reserva)', 'totalReservas')
                .groupBy('reserva.hora_inicio')
                .orderBy('totalReservas', 'DESC')
                .limit(5)
                .getRawMany();
            const estadisticas = {
                totalReservas,
                reservasPorCancha,
                usuariosConMasReservas,
                reservasPorDia,
                horasMasSolicitadas
            };
            return (0, api_response_util_1.CreateResponse)('Estadísticas obtenidas exitosamente', estadisticas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener estadísticas', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOneByIdForCheckout(id) {
        try {
            const reserva = await this.reservaRepository.findOne({ where: { id: id } });
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
};
exports.ReservaService = ReservaService;
exports.ReservaService = ReservaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservaService);
//# sourceMappingURL=reserva.service.js.map