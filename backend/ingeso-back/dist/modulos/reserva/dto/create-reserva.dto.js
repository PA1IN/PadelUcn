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
exports.CreateReservaDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateReservaDto {
    fecha;
    horaInicio;
    horaTermino;
    canchaId;
    usuarioId;
    rutUsuario;
}
exports.CreateReservaDto = CreateReservaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de la reserva es requerida' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Formato de fecha inválido, use YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de inicio es requerida' }),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Formato de hora inválido, use HH:MM:SS',
    }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "horaInicio", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La hora de término es requerida' }),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Formato de hora inválido, use HH:MM:SS',
    }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "horaTermino", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de la cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de la cancha debe ser un número' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReservaDto.prototype, "canchaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID del usuario debe ser un número' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateReservaDto.prototype, "usuarioId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El RUT del usuario debe ser texto' }),
    __metadata("design:type", String)
], CreateReservaDto.prototype, "rutUsuario", void 0);
//# sourceMappingURL=create-reserva.dto.js.map