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
const historial_reserva_entity_1 = require("./entities/historial-reserva.entity");
const api_response_util_1 = require("../../utils/api-response.util");
const user_service_1 = require("../user/user.service");
const canchas_service_1 = require("../canchas/canchas.service");
let ReservaService = class ReservaService {
    reservaRepository;
    historialRepository;
    userService;
    canchasService;
    constructor(reservaRepository, historialRepository, userService, canchasService) {
        this.reservaRepository = reservaRepository;
        this.historialRepository = historialRepository;
        this.userService = userService;
        this.canchasService = canchasService;
    }
    async create(createReservaDto, usuarioId) {
        try {
            const canchaResponse = await this.canchasService.findOne(createReservaDto.canchaId);
            if (!canchaResponse.data) {
                throw new Error(`La cancha con ID ${createReservaDto.canchaId} no existe`);
            }
            const cancha = canchaResponse.data;
            if (cancha.mantenimiento) {
                throw new Error(`La cancha ${cancha.id} está en mantenimiento y no está disponible para reservas`);
            }
            if (!createReservaDto.rutUsuario) {
                throw new Error('El RUT del usuario es requerido');
            }
            const userResponse = await this.userService.findOne(createReservaDto.rutUsuario);
            if (!userResponse.data) {
                throw new Error(`El usuario con RUT ${createReservaDto.rutUsuario} no existe`);
            }
            const user = userResponse.data;
            const disponible = await this.verificarDisponibilidad(createReservaDto.canchaId, createReservaDto.fecha, createReservaDto.horaInicio, createReservaDto.horaTermino);
            if (!disponible.data) {
                throw new Error('La cancha no está disponible en el horario seleccionado');
            }
            const costo = cancha.valor;
            if (user.saldo < costo) {
                throw new Error(`Saldo insuficiente. La reserva cuesta ${costo} y el usuario tiene ${user.saldo}`);
            }
            await this.userService.update(user.rut, { saldo: user.saldo - costo });
            const reserva = this.reservaRepository.create({
                fecha: new Date(createReservaDto.fecha),
                horaInicio: createReservaDto.horaInicio,
                horaTermino: createReservaDto.horaTermino,
                canchaId: createReservaDto.canchaId,
                usuarioId: user.id,
            });
            const savedReserva = await this.reservaRepository.save(reserva);
            const historial = this.historialRepository.create({
                estado: 'Pendiente',
                reservaId: savedReserva.id,
                usuarioId: user.id,
            });
            await this.historialRepository.save(historial);
            return (0, api_response_util_1.CreateResponse)('Reserva creada exitosamente', savedReserva, 'CREATED');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const reservas = await this.reservaRepository.find({
                relations: ['usuario', 'cancha'],
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
                where: { id },
                relations: ['usuario', 'cancha'],
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
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateReservaDto, usuarioId) {
        try {
            const reservaResponse = await this.findOne(id);
            if (!reservaResponse.data) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            const reservaExistente = reservaResponse.data;
            if (updateReservaDto.canchaId ||
                updateReservaDto.fecha ||
                updateReservaDto.horaInicio ||
                updateReservaDto.horaTermino) {
                const canchaId = updateReservaDto.canchaId || reservaExistente.canchaId;
                const fecha = updateReservaDto.fecha ||
                    (reservaExistente.fecha instanceof Date ?
                        reservaExistente.fecha.toISOString().split('T')[0] :
                        String(reservaExistente.fecha));
                const horaInicio = updateReservaDto.horaInicio || reservaExistente.horaInicio;
                const horaTermino = updateReservaDto.horaTermino || reservaExistente.horaTermino;
                const disponible = await this.verificarDisponibilidad(canchaId, fecha, horaInicio, horaTermino, id);
                if (!disponible.data) {
                    throw new Error('La cancha no está disponible en el horario seleccionado');
                }
            }
            await this.reservaRepository.update(id, updateReservaDto);
            const updatedReserva = await this.reservaRepository.findOne({
                where: { id },
                relations: ['usuario', 'cancha'],
            });
            const historial = this.historialRepository.create({
                estado: 'Modificado',
                reservaId: id,
                usuarioId: usuarioId,
            });
            await this.historialRepository.save(historial);
            return (0, api_response_util_1.CreateResponse)('Reserva actualizada exitosamente', updatedReserva, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al actualizar reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async cancelar(id, usuarioId) {
        try {
            const reservaResponse = await this.findOne(id);
            if (!reservaResponse.data) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            const reserva = reservaResponse.data;
            const fechaActual = new Date();
            const fechaReserva = new Date(reserva.fecha);
            let horaInicioStr = '';
            let horas = 0;
            let minutos = 0;
            if (typeof reserva.horaInicio === 'string') {
                horaInicioStr = reserva.horaInicio;
                const horasParts = horaInicioStr.split(':');
                if (horasParts && horasParts.length >= 2) {
                    horas = parseInt(horasParts[0], 10);
                    minutos = parseInt(horasParts[1], 10);
                }
            }
            else if (reserva.horaInicio instanceof Date) {
                horas = reserva.horaInicio.getHours();
                minutos = reserva.horaInicio.getMinutes();
                horaInicioStr = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`;
            }
            fechaReserva.setHours(horas, minutos);
            if (fechaReserva < fechaActual) {
                throw new Error('No se puede cancelar una reserva que ya pasó');
            }
            const canchaResponse = await this.canchasService.findOne(reserva.canchaId);
            const cancha = canchaResponse.data;
            let userResponse;
            if (reserva.usuario && reserva.usuario.rut) {
                userResponse = await this.userService.findByRut(reserva.usuario.rut);
            }
            const MS_POR_DIA = 24 * 60 * 60 * 1000;
            const valorCancha = cancha ? cancha.valor : 0;
            const reembolso = fechaReserva.getTime() - fechaActual.getTime() > MS_POR_DIA
                ? valorCancha * 0.8
                : valorCancha * 0.5;
            if (userResponse) {
                if ('data' in userResponse && userResponse.data) {
                    await this.userService.update(userResponse.data.rut, {
                        saldo: userResponse.data.saldo + Math.floor(reembolso)
                    });
                }
                else if ('rut' in userResponse) {
                    await this.userService.update(userResponse.rut, {
                        saldo: userResponse.saldo + Math.floor(reembolso)
                    });
                }
            }
            else if (reserva.usuario && reserva.usuario.rut) {
                await this.userService.update(reserva.usuario.rut, {
                    saldo: (reserva.usuario.saldo || 0) + Math.floor(reembolso)
                });
            }
            const historial = this.historialRepository.create({
                estado: 'Cancelado',
                reservaId: id,
                usuarioId: usuarioId,
            });
            await this.historialRepository.save(historial);
            await this.reservaRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Reserva cancelada exitosamente', null, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al cancelar reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findByUsuario(rut) {
        try {
            const userResponse = await this.userService.findOne(rut);
            if (!userResponse.data) {
                throw new Error(`No se encontró un usuario con el RUT ${rut}`);
            }
            const user = userResponse.data;
            const reservas = await this.reservaRepository.find({
                where: { usuarioId: user.id },
                relations: ['cancha'],
            });
            return (0, api_response_util_1.CreateResponse)('Reservas del usuario obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Usuario no encontrado', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener reservas del usuario', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByCancha(id) {
        try {
            const canchaResponse = await this.canchasService.findOne(id);
            if (!canchaResponse.data) {
                throw new Error(`No se encontró una cancha con el ID ${id}`);
            }
            const reservas = await this.reservaRepository.find({
                where: { canchaId: id },
                relations: ['usuario'],
            });
            return (0, api_response_util_1.CreateResponse)('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Cancha no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener reservas de la cancha', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verificarDisponibilidad(canchaId, fecha, horaInicio, horaTermino, reservaIdExcluir) {
        try {
            const canchaResponse = await this.canchasService.findOne(canchaId);
            if (!canchaResponse.data) {
                throw new Error(`La cancha con ID ${canchaId} no existe`);
            }
            if (canchaResponse.data.mantenimiento) {
                return (0, api_response_util_1.CreateResponse)('Cancha en mantenimiento', false, 'OK');
            }
            let query = this.reservaRepository.createQueryBuilder('reserva')
                .where('reserva.fecha = :fecha', { fecha })
                .andWhere('reserva.canchaId = :canchaId', { canchaId });
            if (reservaIdExcluir) {
                query = query.andWhere('reserva.id != :reservaId', { reservaId: reservaIdExcluir });
            }
            const reservasExistentes = await query.getMany();
            for (const reserva of reservasExistentes) {
                let horaInicioStr;
                if (typeof reserva.horaInicio === 'string') {
                    horaInicioStr = reserva.horaInicio;
                }
                else if (reserva.horaInicio instanceof Date) {
                    horaInicioStr = reserva.horaInicio.toTimeString().split(' ')[0];
                }
                else {
                    horaInicioStr = '00:00:00';
                }
                let horaTerminoStr;
                if (typeof reserva.horaTermino === 'string') {
                    horaTerminoStr = reserva.horaTermino;
                }
                else if (reserva.horaTermino instanceof Date) {
                    horaTerminoStr = reserva.horaTermino.toTimeString().split(' ')[0];
                }
                else {
                    horaTerminoStr = '00:00:00';
                }
                let horaInicioNuevoStr;
                if (typeof horaInicio === 'string') {
                    horaInicioNuevoStr = horaInicio;
                }
                else if (horaInicio instanceof Date) {
                    horaInicioNuevoStr = horaInicio.toTimeString().split(' ')[0];
                }
                else {
                    horaInicioNuevoStr = '00:00:00';
                }
                let horaTerminoNuevoStr;
                if (typeof horaTermino === 'string') {
                    horaTerminoNuevoStr = horaTermino;
                }
                else if (horaTermino instanceof Date) {
                    horaTerminoNuevoStr = horaTermino.toTimeString().split(' ')[0];
                }
                else {
                    horaTerminoNuevoStr = '00:00:00';
                }
                const inicioExistente = new Date(`${fecha}T${horaInicioStr}`);
                const terminoExistente = new Date(`${fecha}T${horaTerminoStr}`);
                const inicioNuevo = new Date(`${fecha}T${horaInicioNuevoStr}`);
                const terminoNuevo = new Date(`${fecha}T${horaTerminoNuevoStr}`);
                if ((inicioNuevo < terminoExistente && inicioExistente < terminoNuevo) ||
                    (inicioExistente < terminoNuevo && inicioNuevo < terminoExistente)) {
                    return (0, api_response_util_1.CreateResponse)('Horario no disponible', false, 'OK');
                }
            }
            return (0, api_response_util_1.CreateResponse)('Horario disponible', true, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al verificar disponibilidad', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerHorariosDisponibles(canchaId, fecha) {
        try {
            const canchaResponse = await this.canchasService.findOne(canchaId);
            if (!canchaResponse.data) {
                throw new Error(`La cancha con ID ${canchaId} no existe`);
            }
            if (canchaResponse.data.mantenimiento) {
                return (0, api_response_util_1.CreateResponse)('Cancha en mantenimiento', { disponibles: [] }, 'OK');
            }
            const reservasExistentes = await this.reservaRepository.find({
                where: {
                    fecha: new Date(fecha),
                    canchaId,
                },
            });
            const horariosDisponibles = [];
            const horaInicio = 8;
            const horaFin = 22;
            for (let hora = horaInicio; hora < horaFin; hora++) {
                const inicioBloque = `${hora.toString().padStart(2, '0')}:00:00`;
                const finBloque = `${(hora + 1).toString().padStart(2, '0')}:00:00`;
                let bloqueDisponible = true;
                for (const reserva of reservasExistentes) {
                    let inicioExistenteStr;
                    if (typeof reserva.horaInicio === 'string') {
                        inicioExistenteStr = reserva.horaInicio;
                    }
                    else if (reserva.horaInicio instanceof Date) {
                        inicioExistenteStr = reserva.horaInicio.toTimeString().split(' ')[0];
                    }
                    else {
                        inicioExistenteStr = '00:00:00';
                    }
                    let terminoExistenteStr;
                    if (typeof reserva.horaTermino === 'string') {
                        terminoExistenteStr = reserva.horaTermino;
                    }
                    else if (reserva.horaTermino instanceof Date) {
                        terminoExistenteStr = reserva.horaTermino.toTimeString().split(' ')[0];
                    }
                    else {
                        terminoExistenteStr = '00:00:00';
                    }
                    const inicioExistente = new Date(`${fecha}T${inicioExistenteStr}`);
                    const terminoExistente = new Date(`${fecha}T${terminoExistenteStr}`);
                    const inicioBloqueDate = new Date(`${fecha}T${inicioBloque}`);
                    const finBloqueDate = new Date(`${fecha}T${finBloque}`);
                    if ((inicioBloqueDate < terminoExistente && inicioExistente < finBloqueDate) ||
                        (inicioExistente < finBloqueDate && inicioBloqueDate < terminoExistente)) {
                        bloqueDisponible = false;
                        break;
                    }
                }
                if (bloqueDisponible) {
                    horariosDisponibles.push({
                        horaInicio: inicioBloque,
                        horaTermino: finBloque,
                    });
                }
            }
            return (0, api_response_util_1.CreateResponse)('Horarios disponibles obtenidos exitosamente', { disponibles: horariosDisponibles }, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener horarios disponibles', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerEstadisticas() {
        try {
            const reservas = await this.reservaRepository.find({
                relations: ['cancha', 'usuario'],
            });
            const estadisticas = {
                totalReservas: reservas.length,
                reservasPorCancha: {},
                reservasPorUsuario: {},
                ingresosTotales: 0,
            };
            reservas.forEach(reserva => {
                if (!reserva.cancha || !reserva.usuario)
                    return;
                const canchaId = String(reserva.cancha.id);
                const usuarioRut = reserva.usuario.rut;
                if (!estadisticas.reservasPorCancha[canchaId]) {
                    estadisticas.reservasPorCancha[canchaId] = {
                        nombreCancha: reserva.cancha.nombre,
                        total: 0,
                        ingresos: 0,
                    };
                }
                estadisticas.reservasPorCancha[canchaId].total++;
                estadisticas.reservasPorCancha[canchaId].ingresos += reserva.cancha.valor;
                if (!estadisticas.reservasPorUsuario[usuarioRut]) {
                    estadisticas.reservasPorUsuario[usuarioRut] = {
                        nombreUsuario: reserva.usuario.nombre,
                        total: 0,
                        gastos: 0,
                    };
                }
                estadisticas.reservasPorUsuario[usuarioRut].total++;
                estadisticas.reservasPorUsuario[usuarioRut].gastos += reserva.cancha.valor;
                estadisticas.ingresosTotales += reserva.cancha.valor;
            });
            return (0, api_response_util_1.CreateResponse)('Estadísticas obtenidas exitosamente', estadisticas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener estadísticas', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerHistorial(id) {
        try {
            const reservaResponse = await this.findOne(id);
            if (!reservaResponse.data) {
                throw new Error(`No se encontró una reserva con el ID ${id}`);
            }
            const historial = await this.historialRepository.find({
                where: { reservaId: id },
                relations: ['usuario'],
                order: { fechaEstado: 'DESC' },
            });
            return (0, api_response_util_1.CreateResponse)('Historial de reserva obtenido exitosamente', historial, 'OK');
        }
        catch (error) {
            if (error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener historial de reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ReservaService = ReservaService;
exports.ReservaService = ReservaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __param(1, (0, typeorm_1.InjectRepository)(historial_reserva_entity_1.HistorialReserva)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        canchas_service_1.CanchasService])
], ReservaService);
//# sourceMappingURL=reserva.service.js.map