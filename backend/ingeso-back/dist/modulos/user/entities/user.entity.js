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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const reserva_entity_1 = require("../../reserva/entities/reserva.entity");
const boleta_equipamiento_entity_1 = require("../../boleta-equipamiento/entities/boleta-equipamiento.entity");
let User = class User {
    rut;
    password;
    nombre;
    correo;
    reservas;
    boletas;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], User.prototype, "rut", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserva_entity_1.Reserva, reserva => reserva.usuario),
    __metadata("design:type", Array)
], User.prototype, "reservas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => boleta_equipamiento_entity_1.BoletaEquipamiento, boleta => boleta.usuario),
    __metadata("design:type", Array)
], User.prototype, "boletas", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map