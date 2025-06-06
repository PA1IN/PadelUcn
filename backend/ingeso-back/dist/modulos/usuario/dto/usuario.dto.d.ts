export declare class CreateUsuarioDto {
    rut: string;
    nombre: string;
    correo: string;
    password: string;
    telefono?: string;
}
export declare class LoginUsuarioDto {
    rut: string;
    password: string;
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
