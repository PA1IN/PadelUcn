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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reserva = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const cancha_entity_1 = require("../../canchas/entities/cancha.entity");
const boleta_equipamiento_entity_1 = require("../../boleta-equipamiento/entities/boleta-equipamiento.entity");
const historial_reserva_entity_1 = require("./historial-reserva.entity");
let Reserva = class Reserva {
    id;
    fecha;
    hora_inicio;
    hora_termino;
    usuario;
    idUsuario;
    cancha;
    idCancha;
    historial;
    boletas;
};
exports.Reserva = Reserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_reserva' }),
    __metadata("design:type", Number)
], Reserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Reserva.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Reserva.prototype, "hora_inicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Reserva.prototype, "hora_termino", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, usuario => usuario.reservas),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", user_entity_1.User)
], Reserva.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_usuario' }),
    __metadata("design:type", Number)
], Reserva.prototype, "idUsuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cancha_entity_1.Cancha, cancha => cancha.reservas),
    (0, typeorm_1.JoinColumn)({ name: 'id_cancha' }),
    __metadata("design:type", cancha_entity_1.Cancha)
], Reserva.prototype, "cancha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cancha' }),
    __metadata("design:type", Number)
], Reserva.prototype, "idCancha", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => historial_reserva_entity_1.HistorialReserva, historial => historial.reserva),
    __metadata("design:type", Array)
], Reserva.prototype, "historial", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => boleta_equipamiento_entity_1.BoletaEquipamiento, boleta => boleta.reserva),
    __metadata("design:type", Array)
], Reserva.prototype, "boletas", void 0);
exports.Reserva = Reserva = __decorate([
    (0, typeorm_1.Entity)({ name: 'reserva' })
], Reserva);
//# sourceMappingURL=reserva.entity.js.map