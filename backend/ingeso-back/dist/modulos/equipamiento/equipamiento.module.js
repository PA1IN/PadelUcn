"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipamientoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const equipamiento_service_1 = require("./equipamiento.service");
const equipamiento_controller_1 = require("./equipamiento.controller");
const equipamiento_entity_1 = require("./entities/equipamiento.entity");
let EquipamientoModule = class EquipamientoModule {
};
exports.EquipamientoModule = EquipamientoModule;
exports.EquipamientoModule = EquipamientoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([equipamiento_entity_1.Equipamiento])],
        controllers: [equipamiento_controller_1.EquipamientoController],
        providers: [equipamiento_service_1.EquipamientoService],
        exports: [equipamiento_service_1.EquipamientoService],
    })
], EquipamientoModule);
//# sourceMappingURL=equipamiento.module.js.map