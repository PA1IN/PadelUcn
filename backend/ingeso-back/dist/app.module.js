"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const canchas_module_1 = require("./modulos/canchas/canchas.module");
const user_module_1 = require("./modulos/user/user.module");
const auth_module_1 = require("./modulos/auth/auth.module");
const admin_module_1 = require("./modulos/admin/admin.module");
const reserva_module_1 = require("./modulos/reserva/reserva.module");
const equipamiento_module_1 = require("./modulos/equipamiento/equipamiento.module");
const boleta_equipamiento_module_1 = require("./modulos/boleta-equipamiento/boleta-equipamiento.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5433,
                username: 'ingeso',
                password: '12342',
                database: 'padelucn',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            canchas_module_1.CanchasModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            reserva_module_1.ReservaModule,
            equipamiento_module_1.EquipamientoModule,
            boleta_equipamiento_module_1.BoletaEquipamientoModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map