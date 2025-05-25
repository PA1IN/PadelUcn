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
exports.BoletaEquipamiento = void 0;
const typeorm_1 = require("typeorm");
const reserva_entity_1 = require("../../reserva/entities/reserva.entity");
const equipamiento_entity_1 = require("../../equipamiento/entities/equipamiento.entity");
let BoletaEquipamiento = class BoletaEquipamiento {
    id;
    cantidad;
    montoTotal;
    reserva;
    idReserva;
    equipamiento;
    idEquipamiento;
};
exports.BoletaEquipamiento = BoletaEquipamiento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_historial' }),
    __metadata("design:type", Number)
], BoletaEquipamiento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], BoletaEquipamiento.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'monto_total', nullable: false }),
    __metadata("design:type", Number)
], BoletaEquipamiento.prototype, "montoTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reserva_entity_1.Reserva, reserva => reserva.boletas),
    (0, typeorm_1.JoinColumn)({ name: 'id_reserva' }),
    __metadata("design:type", reserva_entity_1.Reserva)
], BoletaEquipamiento.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_reserva', nullable: false }),
    __metadata("design:type", Number)
], BoletaEquipamiento.prototype, "idReserva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => equipamiento_entity_1.Equipamiento, equipamiento => equipamiento.boletas),
    (0, typeorm_1.JoinColumn)({ name: 'id_equipamiento' }),
    __metadata("design:type", equipamiento_entity_1.Equipamiento)
], BoletaEquipamiento.prototype, "equipamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_equipamiento', nullable: false }),
    __metadata("design:type", Number)
], BoletaEquipamiento.prototype, "idEquipamiento", void 0);
exports.BoletaEquipamiento = BoletaEquipamiento = __decorate([
    (0, typeorm_1.Entity)({ name: 'boleta_equipamiento' })
], BoletaEquipamiento);
//# sourceMappingURL=boleta-equipamiento.entity.js.map