"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostNotFoundException_1 = __importDefault(require("../exceptions/PostNotFoundException"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const post_dto_1 = __importDefault(require("./post.dto"));
const post_model_1 = __importDefault(require("./post.model"));
const http_status_codes_1 = require("http-status-codes");
class PostController {
    constructor() {
        this.path = '/posts';
        this.router = express_1.default.Router();
        this.post = post_model_1.default;
        this.getAllPosts = async (request, response) => {
            const posts = await this.post.find().populate('author', '-password');
            response.status(http_status_codes_1.OK).send(posts);
        };
        this.getPostById = async (request, response, next) => {
            const id = request.params.id;
            const post = await this.post.findById(id);
            if (post) {
                response.status(http_status_codes_1.OK).send(post);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.modifyPost = async (request, response, next) => {
            const id = request.params.id;
            const postData = request.body;
            const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
            if (post) {
                response.status(http_status_codes_1.OK).send(post);
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.createPost = async (request, response) => {
            const postData = request.body;
            const createdPost = new this.post({
                ...postData,
                author: request.user._id,
            });
            const savedPost = await createdPost.save();
            await savedPost.populate('author', '-password').execPopulate();
            response.status(http_status_codes_1.OK).send(savedPost);
        };
        this.deletePost = async (request, response, next) => {
            const id = request.params.id;
            const successResponse = await this.post.findByIdAndDelete(id);
            if (successResponse) {
                response.status(http_status_codes_1.OK).send();
            }
            else {
                next(new PostNotFoundException_1.default(id));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, auth_middleware_1.default)
            .patch(`${this.path}/:id`, validation_middleware_1.default(post_dto_1.default, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, auth_middleware_1.default, validation_middleware_1.default(post_dto_1.default), this.createPost);
    }
}
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map