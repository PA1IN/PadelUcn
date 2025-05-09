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
    costo;
}
exports.CreateCanchaDto = CreateCanchaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de la cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El número de la cancha debe ser un valor numérico' }),
    (0, class_validator_1.Min)(1, { message: 'El número de la cancha debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateCanchaDto.prototype, "numero", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El costo de la cancha es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El costo debe ser un valor numérico' }),
    (0, class_validator_1.Min)(0, { message: 'El costo no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateCanchaDto.prototype, "costo", void 0);
//# sourceMappingURL=create-cancha.dto.js.map