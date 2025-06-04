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
const cancha_entity_1 = require("../cancha/entities/cancha.entity");
const usuario_entity_1 = require("../usuario/entities/usuario.entity");
const reserva_entity_1 = require("./entities/reserva.entity");
const api_response_util_1 = require("../../utils/api-response.util");
const historial_reserva_service_1 = require("../historial-reserva/historial-reserva.service");
const boleta_equipamiento_entity_1 = require("../boleta-equipamiento/entities/boleta-equipamiento.entity");
const equipamiento_entity_1 = require("../equipamiento/entities/equipamiento.entity");
const jugador_entity_1 = require("../jugador/entities/jugador.entity");
let ReservaService = class ReservaService {
    boletaEquipamientoRepository;
    usuarioRepository;
    canchaRespository;
    reservaRepository;
    equipamientoRepository;
    jugadorRepository;
    historialReservaService;
    constructor(boletaEquipamientoRepository, usuarioRepository, canchaRespository, reservaRepository, equipamientoRepository, jugadorRepository, historialReservaService) {
        this.boletaEquipamientoRepository = boletaEquipamientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.canchaRespository = canchaRespository;
        this.reservaRepository = reservaRepository;
        this.equipamientoRepository = equipamientoRepository;
        this.jugadorRepository = jugadorRepository;
        this.historialReservaService = historialReservaService;
    }
    async create(createReservaDto, isAdmin = false) {
        try {
            const fecha = new Date(createReservaDto.fecha);
            const fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            const today = new Date();
            const dayOfWeek = fecha.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                throw new common_1.BadRequestException('Las reservas solo están disponibles de lunes a viernes');
            }
            if (!isAdmin) {
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(today.getDate() + 7);
                if (fecha < oneWeekFromNow) {
                    throw new common_1.BadRequestException('Las reservas deben hacerse con al menos 1 semana de anticipación');
                }
            }
            const horaInicio = createReservaDto.hora_inicio.split(':').map(Number);
            const horaTermino = createReservaDto.hora_termino.split(':').map(Number);
            const horaInicioNum = horaInicio[0] + horaInicio[1] / 60;
            const horaTerminoNum = horaTermino[0] + horaTermino[1] / 60;
            if (horaInicioNum < 8 || horaTerminoNum > 20) {
                throw new common_1.BadRequestException('El horario de reservas es de 08:00 a 20:00');
            }
            const duracionMinutos = (horaTerminoNum - horaInicioNum) * 60;
            if (duracionMinutos < 90 || duracionMinutos > 180) {
                throw new common_1.BadRequestException('La duración de la reserva debe ser entre 90 y 180 minutos');
            }
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
                throw new common_1.BadRequestException(`La cancha #${createReservaDto.numero_cancha} no está disponible en el horario solicitado`);
            }
            const usuario = await this.usuarioRepository.findOne({ where: { rut: createReservaDto.rut_usuario } });
            if (!usuario) {
                throw new common_1.BadRequestException(`Usuario con rut ${createReservaDto.rut_usuario} no encontrado`);
            }
            if (!isAdmin) {
                const reservasUsuarioDia = await this.reservaRepository.find({
                    where: {
                        usuario: { id: usuario.id },
                        fecha: fechaFormateada
                    }
                });
                let minutosReservadosHoy = 0;
                for (const reserva of reservasUsuarioDia) {
                    const inicio = reserva.hora_inicio.split(':').map(Number);
                    const fin = reserva.hora_termino.split(':').map(Number);
                    const minutos = ((fin[0] * 60 + fin[1]) - (inicio[0] * 60 + inicio[1]));
                    minutosReservadosHoy += minutos;
                }
                if (minutosReservadosHoy + duracionMinutos > 180) {
                    throw new common_1.BadRequestException(`No puede reservar más de 180 minutos por día (ya tiene ${minutosReservadosHoy} minutos reservados)`);
                }
            }
            const reservasConcurrentes = await this.reservaRepository
                .createQueryBuilder('reserva')
                .where('reserva.idUsuario = :idUsuario', { idUsuario: usuario.id })
                .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
                horaInicio: createReservaDto.hora_inicio,
                horaTermino: createReservaDto.hora_termino,
            })
                .getMany();
            if (reservasConcurrentes.length > 0) {
                throw new common_1.BadRequestException('Ya tiene una reserva en ese horario');
            }
            const cancha = await this.canchaRespository.findOne({ where: { numero: createReservaDto.numero_cancha } });
            if (!cancha) {
                throw new common_1.BadRequestException(`Cancha número ${createReservaDto.numero_cancha} no encontrada`);
            }
            const costoReserva = cancha.valor * (duracionMinutos / 60);
            if (!isAdmin && usuario.saldo < costoReserva) {
                throw new common_1.BadRequestException(`Saldo insuficiente para realizar la reserva. Saldo actual: $${usuario.saldo}, Costo: $${costoReserva}`);
            }
            const newReserva = this.reservaRepository.create({
                fecha: fechaFormateada,
                hora_inicio: createReservaDto.hora_inicio,
                hora_termino: createReservaDto.hora_termino,
                usuario,
                cancha,
            });
            const savedReserva = await this.reservaRepository.save(newReserva);
            if (!isAdmin) {
                usuario.saldo -= costoReserva;
                await this.usuarioRepository.save(usuario);
            }
            try {
                await this.historialReservaService.create({
                    estado: 'Pendiente',
                    idReserva: savedReserva.id,
                    idUsuario: usuario.id
                });
            }
            catch (historialError) {
                console.error('Error al crear historial de reserva:', historialError);
            }
            if (Array.isArray(createReservaDto.jugadores) && createReservaDto.jugadores.length > 0) {
                for (const jugadorDto of createReservaDto.jugadores) {
                    const nuevoJugador = this.jugadorRepository.create({
                        nombre: jugadorDto.nombre,
                        apellido: jugadorDto.apellido,
                        rut: jugadorDto.rut,
                        edad: jugadorDto.edad,
                        idReserva: savedReserva.id
                    });
                    await this.jugadorRepository.save(nuevoJugador);
                }
            }
            let costoTotalEquipamiento = 0;
            if (Array.isArray(createReservaDto.equipamiento) && createReservaDto.equipamiento.length > 0) {
                for (const item of createReservaDto.equipamiento) {
                    const equipamiento = await this.equipamientoRepository.findOne({
                        where: { id: item.id_equipamiento }
                    });
                    if (!equipamiento) {
                        throw new common_1.BadRequestException(`Equipamiento con ID ${item.id_equipamiento} no encontrado`);
                    }
                    if (equipamiento.stock < item.cantidad) {
                        throw new common_1.BadRequestException(`Stock insuficiente para el equipamiento ${equipamiento.nombre}. Disponible: ${equipamiento.stock}`);
                    }
                    const costoItem = equipamiento.costo * item.cantidad;
                    costoTotalEquipamiento += costoItem;
                    const nuevaBoleta = this.boletaEquipamientoRepository.create({
                        reserva: { id: savedReserva.id },
                        equipamiento: { id: item.id_equipamiento },
                        cantidad: item.cantidad,
                        montoTotal: costoItem,
                    });
                    await this.boletaEquipamientoRepository.save(nuevaBoleta);
                    equipamiento.stock -= item.cantidad;
                    await this.equipamientoRepository.save(equipamiento);
                }
                if (!isAdmin && usuario.saldo < costoTotalEquipamiento) {
                    await this.reservaRepository.delete(savedReserva.id);
                    throw new common_1.BadRequestException(`Saldo insuficiente para el equipamiento. Saldo actual: $${usuario.saldo}, Costo: $${costoTotalEquipamiento}`);
                }
                if (!isAdmin && costoTotalEquipamiento > 0) {
                    usuario.saldo -= costoTotalEquipamiento;
                    await this.usuarioRepository.save(usuario);
                }
            }
            const reservaCompleta = await this.reservaRepository.findOne({
                where: { id: savedReserva.id },
                relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'jugadores'],
            });
            if (!reservaCompleta) {
                throw new Error('Error al cargar la reserva completa');
            }
            return (0, api_response_util_1.CreateResponse)(`Reserva #${savedReserva.id} creada exitosamente para la cancha #${createReservaDto.numero_cancha}`, reservaCompleta, 'CREATED');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al crear la reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const reservas = await this.reservaRepository.find({
                relations: ['usuario', 'cancha', 'historial'],
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
                relations: ['usuario', 'boletas', 'historial'],
                order: { fecha: 'ASC', hora_inicio: 'ASC' },
            });
            return (0, api_response_util_1.CreateResponse)('Reservas de la cancha obtenidas exitosamente', reservas, 'OK');
        }
        catch (error) {
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al obtener las reservas de la cancha', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateReservaDto, isAdmin = false) {
        try {
            const reserva = await this.reservaRepository.findOne({
                where: { id },
                relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'jugadores'],
            });
            if (!reserva) {
                throw new common_1.BadRequestException(`No se encontró una reserva con el ID ${id}`);
            }
            const today = new Date();
            let fechaFormateada = reserva.fecha;
            let horaInicio = reserva.hora_inicio;
            let horaTermino = reserva.hora_termino;
            let numeroCancha = reserva.cancha.numero;
            if (updateReservaDto.fecha || updateReservaDto.hora_inicio || updateReservaDto.hora_termino || updateReservaDto.numero_cancha) {
                if (updateReservaDto.fecha) {
                    const fecha = new Date(updateReservaDto.fecha);
                    fechaFormateada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
                    const dayOfWeek = fecha.getDay();
                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                        throw new common_1.BadRequestException('Las reservas solo están disponibles de lunes a viernes');
                    }
                    if (!isAdmin) {
                        const oneWeekFromNow = new Date();
                        oneWeekFromNow.setDate(today.getDate() + 7);
                        if (fecha < oneWeekFromNow) {
                            throw new common_1.BadRequestException('Las reservas deben modificarse con al menos 1 semana de anticipación');
                        }
                    }
                }
                if (updateReservaDto.hora_inicio) {
                    horaInicio = updateReservaDto.hora_inicio;
                }
                if (updateReservaDto.hora_termino) {
                    horaTermino = updateReservaDto.hora_termino;
                }
                const horaInicioArr = horaInicio.split(':').map(Number);
                const horaTerminoArr = horaTermino.split(':').map(Number);
                const horaInicioNum = horaInicioArr[0] + horaInicioArr[1] / 60;
                const horaTerminoNum = horaTerminoArr[0] + horaTerminoArr[1] / 60;
                if (horaInicioNum < 8 || horaTerminoNum > 20) {
                    throw new common_1.BadRequestException('El horario de reservas es de 08:00 a 20:00');
                }
                const duracionMinutos = (horaTerminoNum - horaInicioNum) * 60;
                if (duracionMinutos < 90 || duracionMinutos > 180) {
                    throw new common_1.BadRequestException('La duración de la reserva debe ser entre 90 y 180 minutos');
                }
                if (updateReservaDto.numero_cancha) {
                    numeroCancha = updateReservaDto.numero_cancha;
                }
                const conflictos = await this.reservaRepository.createQueryBuilder('reserva')
                    .innerJoin('reserva.cancha', 'cancha')
                    .where('cancha.numero = :numeroCancha', { numeroCancha })
                    .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                    .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
                    horaInicio,
                    horaTermino,
                })
                    .andWhere('reserva.id != :id', { id })
                    .getMany();
                if (conflictos.length > 0) {
                    throw new common_1.BadRequestException(`La cancha #${numeroCancha} no está disponible en ese horario`);
                }
                if (!isAdmin) {
                    const reservasUsuarioDia = await this.reservaRepository
                        .createQueryBuilder('reserva')
                        .where('reserva.idUsuario = :idUsuario', { idUsuario: reserva.usuario.id })
                        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                        .andWhere('reserva.id != :id', { id })
                        .getMany();
                    let minutosReservadosHoy = 0;
                    for (const otraReserva of reservasUsuarioDia) {
                        const inicio = otraReserva.hora_inicio.split(':').map(Number);
                        const fin = otraReserva.hora_termino.split(':').map(Number);
                        const minutos = ((fin[0] * 60 + fin[1]) - (inicio[0] * 60 + inicio[1]));
                        minutosReservadosHoy += minutos;
                    }
                    const nuevaInicioArr = horaInicio.split(':').map(Number);
                    const nuevaFinArr = horaTermino.split(':').map(Number);
                    const nuevaDuracion = ((nuevaFinArr[0] * 60 + nuevaFinArr[1]) - (nuevaInicioArr[0] * 60 + nuevaInicioArr[1]));
                    if (minutosReservadosHoy + nuevaDuracion > 180) {
                        throw new common_1.BadRequestException(`No puede reservar más de 180 minutos por día (ya tiene ${minutosReservadosHoy} minutos reservados)`);
                    }
                }
                if (!isAdmin) {
                    const reservasConcurrentes = await this.reservaRepository
                        .createQueryBuilder('reserva')
                        .where('reserva.idUsuario = :idUsuario', { idUsuario: reserva.usuario.id })
                        .andWhere('reserva.id != :id', { id })
                        .andWhere('reserva.fecha = :fecha', { fecha: fechaFormateada })
                        .andWhere('(reserva.hora_inicio < :horaTermino AND reserva.hora_termino > :horaInicio)', {
                        horaInicio,
                        horaTermino,
                    })
                        .getMany();
                    if (reservasConcurrentes.length > 0) {
                        throw new common_1.BadRequestException('Ya tiene una reserva en ese horario');
                    }
                }
                if (updateReservaDto.numero_cancha) {
                    const nuevaCancha = await this.canchaRespository.findOne({
                        where: { numero: updateReservaDto.numero_cancha }
                    });
                    if (!nuevaCancha) {
                        throw new common_1.BadRequestException(`Cancha número ${updateReservaDto.numero_cancha} no encontrada`);
                    }
                    reserva.cancha = nuevaCancha;
                }
                if (updateReservaDto.fecha) {
                    reserva.fecha = fechaFormateada;
                }
                if (updateReservaDto.hora_inicio) {
                    reserva.hora_inicio = horaInicio;
                }
                if (updateReservaDto.hora_termino) {
                    reserva.hora_termino = horaTermino;
                }
                await this.reservaRepository.save(reserva);
                try {
                    await this.historialReservaService.create({
                        estado: 'Modificado',
                        idReserva: id,
                        idUsuario: reserva.usuario.id
                    });
                }
                catch (historialError) {
                    console.error('Error al crear historial de modificación:', historialError);
                }
            }
            if (Array.isArray(updateReservaDto.jugadores)) {
                await this.jugadorRepository.delete({ idReserva: id });
                for (const jugadorDto of updateReservaDto.jugadores) {
                    const nuevoJugador = this.jugadorRepository.create({
                        nombre: jugadorDto.nombre,
                        apellido: jugadorDto.apellido,
                        rut: jugadorDto.rut,
                        edad: jugadorDto.edad,
                        idReserva: id
                    });
                    await this.jugadorRepository.save(nuevoJugador);
                }
            }
            if (Array.isArray(updateReservaDto.equipamiento)) {
                const boletasActuales = await this.boletaEquipamientoRepository.find({
                    where: { idReserva: id },
                    relations: ['equipamiento']
                });
                for (const boleta of boletasActuales) {
                    const equipamiento = await this.equipamientoRepository.findOne({
                        where: { id: boleta.equipamiento.id }
                    });
                    if (equipamiento) {
                        equipamiento.stock += boleta.cantidad;
                        await this.equipamientoRepository.save(equipamiento);
                    }
                }
                await this.boletaEquipamientoRepository.delete({ idReserva: id });
                let costoTotalEquipamiento = 0;
                for (const item of updateReservaDto.equipamiento) {
                    const equipamiento = await this.equipamientoRepository.findOne({
                        where: { id: item.id_equipamiento }
                    });
                    if (!equipamiento) {
                        throw new common_1.BadRequestException(`Equipamiento con ID ${item.id_equipamiento} no encontrado`);
                    }
                    if (equipamiento.stock < item.cantidad) {
                        throw new common_1.BadRequestException(`Stock insuficiente para el equipamiento ${equipamiento.nombre}. Disponible: ${equipamiento.stock}`);
                    }
                    const costoItem = equipamiento.costo * item.cantidad;
                    costoTotalEquipamiento += costoItem;
                    const nuevaBoleta = this.boletaEquipamientoRepository.create({
                        idReserva: id,
                        equipamiento: { id: item.id_equipamiento },
                        cantidad: item.cantidad,
                        montoTotal: costoItem,
                    });
                    await this.boletaEquipamientoRepository.save(nuevaBoleta);
                    equipamiento.stock -= item.cantidad;
                    await this.equipamientoRepository.save(equipamiento);
                }
                if (!isAdmin && reserva.usuario.saldo < costoTotalEquipamiento) {
                    throw new common_1.BadRequestException(`Saldo insuficiente para el equipamiento. Saldo actual: $${reserva.usuario.saldo}, Costo: $${costoTotalEquipamiento}`);
                }
                if (!isAdmin && costoTotalEquipamiento > 0) {
                    reserva.usuario.saldo -= costoTotalEquipamiento;
                    await this.usuarioRepository.save(reserva.usuario);
                }
            }
            const reservaActualizada = await this.reservaRepository.findOne({
                where: { id },
                relations: ['usuario', 'cancha', 'boletas', 'boletas.equipamiento', 'jugadores'],
            });
            if (!reservaActualizada) {
                throw new Error('Error al cargar la reserva actualizada');
            }
            return (0, api_response_util_1.CreateResponse)('Reserva modificada exitosamente', reservaActualizada, 'OK');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al modificar la reserva', null, 'BAD_REQUEST', error.message), common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id, isAdmin = false) {
        try {
            const reserva = await this.reservaRepository.findOne({
                where: { id: id },
                relations: ['usuario', 'boletas', 'boletas.equipamiento'],
            });
            if (!reserva) {
                throw new common_1.BadRequestException(`No se encontró una reserva con el ID ${id}`);
            }
            if (!isAdmin) {
                const fechaReserva = new Date(reserva.fecha);
                const today = new Date();
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(today.getDate() + 7);
                if (fechaReserva < oneWeekFromNow) {
                    throw new common_1.BadRequestException('Las reservas deben cancelarse con al menos 1 semana de anticipación');
                }
            }
            if (reserva.boletas && reserva.boletas.length > 0) {
                for (const boleta of reserva.boletas) {
                    if (boleta.equipamiento) {
                        const equipamiento = await this.equipamientoRepository.findOne({
                            where: { id: boleta.equipamiento.id }
                        });
                        if (equipamiento) {
                            equipamiento.stock += boleta.cantidad;
                            await this.equipamientoRepository.save(equipamiento);
                        }
                    }
                }
            }
            try {
                await this.historialReservaService.create({
                    estado: 'Cancelado',
                    idReserva: id,
                    idUsuario: reserva.usuario.id
                });
            }
            catch (historialError) {
                console.error('Error al crear historial de cancelación:', historialError);
            }
            await this.reservaRepository.delete(id);
            return (0, api_response_util_1.CreateResponse)('Reserva cancelada exitosamente', null, 'OK');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error.message && error.message.includes('No se encontró')) {
                throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Reserva no encontrada', null, 'NOT_FOUND', error.message), common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException((0, api_response_util_1.CreateResponse)('Error al cancelar la reserva', null, 'INTERNAL_SERVER_ERROR', error.message), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    __param(0, (0, typeorm_1.InjectRepository)(boleta_equipamiento_entity_1.BoletaEquipamiento)),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(2, (0, typeorm_1.InjectRepository)(cancha_entity_1.Cancha)),
    __param(3, (0, typeorm_1.InjectRepository)(reserva_entity_1.Reserva)),
    __param(4, (0, typeorm_1.InjectRepository)(equipamiento_entity_1.Equipamiento)),
    __param(5, (0, typeorm_1.InjectRepository)(jugador_entity_1.Jugador)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        historial_reserva_service_1.HistorialReservaService])
], ReservaService);
//# sourceMappingURL=reserva.service.js.map