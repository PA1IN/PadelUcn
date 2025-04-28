"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResponse = CreateResponse;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const logger = new common_2.Logger('ApiResponseUtil');
logger.log('Módulo de respuesta API iniciado');
function CreateResponse(message, data, statusCode, error, success = true) {
    return {
        statusCode: common_1.HttpStatus[statusCode],
        message,
        data,
        success,
        ...(error && { error }),
    };
}
//# sourceMappingURL=api-response.util.ts.js.map