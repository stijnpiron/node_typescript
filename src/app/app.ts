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
import mongooseMorgan from 'mongoose-morgan';
import { stringContainsElementOfArray } from './utils/utils';

class App {
  public app: express.Application;
  private basePath: string = '/api';
  private readFile = util.promisify(fs.readFile);
  private mongoConnectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_PATH}/${process.env.MONGO_DB}`;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeLogging();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public async listen() {
    try {
      const [key, cert] = await Promise.all([this.readFile('./assets/cert/key.pem'), this.readFile('./assets/cert/certificate.pem')]);
      https.createServer({ key, cert }, this.app).listen(process.env.PORT, () => {
        console.info(`App listening on https port ${process.env.PORT}`);
      });
    } catch (err) {
      console.warn('Unable to start HTTPS server, falling back to HTTP server', err);
      this.app.listen(process.env.PORT, () => {
        console.info(`App listening on https port ${process.env.PORT}`);
      });
    }
  }

  private initializeLogging() {
    this.app.use(
      process.env.NODE_ENV === 'production'
        ? mongooseMorgan(
            { connectionString: this.mongoConnectionString },
            {
              skip: (req: express.Request, res: express.Response) => {
                return stringContainsElementOfArray(req.originalUrl, ['/api/swagger']);
              },
            },
            ':method :status : :url : :response-time[digits]ms/:total-time[digits]ms :res[content-length]B -- :remote-addr - :remote-user -- ":referrer" ":user-agent" HTTP/:http-version -- :req[cookie]'
          )
        : loggerMiddleware(['/swagger'])
    );
  }

  private initializeMiddlewares() {
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
    mongoose.connect(this.mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
  }
}

export default App;
