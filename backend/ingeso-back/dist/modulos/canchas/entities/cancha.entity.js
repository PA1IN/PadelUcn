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
exports.Cancha = void 0;
const typeorm_1 = require("typeorm");
const reserva_entity_1 = require("../../reserva/entities/reserva.entity");
let Cancha = class Cancha {
    id;
    numero;
    nombre;
    descripcion;
    mantenimiento;
    valor;
    reservas;
};
exports.Cancha = Cancha;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_cancha' }),
    __metadata("design:type", Number)
], Cancha.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", Number)
], Cancha.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cancha.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cancha.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Cancha.prototype, "mantenimiento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Cancha.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserva_entity_1.Reserva, reserva => reserva.cancha),
    __metadata("design:type", Array)
], Cancha.prototype, "reservas", void 0);
exports.Cancha = Cancha = __decorate([
    (0, typeorm_1.Entity)({ name: 'cancha' })
], Cancha);
//# sourceMappingURL=cancha.entity.js.map