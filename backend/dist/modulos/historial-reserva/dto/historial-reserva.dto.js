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
exports.UpdateHistorialReservaDto = exports.CreateHistorialReservaDto = void 0;
const class_validator_1 = require("class-validator");
class CreateHistorialReservaDto {
    estado;
    idReserva;
    idUsuario;
}
exports.CreateHistorialReservaDto = CreateHistorialReservaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El estado es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El estado debe ser una cadena de texto' }),
    (0, class_validator_1.IsIn)(['pendiente', 'confirmada', 'cancelada', 'completada'], {
        message: 'El estado debe ser: pendiente, confirmada, cancelada o completada'
    }),
    __metadata("design:type", String)
], CreateHistorialReservaDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de reserva es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de reserva debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'El ID de reserva debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateHistorialReservaDto.prototype, "idReserva", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de usuario es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de usuario debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'El ID de usuario debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateHistorialReservaDto.prototype, "idUsuario", void 0);
class UpdateHistorialReservaDto {
    estado;
}
exports.UpdateHistorialReservaDto = UpdateHistorialReservaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El estado debe ser una cadena de texto' }),
    (0, class_validator_1.IsIn)(['pendiente', 'confirmada', 'cancelada', 'completada'], {
        message: 'El estado debe ser: pendiente, confirmada, cancelada o completada'
    }),
    __metadata("design:type", String)
], UpdateHistorialReservaDto.prototype, "estado", void 0);
//# sourceMappingURL=historial-reserva.dto.js.map