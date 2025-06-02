"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUsuarioDto = exports.UpdateAdminDto = exports.AddSaldoUsuarioDto = exports.LoginUsuarioDto = exports.CreateUsuarioDto = void 0;
class CreateUsuarioDto {
    rut;
    nombre;
    correo;
    password;
    telefono;
}
exports.CreateUsuarioDto = CreateUsuarioDto;
class LoginUsuarioDto {
    rut;
    password;
}
exports.LoginUsuarioDto = LoginUsuarioDto;
class AddSaldoUsuarioDto {
    monto;
}
exports.AddSaldoUsuarioDto = AddSaldoUsuarioDto;
class UpdateAdminDto {
    isAdmin;
}
exports.UpdateAdminDto = UpdateAdminDto;
class UpdateUsuarioDto {
    nombre;
    correo;
    telefono;
    saldo;
}
exports.UpdateUsuarioDto = UpdateUsuarioDto;
//# sourceMappingURL=usuario.dto.js.map