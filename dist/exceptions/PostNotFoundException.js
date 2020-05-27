"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const http_status_codes_1 = require("http-status-codes");
class PostNotFoundException extends HttpException_1.default {
    constructor(id) {
        super(http_status_codes_1.NOT_FOUND, `Post with id ${id} not found`);
    }
}
exports.default = PostNotFoundException;
//# sourceMappingURL=PostNotFoundException.js.map