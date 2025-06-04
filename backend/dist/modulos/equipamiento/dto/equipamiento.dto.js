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
exports.UpdateEquipamientoDto = exports.CreateEquipamientoDto = void 0;
const class_validator_1 = require("class-validator");
class CreateEquipamientoDto {
    tipo;
    nombre;
    stock;
    costo;
}
exports.CreateEquipamientoDto = CreateEquipamientoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El tipo debe ser una cadena de texto' }),
    (0, class_validator_1.IsIn)(['raqueta', 'pelota', 'zapatillas', 'muñequera', 'vincha', 'toalla'], {
        message: 'El tipo debe ser: raqueta, pelota, zapatillas, muñequera, vincha o toalla'
    }),
    __metadata("design:type", String)
], CreateEquipamientoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], CreateEquipamientoDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El stock es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El stock debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser negativo' }),
    (0, class_validator_1.Max)(1000, { message: 'El stock máximo es 1000' }),
    __metadata("design:type", Number)
], CreateEquipamientoDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El costo es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El costo debe ser un número' }),
    (0, class_validator_1.Min)(100, { message: 'El costo mínimo es $100' }),
    (0, class_validator_1.Max)(50000, { message: 'El costo máximo es $50.000' }),
    __metadata("design:type", Number)
], CreateEquipamientoDto.prototype, "costo", void 0);
class UpdateEquipamientoDto {
    tipo;
    nombre;
    stock;
    costo;
}
exports.UpdateEquipamientoDto = UpdateEquipamientoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El tipo debe ser una cadena de texto' }),
    (0, class_validator_1.IsIn)(['raqueta', 'pelota', 'zapatillas', 'muñequera', 'vincha', 'toalla'], {
        message: 'El tipo debe ser: raqueta, pelota, zapatillas, muñequera, vincha o toalla'
    }),
    __metadata("design:type", String)
], UpdateEquipamientoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], UpdateEquipamientoDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El stock debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser negativo' }),
    (0, class_validator_1.Max)(1000, { message: 'El stock máximo es 1000' }),
    __metadata("design:type", Number)
], UpdateEquipamientoDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El costo debe ser un número' }),
    (0, class_validator_1.Min)(100, { message: 'El costo mínimo es $100' }),
    (0, class_validator_1.Max)(50000, { message: 'El costo máximo es $50.000' }),
    __metadata("design:type", Number)
], UpdateEquipamientoDto.prototype, "costo", void 0);
//# sourceMappingURL=equipamiento.dto.js.map