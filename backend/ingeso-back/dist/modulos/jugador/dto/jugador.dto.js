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
exports.UpdateJugadorDto = exports.CreateJugadorDto = void 0;
const class_validator_1 = require("class-validator");
class CreateJugadorDto {
    nombre;
    apellido;
    rut;
    edad;
    id_reserva;
}
exports.CreateJugadorDto = CreateJugadorDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], CreateJugadorDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El apellido debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], CreateJugadorDto.prototype, "apellido", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], CreateJugadorDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La edad es requerida' }),
    (0, class_validator_1.IsNumber)({}, { message: 'La edad debe ser un número' }),
    (0, class_validator_1.Min)(10, { message: 'La edad mínima es 10 años' }),
    (0, class_validator_1.Max)(80, { message: 'La edad máxima es 80 años' }),
    __metadata("design:type", Number)
], CreateJugadorDto.prototype, "edad", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de reserva es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de reserva debe ser un número' }),
    __metadata("design:type", Number)
], CreateJugadorDto.prototype, "id_reserva", void 0);
class UpdateJugadorDto {
    nombre;
    apellido;
    rut;
    edad;
}
exports.UpdateJugadorDto = UpdateJugadorDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], UpdateJugadorDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El apellido debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], UpdateJugadorDto.prototype, "apellido", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], UpdateJugadorDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'La edad debe ser un número' }),
    (0, class_validator_1.Min)(10, { message: 'La edad mínima es 10 años' }),
    (0, class_validator_1.Max)(80, { message: 'La edad máxima es 80 años' }),
    __metadata("design:type", Number)
], UpdateJugadorDto.prototype, "edad", void 0);
//# sourceMappingURL=jugador.dto.js.map