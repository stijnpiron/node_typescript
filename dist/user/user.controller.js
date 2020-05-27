"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NotAuthorizedException_1 = __importDefault(require("../exceptions/NotAuthorizedException"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const post_model_1 = __importDefault(require("../post/post.model"));
const http_status_codes_1 = require("http-status-codes");
class UserController {
    constructor() {
        this.path = '/users';
        this.router = express_1.default.Router();
        this.post = post_model_1.default;
        this.getAllPostsOfUser = async (req, res, next) => {
            const userId = req.params.id;
            if (userId === req.user._id.toString()) {
                const posts = await this.post.find({ author: userId });
                res.status(http_status_codes_1.OK).send(posts);
            }
            else {
                next(new NotAuthorizedException_1.default());
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/:id/posts`, auth_middleware_1.default, this.getAllPostsOfUser);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map