export declare class CreateUsuarioDto {
    rut: string;
    nombre: string;
    correo: string;
    contrasena: string;
    telefono?: string;
}
export declare class LoginUsuarioDto {
    rut: string;
    contrasena: string;
}
export declare class AddSaldoUsuarioDto {
    monto: number;
}
export declare class UpdateAdminDto {
    isAdmin: boolean;
}
export declare class UpdateUsuarioDto {
    nombre?: string;
    correo?: string;
    telefono?: string;
    saldo?: number;
}
