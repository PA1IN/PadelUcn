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
exports.UpdateReservaDto = exports.CreateReservaDto = exports.EquipamientoReservaDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const jugador_dto_1 = require("../../jugador/dto/jugador.dto");
class EquipamientoReservaDto {
    id_equipamiento;
    cantidad;
}
exports.EquipamientoReservaDto = EquipamientoReservaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID del equipamiento es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID del equipamiento debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'El ID del equipamiento debe ser mayor a 0' }),
    __metadata("design:type", Number)
], EquipamientoReservaDto.prototype, "id_equipamiento", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La cantidad es requerida' }),
    (0, class_validator_1.IsNumber)({}, { message: 'La cantidad debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'La cantidad debe ser mayor a 0' }),
    (0, class_validator_1.Max)(10, { message: 'La cantidad máxima es 10' }),
    __metadata("design:type", Number)
], EquipamientoReservaDto.prototype, "cantidad", void 0);
class CreateReservaDto {
    fecha;
    hora_inicio;
    hora_termino;
    rut_usuario;
    numero_cancha;
    jugadores;
    equipamiento;
}
exports.CreateReservaDto = CreateReservaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha es requerida' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de inicio es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La hora de inicio debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "hora_inicio", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de término es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La hora de término debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "hora_termino", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT del usuario es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "rut_usuario", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El número de cancha debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'El número de cancha debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateReservaDto.prototype, "numero_cancha", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los jugadores deben ser un arreglo' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => jugador_dto_1.CreateJugadorDto),
    __metadata("design:type", Array)
], CreateReservaDto.prototype, "jugadores", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'El equipamiento debe ser un arreglo' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EquipamientoReservaDto),
    __metadata("design:type", Array)
], CreateReservaDto.prototype, "equipamiento", void 0);
class UpdateReservaDto {
    fecha;
    hora_inicio;
    hora_termino;
    numero_cancha;
    equipamiento;
    jugadores;
}
exports.UpdateReservaDto = UpdateReservaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La hora de inicio debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "hora_inicio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La hora de término debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "hora_termino", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El número de cancha debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'El número de cancha debe ser mayor a 0' }),
    __metadata("design:type", Number)
], UpdateReservaDto.prototype, "numero_cancha", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'El equipamiento debe ser un arreglo' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EquipamientoReservaDto),
    __metadata("design:type", Array)
], UpdateReservaDto.prototype, "equipamiento", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los jugadores deben ser un arreglo' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => jugador_dto_1.CreateJugadorDto),
    __metadata("design:type", Array)
], UpdateReservaDto.prototype, "jugadores", void 0);
//# sourceMappingURL=reserva.dto.js.map