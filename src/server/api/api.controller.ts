import express from 'express';
import { OK } from 'http-status-codes';
import Controller from '../interfaces/controller.interface';

class ApiController implements Controller {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.catchAll);
  }

  private catchAll = async (_: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      res.status(OK).send({ status: 'API is up and running, go to "/swagger" to get the API documentation' });
    } catch (err) {
      next(err);
    }
  };
}

export default ApiController;
