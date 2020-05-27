import express from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import LoginDto from './login.dto';
import { OK } from 'http-status-codes';
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = req.body;
    try {
      const { cookie, user } = await this.authenticationService.register(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(OK).send(user);
    } catch (err) {
      next(err);
    }
  };

  private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const loginData: LoginDto = req.body;
    try {
      const { cookie, user } = await this.authenticationService.login(loginData);
      res.setHeader('Set-Cookie', cookie);
      res.status(OK).send(user);
    } catch (err) {
      next(err);
    }
  };

  private loggingOut = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const { cookie } = await this.authenticationService.logout();
      response.setHeader('Set-Cookie', cookie);
      response.status(OK).send();
    } catch (err) {
      next(err);
    }
  };
}

export default AuthenticationController;
