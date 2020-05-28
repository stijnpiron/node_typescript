import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import swaggerUI from 'swagger-ui-express';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import YAML from 'yaml';
import fs from 'fs';
import https from 'https';
import util from 'util';
import loggerMiddleware from './middleware/logger.middleware';

class App {
  public app: express.Application;
  private basePath: string = '/api';
  private readFile = util.promisify(fs.readFile);

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public async listen() {
    const [key, cert] = await Promise.all([this.readFile('./assets/cert/key.pem'), this.readFile('./assets/cert/certificate.pem')]);
    https.createServer({ key, cert }, this.app).listen(process.env.SERVER_PORT, () => {
      console.info(`App listening on the port ${process.env.SERVER_PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(loggerMiddleware(['/swagger']));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private async initializeSwagger() {
    // TODO: Investigate on how to include swagger documentation in Typescript build
    try {
      const [swaggerDocument] = await Promise.all([this.readFile('./openapi.reference.yml')]);
      const swaggerDocumentation = YAML.parse(swaggerDocument.toString());
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
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}/${MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

export default App;
