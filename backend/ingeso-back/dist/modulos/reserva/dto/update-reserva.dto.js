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
exports.UpdateReservaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reserva_dto_1 = require("./create-reserva.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateReservaDto extends (0, mapped_types_1.PartialType)(create_reserva_dto_1.CreateReservaDto) {
    fecha;
    horaInicio;
    horaTermino;
    canchaId;
}
exports.UpdateReservaDto = UpdateReservaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Formato de fecha inválido, use YYYY-MM-DD' }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "fecha", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Formato de hora inválido, use HH:MM:SS',
    }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "horaInicio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Formato de hora inválido, use HH:MM:SS',
    }),
    __metadata("design:type", String)
], UpdateReservaDto.prototype, "horaTermino", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El ID de la cancha debe ser un número' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateReservaDto.prototype, "canchaId", void 0);
//# sourceMappingURL=update-reserva.dto.js.map