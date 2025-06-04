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
exports.UpdateCanchaDto = exports.CreateCanchaDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCanchaDto {
    numero;
    nombre;
    descripcion;
    valor;
    mantenimiento;
}
exports.CreateCanchaDto = CreateCanchaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El número debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'El número de cancha debe ser mayor a 0' }),
    (0, class_validator_1.Max)(20, { message: 'El número de cancha no puede ser mayor a 20' }),
    __metadata("design:type", Number)
], CreateCanchaDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], CreateCanchaDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(10, { message: 'La descripción debe tener al menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(200, { message: 'La descripción no puede tener más de 200 caracteres' }),
    __metadata("design:type", String)
], CreateCanchaDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El valor es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El valor debe ser un número' }),
    (0, class_validator_1.Min)(5000, { message: 'El valor mínimo es $5.000' }),
    (0, class_validator_1.Max)(50000, { message: 'El valor máximo es $50.000' }),
    __metadata("design:type", Number)
], CreateCanchaDto.prototype, "valor", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El estado de mantenimiento es requerido' }),
    (0, class_validator_1.IsBoolean)({ message: 'El mantenimiento debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], CreateCanchaDto.prototype, "mantenimiento", void 0);
class UpdateCanchaDto {
    nombre;
    descripcion;
    valor;
    mantenimiento;
}
exports.UpdateCanchaDto = UpdateCanchaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no puede tener más de 50 caracteres' }),
    __metadata("design:type", String)
], UpdateCanchaDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(10, { message: 'La descripción debe tener al menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(200, { message: 'La descripción no puede tener más de 200 caracteres' }),
    __metadata("design:type", String)
], UpdateCanchaDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El valor debe ser un número' }),
    (0, class_validator_1.Min)(5000, { message: 'El valor mínimo es $5.000' }),
    (0, class_validator_1.Max)(50000, { message: 'El valor máximo es $50.000' }),
    __metadata("design:type", Number)
], UpdateCanchaDto.prototype, "valor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'El mantenimiento debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], UpdateCanchaDto.prototype, "mantenimiento", void 0);
//# sourceMappingURL=cancha.dto.js.map