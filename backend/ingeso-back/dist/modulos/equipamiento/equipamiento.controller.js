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
exports.EquipamientoController = void 0;
const common_1 = require("@nestjs/common");
const equipamiento_service_1 = require("./equipamiento.service");
const create_equipamiento_dto_1 = require("./dto/create-equipamiento.dto");
const update_equipamiento_dto_1 = require("./dto/update-equipamiento.dto");
let EquipamientoController = class EquipamientoController {
    equipamientoService;
    constructor(equipamientoService) {
        this.equipamientoService = equipamientoService;
    }
    create(createEquipamientoDto) {
        return this.equipamientoService.create(createEquipamientoDto);
    }
    findAll() {
        return this.equipamientoService.findAll();
    }
    findOne(id) {
        return this.equipamientoService.findOne(+id);
    }
    update(id, updateEquipamientoDto) {
        return this.equipamientoService.update(+id, updateEquipamientoDto);
    }
    remove(id) {
        return this.equipamientoService.remove(+id);
    }
};
exports.EquipamientoController = EquipamientoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_equipamiento_dto_1.CreateEquipamientoDto]),
    __metadata("design:returntype", void 0)
], EquipamientoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EquipamientoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquipamientoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_equipamiento_dto_1.UpdateEquipamientoDto]),
    __metadata("design:returntype", void 0)
], EquipamientoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EquipamientoController.prototype, "remove", null);
exports.EquipamientoController = EquipamientoController = __decorate([
    (0, common_1.Controller)('equipamiento'),
    __metadata("design:paramtypes", [equipamiento_service_1.EquipamientoService])
], EquipamientoController);
//# sourceMappingURL=equipamiento.controller.js.map