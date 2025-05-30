import { Strategy } from 'passport-jwt';
import { UserService } from 'src/modulos/user/user.service';
interface JwtPayload {
    rut: string;
    isAdmin: boolean;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<{
        isAdmin: boolean;
        id?: number | undefined;
        rut?: string | undefined;
        password?: string | undefined;
        nombre?: string | undefined;
        correo?: string | undefined;
        telefono?: string | undefined;
        saldo?: number | undefined;
        reservas?: import("../../reserva/entities/reserva.entity").Reserva[] | undefined;
        historialReservas?: import("../../reserva/entities/historial-reserva.entity").HistorialReserva[] | undefined;
    }>;
}
export {};
