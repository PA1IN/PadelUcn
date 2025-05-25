import { Strategy } from 'passport-jwt';
import { UserService } from 'src/modulos/user/user.service';
interface JwtPayload {
    rut: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<import("../../user/entities/user.entity").User | null>;
}
export {};
