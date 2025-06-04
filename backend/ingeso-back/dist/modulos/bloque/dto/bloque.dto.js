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
exports.UpdateBloqueDto = exports.CreateBloqueDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBloqueDto {
    hora_inicio;
    hora_termino;
    dias;
    activo;
}
exports.CreateBloqueDto = CreateBloqueDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de inicio es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La hora de inicio debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' }),
    __metadata("design:type", String)
], CreateBloqueDto.prototype, "hora_inicio", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de término es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La hora de término debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' }),
    __metadata("design:type", String)
], CreateBloqueDto.prototype, "hora_termino", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Los días deben ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^(lun|mar|mie|jue|vie|sab|dom)(,(lun|mar|mie|jue|vie|sab|dom))*$/, {
        message: 'Los días deben estar separados por comas (ej: lun,mar,mie)'
    }),
    __metadata("design:type", String)
], CreateBloqueDto.prototype, "dias", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Activo debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], CreateBloqueDto.prototype, "activo", void 0);
class UpdateBloqueDto {
    hora_inicio;
    hora_termino;
    dias;
    activo;
}
exports.UpdateBloqueDto = UpdateBloqueDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La hora de inicio debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' }),
    __metadata("design:type", String)
], UpdateBloqueDto.prototype, "hora_inicio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La hora de término debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' }),
    __metadata("design:type", String)
], UpdateBloqueDto.prototype, "hora_termino", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Los días deben ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^(lun|mar|mie|jue|vie|sab|dom)(,(lun|mar|mie|jue|vie|sab|dom))*$/, {
        message: 'Los días deben estar separados por comas (ej: lun,mar,mie)'
    }),
    __metadata("design:type", String)
], UpdateBloqueDto.prototype, "dias", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Activo debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], UpdateBloqueDto.prototype, "activo", void 0);
//# sourceMappingURL=bloque.dto.js.map