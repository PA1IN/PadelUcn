import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from 'src/modulos/user/entities/user.entity';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    validate(rut: string, password: string): Promise<User>;
}
export {};
