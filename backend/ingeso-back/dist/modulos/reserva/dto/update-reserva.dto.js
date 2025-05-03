"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reserva_dto_1 = require("./create-reserva.dto");
class UpdateReservaDto extends (0, mapped_types_1.PartialType)(create_reserva_dto_1.CreateReservaDto) {
}
exports.UpdateReservaDto = UpdateReservaDto;
//# sourceMappingURL=update-reserva.dto.js.map