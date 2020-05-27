"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const authentication_controller_1 = __importDefault(require("./authentication/authentication.controller"));
const post_controller_1 = __importDefault(require("./post/post.controller"));
const user_controller_1 = __importDefault(require("./user/user.controller"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
validateEnv_1.default();
const app = new app_1.default([new post_controller_1.default(), new authentication_controller_1.default(), new user_controller_1.default()]);
app.listen();
//# sourceMappingURL=server.js.map