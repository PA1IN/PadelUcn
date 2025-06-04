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
exports.RegisterResponseDto = exports.LoginResponseDto = exports.RegisterDto = exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
class LoginDto {
    rut;
    contraseña;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], LoginDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], LoginDto.prototype, "contrase\u00F1a", void 0);
class RegisterDto {
    rut;
    nombre_usuario;
    correo;
    contraseña;
    telefono;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener formato chileno válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de usuario es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre de usuario debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "nombre_usuario", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo es requerido' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo debe tener un formato válido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "contrase\u00F1a", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El teléfono debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^\+56[2-9]\d{8}$/, { message: 'El teléfono debe tener formato chileno (+56XXXXXXXXX)' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "telefono", void 0);
class LoginResponseDto {
    access_token;
    user;
}
exports.LoginResponseDto = LoginResponseDto;
class RegisterResponseDto {
    id;
    rut;
    nombre;
    correo;
    telefono;
    saldo;
    isAdmin;
}
exports.RegisterResponseDto = RegisterResponseDto;
//# sourceMappingURL=auth.dto.js.map