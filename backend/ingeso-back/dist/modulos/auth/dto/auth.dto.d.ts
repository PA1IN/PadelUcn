export declare class LoginDto {
    rut: string;
    contraseña: string;
}
export declare class RegisterDto {
    rut: string;
    nombre_usuario: string;
    correo: string;
    contraseña: string;
    telefono?: string;
}
export declare class LoginResponseDto {
    access_token: string;
    user: {
        id: number;
        rut: string;
        nombre: string;
        correo: string;
        telefono?: string;
        saldo: number;
        isAdmin: boolean;
    };
}
export declare class RegisterResponseDto {
    id: number;
    rut: string;
    nombre: string;
    correo: string;
    telefono?: string;
    saldo: number;
    isAdmin: boolean;
}
