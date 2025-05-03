"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEquipamientoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_equipamiento_dto_1 = require("./create-equipamiento.dto");
class UpdateEquipamientoDto extends (0, mapped_types_1.PartialType)(create_equipamiento_dto_1.CreateEquipamientoDto) {
}
exports.UpdateEquipamientoDto = UpdateEquipamientoDto;
//# sourceMappingURL=update-equipamiento.dto.js.map