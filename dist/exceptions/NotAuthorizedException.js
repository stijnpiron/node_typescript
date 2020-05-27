"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const http_status_codes_1 = require("http-status-codes");
class NotAuthorizedException extends HttpException_1.default {
    constructor() {
        super(http_status_codes_1.FORBIDDEN, "You're not authorized");
    }
}
exports.default = NotAuthorizedException;
//# sourceMappingURL=NotAuthorizedException.js.map