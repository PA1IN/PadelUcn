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
const historial_reserva_module_1 = require("../historial-reserva/historial-reserva.module");
const usuario_entity_1 = require("../usuario/entities/usuario.entity");
const cancha_entity_1 = require("../cancha/entities/cancha.entity");
const boleta_equipamiento_entity_1 = require("../boleta-equipamiento/entities/boleta-equipamiento.entity");
const equipamiento_entity_1 = require("../equipamiento/entities/equipamiento.entity");
const jugador_entity_1 = require("../jugador/entities/jugador.entity");
let ReservaModule = class ReservaModule {
};
exports.ReservaModule = ReservaModule;
exports.ReservaModule = ReservaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                reserva_entity_1.Reserva,
                usuario_entity_1.Usuario,
                cancha_entity_1.Cancha,
                boleta_equipamiento_entity_1.BoletaEquipamiento,
                equipamiento_entity_1.Equipamiento,
                jugador_entity_1.Jugador
            ]),
            historial_reserva_module_1.HistorialReservaModule
        ],
        controllers: [reserva_controller_1.ReservaController],
        providers: [reserva_service_1.ReservaService],
        exports: [reserva_service_1.ReservaService]
    })
], ReservaModule);
//# sourceMappingURL=reserva.module.js.map