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
exports.Equipamiento = void 0;
const typeorm_1 = require("typeorm");
const boleta_equipamiento_entity_1 = require("../../boleta-equipamiento/entities/boleta-equipamiento.entity");
let Equipamiento = class Equipamiento {
    id_equipamiento;
    tipo;
    costo;
    stock;
    boletas;
};
exports.Equipamiento = Equipamiento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Equipamiento.prototype, "id_equipamiento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Equipamiento.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Equipamiento.prototype, "costo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Equipamiento.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => boleta_equipamiento_entity_1.BoletaEquipamiento, boletaEquipamiento => boletaEquipamiento.equipamiento),
    __metadata("design:type", Array)
], Equipamiento.prototype, "boletas", void 0);
exports.Equipamiento = Equipamiento = __decorate([
    (0, typeorm_1.Entity)()
], Equipamiento);
//# sourceMappingURL=equipamiento.entity.js.map