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
exports.BloqueController = void 0;
const common_1 = require("@nestjs/common");
const bloque_service_1 = require("./bloque.service");
const bloque_dto_1 = require("./dto/bloque.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let BloqueController = class BloqueController {
    bloqueService;
    constructor(bloqueService) {
        this.bloqueService = bloqueService;
    }
    create(createBloqueDto) {
        return this.bloqueService.create(createBloqueDto);
    }
    findAll() {
        return this.bloqueService.findAll();
    }
    findActivos() {
        return this.bloqueService.findActivos();
    }
    findOne(id) {
        return this.bloqueService.findOne(+id);
    }
    update(id, updateBloqueDto) {
        return this.bloqueService.update(+id, updateBloqueDto);
    }
    remove(id) {
        return this.bloqueService.remove(+id);
    }
};
exports.BloqueController = BloqueController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bloque_dto_1.CreateBloqueDto]),
    __metadata("design:returntype", Promise)
], BloqueController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BloqueController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('activos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BloqueController.prototype, "findActivos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BloqueController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bloque_dto_1.UpdateBloqueDto]),
    __metadata("design:returntype", Promise)
], BloqueController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BloqueController.prototype, "remove", null);
exports.BloqueController = BloqueController = __decorate([
    (0, common_1.Controller)('bloques'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [bloque_service_1.BloqueService])
], BloqueController);
//# sourceMappingURL=bloque.controller.js.map