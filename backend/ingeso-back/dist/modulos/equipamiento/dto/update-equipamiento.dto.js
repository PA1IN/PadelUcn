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
exports.UpdateEquipamientoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_equipamiento_dto_1 = require("./create-equipamiento.dto");
const class_validator_1 = require("class-validator");
class UpdateEquipamientoDto extends (0, mapped_types_1.PartialType)(create_equipamiento_dto_1.CreateEquipamientoDto) {
    tipo;
    nombre;
    stock;
    costo;
}
exports.UpdateEquipamientoDto = UpdateEquipamientoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El tipo debe ser texto' }),
    __metadata("design:type", String)
], UpdateEquipamientoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser texto' }),
    __metadata("design:type", String)
], UpdateEquipamientoDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El stock debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser negativo' }),
    __metadata("design:type", Number)
], UpdateEquipamientoDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El costo debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El costo no puede ser negativo' }),
    __metadata("design:type", Number)
], UpdateEquipamientoDto.prototype, "costo", void 0);
//# sourceMappingURL=update-equipamiento.dto.js.map