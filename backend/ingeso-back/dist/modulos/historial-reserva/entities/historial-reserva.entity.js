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
const reserva_entity_1 = require("../../reserva/entities/reserva.entity");
const usuario_entity_1 = require("../../usuario/entities/usuario.entity");
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
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistorialReserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistorialReserva.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], HistorialReserva.prototype, "fechaEstado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reserva_entity_1.Reserva, (reserva) => reserva.historiales),
    (0, typeorm_1.JoinColumn)({ name: 'idReserva' }),
    __metadata("design:type", reserva_entity_1.Reserva)
], HistorialReserva.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], HistorialReserva.prototype, "idReserva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (usuario) => usuario.historiales),
    (0, typeorm_1.JoinColumn)({ name: 'idUsuario' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], HistorialReserva.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], HistorialReserva.prototype, "idUsuario", void 0);
exports.HistorialReserva = HistorialReserva = __decorate([
    (0, typeorm_1.Entity)()
], HistorialReserva);
//# sourceMappingURL=historial-reserva.entity.js.map