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
exports.UpdateUsuarioDto = exports.UpdateAdminDto = exports.AddSaldoUsuarioDto = exports.LoginUsuarioDto = exports.CreateUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUsuarioDto {
    rut;
    nombre;
    correo;
    password;
    telefono;
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo es requerido' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo debe tener un formato válido' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El teléfono debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^(\+?56)?[2-9]\d{7,8}$/, { message: 'El teléfono debe tener un formato válido chileno' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "telefono", void 0);
class LoginUsuarioDto {
    rut;
    password;
}
exports.LoginUsuarioDto = LoginUsuarioDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El RUT debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' }),
    __metadata("design:type", String)
], LoginUsuarioDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], LoginUsuarioDto.prototype, "password", void 0);
class AddSaldoUsuarioDto {
    monto;
}
exports.AddSaldoUsuarioDto = AddSaldoUsuarioDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El monto es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El monto debe ser un número' }),
    (0, class_validator_1.Min)(1000, { message: 'El monto mínimo es $1.000' }),
    (0, class_validator_1.Max)(1000000, { message: 'El monto máximo es $1.000.000' }),
    __metadata("design:type", Number)
], AddSaldoUsuarioDto.prototype, "monto", void 0);
class UpdateAdminDto {
    isAdmin;
}
exports.UpdateAdminDto = UpdateAdminDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El valor isAdmin es requerido' }),
    (0, class_validator_1.IsBoolean)({ message: 'isAdmin debe ser un valor booleano' }),
    __metadata("design:type", Boolean)
], UpdateAdminDto.prototype, "isAdmin", void 0);
class UpdateUsuarioDto {
    nombre;
    correo;
    telefono;
    saldo;
}
exports.UpdateUsuarioDto = UpdateUsuarioDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo debe tener un formato válido' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El teléfono debe ser una cadena de texto' }),
    (0, class_validator_1.Matches)(/^(\+?56)?[2-9]\d{7,8}$/, { message: 'El teléfono debe tener un formato válido chileno' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "telefono", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El saldo debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El saldo no puede ser negativo' }),
    __metadata("design:type", Number)
], UpdateUsuarioDto.prototype, "saldo", void 0);
//# sourceMappingURL=usuario.dto.js.map