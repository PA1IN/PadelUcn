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
exports.UpdateBoletaEquipamientoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_boleta_equipamiento_dto_1 = require("./create-boleta-equipamiento.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateBoletaEquipamientoDto extends (0, mapped_types_1.PartialType)(create_boleta_equipamiento_dto_1.CreateBoletaEquipamientoDto) {
    cantidad;
}
exports.UpdateBoletaEquipamientoDto = UpdateBoletaEquipamientoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'La cantidad debe ser al menos 1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateBoletaEquipamientoDto.prototype, "cantidad", void 0);
//# sourceMappingURL=update-boleta-equipamiento.dto.js.map