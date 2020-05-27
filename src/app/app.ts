import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import swaggerUI from 'swagger-ui-express';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import loggerMiddleware from 'middleware/logger.middleware';

class App {
  public app: express.Application;
  private basePath: string = '/api';

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.SERVER_PORT, () => {
      console.info(`App listening on the port ${process.env.SERVER_PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeSwagger() {
    // TODO: Investigate on how to include swagger documentation in Typescript build
    try {
      const swaggerDocument = fs.readFileSync(path.resolve(__dirname, './_docs/swagger/swagger.yml'), 'utf-8');
      const swaggerDocumentation = YAML.parse(swaggerDocument);
      const options = {
        explorer: true,
      };
      this.app.use(`${this.basePath}/swagger`, swaggerUI.serve, swaggerUI.setup(swaggerDocumentation, options));
    } catch (err) {
      console.warn('unable to generate Swagger documentation', err);
    }
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(`${this.basePath}`, controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

export default App;
