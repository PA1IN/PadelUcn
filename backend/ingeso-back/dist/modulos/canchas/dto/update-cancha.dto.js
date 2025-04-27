"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCanchaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cancha_dto_1 = require("./create-cancha.dto");
class UpdateCanchaDto extends (0, mapped_types_1.PartialType)(create_cancha_dto_1.CreateCanchaDto) {
}
exports.UpdateCanchaDto = UpdateCanchaDto;
//# sourceMappingURL=update-cancha.dto.js.map