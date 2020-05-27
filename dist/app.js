"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class App {
    constructor(controllers) {
        this.basePath = `/api`;
        this.app = express_1.default();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(process.env.SERVER_PORT, () => {
            console.log(`App listening on the port ${process.env.SERVER_PORT}`);
        });
    }
    initializeMiddlewares() {
        this.app.use(this.loggerMiddleware);
        this.app.use(body_parser_1.default.json());
        this.app.use(cookie_parser_1.default());
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    initializeSwagger() {
        try {
            const swaggerDocument = fs_1.default.readFileSync(path_1.default.resolve(__dirname, './_docs/swagger/swagger.yml'), 'utf-8');
            const swaggerDocumentation = yaml_1.default.parse(swaggerDocument);
            const options = {
                explorer: true,
            };
            this.app.use(`${this.basePath}/swagger`, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocumentation, options));
        }
        catch (e) {
            console.log('unable to generate Swagger documentation', e);
        }
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use(`${this.basePath}`, controller.router);
        });
    }
    connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose_1.default.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    loggerMiddleware(req, res, next) {
        console.log(`${req.method} ${req.path}`);
        next();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map