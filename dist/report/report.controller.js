"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../user/user.model"));
class ReportController {
    constructor() {
        this.path = '/report';
        this.router = express_1.default.Router();
        this.user = user_model_1.default;
        this.generateReport = async (req, res, next) => {
            const usersByCounrties = await this.user.aggregate([
                {
                    $group: {
                        _id: {
                            country: '$address.country',
                        },
                    },
                },
            ]);
            res.status(http_status_codes_1.OK).send(usersByCounrties);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.generateReport);
    }
}
exports.default = ReportController;
//# sourceMappingURL=report.controller.js.map