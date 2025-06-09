"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JugadorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jugador_controller_1 = require("./jugador.controller");
const jugador_service_1 = require("./jugador.service");
const jugador_entity_1 = require("./entities/jugador.entity");
const reserva_entity_1 = require("../reserva/entities/reserva.entity");
const cancha_entity_1 = require("../cancha/entities/cancha.entity");
let JugadorModule = class JugadorModule {
};
exports.JugadorModule = JugadorModule;
exports.JugadorModule = JugadorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([jugador_entity_1.Jugador, reserva_entity_1.Reserva, cancha_entity_1.Cancha])
        ],
        controllers: [jugador_controller_1.JugadorController],
        providers: [jugador_service_1.JugadorService],
        exports: [jugador_service_1.JugadorService]
    })
], JugadorModule);
//# sourceMappingURL=jugador.module.js.map