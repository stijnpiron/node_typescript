"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../exceptions/UserWithThatEmailAlreadyExistsException"));
const WrongCredentialsException_1 = __importDefault(require("../exceptions/WrongCredentialsException"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const user_dto_1 = __importDefault(require("../user/user.dto"));
const user_model_1 = __importDefault(require("./../user/user.model"));
const logIn_dto_1 = __importDefault(require("./logIn.dto"));
const http_status_codes_1 = require("http-status-codes");
class AuthenticationController {
    constructor() {
        this.path = '/auth';
        this.router = express_1.default.Router();
        this.user = user_model_1.default;
        this.registration = async (req, res, next) => {
            const userData = req.body;
            if (await this.user.findOne({ email: userData.email })) {
                next(new UserWithThatEmailAlreadyExistsException_1.default(userData.email));
            }
            else {
                const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
                const user = await this.user.create({
                    ...userData,
                    password: hashedPassword,
                });
                user.password = undefined;
                const tokenData = this.createToken(user);
                res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                res.status(http_status_codes_1.OK).send(user);
            }
        };
        this.loggingIn = async (request, response, next) => {
            const logInData = request.body;
            const user = await this.user.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = await bcrypt_1.default.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const tokenData = this.createToken(user);
                    response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                    response.status(http_status_codes_1.OK).send(user);
                }
                else {
                    next(new WrongCredentialsException_1.default());
                }
            }
            else {
                next(new WrongCredentialsException_1.default());
            }
        };
        this.loggingOut = (request, response) => {
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.status(200).send();
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, validation_middleware_1.default(user_dto_1.default), this.registration);
        this.router.post(`${this.path}/login`, validation_middleware_1.default(logIn_dto_1.default), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    createToken(user) {
        const expiresIn = +process.env.JWT_TTL; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            _id: user._id,
        };
        return {
            token: jsonwebtoken_1.default.sign(dataStoredInToken, secret, { expiresIn }),
            expiresIn,
        };
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map