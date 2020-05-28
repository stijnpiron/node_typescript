import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import TokenData from 'interfaces/tokenData.interface';
import express from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import LoginDto from './login.dto';
import { OK } from 'http-status-codes';
import AuthenticationService from './authentication.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';
import authMiddleware from '../middleware/auth.middleware';
import WrongTwoFactorAuthenticationCodeException from '../exceptions/WrongTwoFactorAuthenticationCodeException';
import TwoFactorAuthenticationDto from './TwoFactorAuthentication.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
    this.router.post(`${this.path}/2fa/authenticate`, validationMiddleware(TwoFactorAuthenticationDto), authMiddleware(true), this.secondFactorAuthentication);
    this.router
      .all(`${this.path}/*`, authMiddleware())
      .get(`${this.path}`, authMiddleware(), this.auth)
      .post(`${this.path}/2fa/generate`, this.generateTwoFactorAuthenticationCode)
      .post(`${this.path}/2fa/toggle`, validationMiddleware(TwoFactorAuthenticationDto), this.toggleTwoFactorAuthentication);
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
      const { cookie, user, isTwoFactorAuthenticationEnabled } = await this.authenticationService.login(loginData);
      res.setHeader('Set-Cookie', cookie);
      if (isTwoFactorAuthenticationEnabled) {
        res.status(OK).send({ isTwoFactorAuthenticationEnabled });
      } else {
        res.status(OK).send(user);
      }
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

  private generateTwoFactorAuthenticationCode = async (req: RequestWithUser, res: express.Response) => {
    const user = req.user;
    const { otpauthUrl, base32 } = this.authenticationService.getTwoFactorAuthenticationCode();
    await this.user.findByIdAndUpdate(user._id, { twoFactorAuthenticationCode: base32 });
    this.authenticationService.respondWithQRCode(otpauthUrl, res);
  };

  private toggleTwoFactorAuthentication = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const { twoFactorAuthenticationCode } = req.body;
    const user = req.user;
    const isCodeValid = await this.authenticationService.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, user);
    if (isCodeValid) {
      await this.user.findByIdAndUpdate(user._id, {
        isTwoFactorAuthenticationEnabled: !user.isTwoFactorAuthenticationEnabled,
      });
      res.status(OK).send();
    } else {
      next(new WrongTwoFactorAuthenticationCodeException());
    }
  };

  private secondFactorAuthentication = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
    const { twoFactorAuthenticationCode } = req.body;
    const user = req.user;
    try {
      const { cookie, result } = await this.authenticationService.secondFactorAuthentication(twoFactorAuthenticationCode, user);
      res.setHeader('Set-Cookie', cookie);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };

  private auth = (request: RequestWithUser, response: express.Response) => {
    response.send({
      ...request.user,
      password: undefined,
      twoFactorAuthenticationCode: undefined,
    });
  };

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationController;
