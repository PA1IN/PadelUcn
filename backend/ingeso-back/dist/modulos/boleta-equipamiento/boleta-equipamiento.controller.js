"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoletaEquipamientoController = void 0;
const common_1 = require("@nestjs/common");
const boleta_equipamiento_service_1 = require("./boleta-equipamiento.service");
const create_boleta_equipamiento_dto_1 = require("./dto/create-boleta-equipamiento.dto");
const update_boleta_equipamiento_dto_1 = require("./dto/update-boleta-equipamiento.dto");
let BoletaEquipamientoController = class BoletaEquipamientoController {
    boletaEquipamientoService;
    constructor(boletaEquipamientoService) {
        this.boletaEquipamientoService = boletaEquipamientoService;
    }
    create(createBoletaEquipamientoDto) {
        return this.boletaEquipamientoService.create(createBoletaEquipamientoDto);
    }
    findAll() {
        return this.boletaEquipamientoService.findAll();
    }
    findOne(id) {
        return this.boletaEquipamientoService.findOne(+id);
    }
    update(id, updateBoletaEquipamientoDto) {
        return this.boletaEquipamientoService.update(+id, updateBoletaEquipamientoDto);
    }
    remove(id) {
        return this.boletaEquipamientoService.remove(+id);
    }
};
exports.BoletaEquipamientoController = BoletaEquipamientoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boleta_equipamiento_dto_1.CreateBoletaEquipamientoDto]),
    __metadata("design:returntype", void 0)
], BoletaEquipamientoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoletaEquipamientoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoletaEquipamientoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_boleta_equipamiento_dto_1.UpdateBoletaEquipamientoDto]),
    __metadata("design:returntype", void 0)
], BoletaEquipamientoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoletaEquipamientoController.prototype, "remove", null);
exports.BoletaEquipamientoController = BoletaEquipamientoController = __decorate([
    (0, common_1.Controller)('boleta-equipamiento'),
    __metadata("design:paramtypes", [boleta_equipamiento_service_1.BoletaEquipamientoService])
], BoletaEquipamientoController);
//# sourceMappingURL=boleta-equipamiento.controller.js.map