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
exports.CreateCanchaDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCanchaDto {
    numero;
    nombre;
    descripcion;
    mantenimiento;
    valor;
}
exports.CreateCanchaDto = CreateCanchaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de la cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El número debe ser un valor numérico' }),
    __metadata("design:type", Number)
], CreateCanchaDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la cancha es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser texto' }),
    __metadata("design:type", String)
], CreateCanchaDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser texto' }),
    __metadata("design:type", String)
], CreateCanchaDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'El estado de mantenimiento debe ser booleano' }),
    __metadata("design:type", Boolean)
], CreateCanchaDto.prototype, "mantenimiento", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El valor de la cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El valor debe ser un número' }),
    __metadata("design:type", Number)
], CreateCanchaDto.prototype, "valor", void 0);
//# sourceMappingURL=create-cancha.dto.js.map