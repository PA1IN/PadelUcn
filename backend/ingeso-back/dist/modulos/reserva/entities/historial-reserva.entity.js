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
exports.HistorialReserva = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const reserva_entity_1 = require("./reserva.entity");
let HistorialReserva = class HistorialReserva {
    id;
    estado;
    fechaEstado;
    reserva;
    idReserva;
    usuario;
    idUsuario;
};
exports.HistorialReserva = HistorialReserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_historial' }),
    __metadata("design:type", Number)
], HistorialReserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estado',
        type: 'varchar',
        nullable: false
    }),
    __metadata("design:type", String)
], HistorialReserva.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_estado', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], HistorialReserva.prototype, "fechaEstado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reserva_entity_1.Reserva, reserva => reserva.historial),
    (0, typeorm_1.JoinColumn)({ name: 'id_reserva' }),
    __metadata("design:type", reserva_entity_1.Reserva)
], HistorialReserva.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_reserva' }),
    __metadata("design:type", Number)
], HistorialReserva.prototype, "idReserva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, usuario => usuario.historialReservas),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", user_entity_1.User)
], HistorialReserva.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_usuario' }),
    __metadata("design:type", Number)
], HistorialReserva.prototype, "idUsuario", void 0);
exports.HistorialReserva = HistorialReserva = __decorate([
    (0, typeorm_1.Entity)({ name: 'historial_reserva' })
], HistorialReserva);
//# sourceMappingURL=historial-reserva.entity.js.map