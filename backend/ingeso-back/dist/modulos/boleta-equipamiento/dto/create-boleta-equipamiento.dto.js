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
exports.CreateBoletaEquipamientoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBoletaEquipamientoDto {
    cantidad;
    reservaId;
    equipamientoId;
}
exports.CreateBoletaEquipamientoDto = CreateBoletaEquipamientoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La cantidad es requerida' }),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'La cantidad debe ser al menos 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBoletaEquipamientoDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de la reserva es requerido' }),
    (0, class_validator_1.IsInt)({ message: 'El ID de la reserva debe ser un número entero' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBoletaEquipamientoDto.prototype, "reservaId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del equipamiento es requerido' }),
    (0, class_validator_1.IsInt)({ message: 'El ID del equipamiento debe ser un número entero' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateBoletaEquipamientoDto.prototype, "equipamientoId", void 0);
//# sourceMappingURL=create-boleta-equipamiento.dto.js.map