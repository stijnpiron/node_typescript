"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
function errorMiddleware(err, req, res, next) {
    const code = err.status || http_status_codes_1.INTERNAL_SERVER_ERROR;
    const type = http_status_codes_1.getStatusText(err.status);
    const message = err.message || 'Something went wrong';
    res.status(code).send({ code, type, message });
}
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map