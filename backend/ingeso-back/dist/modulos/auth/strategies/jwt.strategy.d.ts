import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    validate(payload: any): Promise<{
        id: number;
        rut: string;
        nombre: string;
        correo: string;
        telefono: string;
        saldo: number;
        isAdmin: boolean;
        reservas: import("../../reserva/entities/reserva.entity").Reserva[];
        historiales: import("../../historial-reserva/entities/historial-reserva.entity").HistorialReserva[];
    } | null>;
}
export {};
