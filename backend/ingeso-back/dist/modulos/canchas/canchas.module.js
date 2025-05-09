"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanchasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const canchas_service_1 = require("./canchas.service");
const canchas_controller_1 = require("./canchas.controller");
const cancha_entity_1 = require("./entities/cancha.entity");
let CanchasModule = class CanchasModule {
};
exports.CanchasModule = CanchasModule;
exports.CanchasModule = CanchasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cancha_entity_1.Cancha])],
        controllers: [canchas_controller_1.CanchasController],
        providers: [canchas_service_1.CanchasService],
        exports: [canchas_service_1.CanchasService],
    })
], CanchasModule);
//# sourceMappingURL=canchas.module.js.map