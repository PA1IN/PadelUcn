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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
    rut;
    password;
    nombre;
    correo;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'Formato de RUT inválido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser texto' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser texto' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Formato de correo electrónico inválido' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|ucn|alumnos\.ucn|disc\.ucn|ce\.ucn|live)+\.[a-zA-Z]{2,}$/, {
        message: 'El correo debe ser de un dominio válido (gmail.com, hotmail.com, ucn.cl, etc.)',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "correo", void 0);
//# sourceMappingURL=create-user.dto.js.map