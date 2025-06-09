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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const reserva_entity_1 = require("../../reserva/entities/reserva.entity");
const historial_reserva_entity_1 = require("../../historial-reserva/entities/historial-reserva.entity");
let Usuario = class Usuario {
    id;
    rut;
    nombre;
    correo;
    password;
    telefono;
    saldo;
    isAdmin;
    reservas;
    historiales;
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_usuario' }),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "rut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_usuario' }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usuario.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contraseña' }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Usuario.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_admin', default: false }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserva_entity_1.Reserva, (reserva) => reserva.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "reservas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => historial_reserva_entity_1.HistorialReserva, (historial) => historial.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "historiales", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('usuario')
], Usuario);
//# sourceMappingURL=usuario.entity.js.map