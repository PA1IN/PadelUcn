"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reserva_service_1 = require("./reserva.service");
const reserva_controller_1 = require("./reserva.controller");
const reserva_entity_1 = require("./entities/reserva.entity");
const historial_reserva_entity_1 = require("./entities/historial-reserva.entity");
const historial_reserva_service_1 = require("./historial-reserva/historial-reserva.service");
const historial_reserva_controller_1 = require("./historial-reserva/historial-reserva.controller");
let ReservaModule = class ReservaModule {
};
exports.ReservaModule = ReservaModule;
exports.ReservaModule = ReservaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reserva_entity_1.Reserva, historial_reserva_entity_1.HistorialReserva])],
        controllers: [reserva_controller_1.ReservaController, historial_reserva_controller_1.HistorialReservaController],
        providers: [reserva_service_1.ReservaService, historial_reserva_service_1.HistorialReservaService],
        exports: [reserva_service_1.ReservaService, historial_reserva_service_1.HistorialReservaService],
    })
], ReservaModule);
//# sourceMappingURL=reserva.module.js.map