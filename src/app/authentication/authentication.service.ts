import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import ExceptionWithPayload from '../exceptions/ExceptionWithPayload';
import userModel from '../user/user.model';
import CreateUserDto from '../user/user.dto';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import bcrypt from 'bcrypt';
import User from '../user/user.interface';
import jwt from 'jsonwebtoken';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import LoginDto from './login.dto';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import speakeasy from 'speakeasy';
import { Response } from 'express';
import QRCode from 'qrcode';
import Login from './login.interface';
import { Register } from './register.interface';
import { SecondFactorAuthentication } from './second-factor-authentication.interface';
import { TwoFactorAuthenticationCode } from './two-factor-authentication-code.interface';
import { Logout } from './logout.interface';

class AuthenticationService {
  private user = userModel;

  public register = async (userData: CreateUserDto): Promise<Register> => {
    if (await this.user.findOne({ email: userData.email }))
      throw new UserWithThatEmailAlreadyExistsException(userData.email);

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      const cookie = this.createCookie(tokenData);

      return {
        cookie,
        user,
      };
    } catch (errMessage) {
      throw new ExceptionWithPayload(INTERNAL_SERVER_ERROR, 'Unable to register new user', { errMessage, userData });
    }
  };

  public login = async (loginData: LoginDto): Promise<Login> => {
    const user = await this.user.findOne({ email: loginData.email });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);

      if (isPasswordMatching) {
        user.password = undefined;
        user.twoFactorAuthenticationCode = undefined;
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);

        if (user.isTwoFactorAuthenticationEnabled) return { cookie, isTwoFactorAuthenticationEnabled: true };

        return { cookie, user };
      }
      throw new WrongCredentialsException();
    }
    throw new WrongCredentialsException();
  };

  public logout = async (): Promise<Logout> => {
    const cookie = this.createCookie();

    return { cookie };
  };

  public secondFactorAuthentication = async (
    twoFactorAuthenticationCode: string,
    user: User
  ): Promise<SecondFactorAuthentication> => {
    const isCodeValid = await this.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, user);

    if (isCodeValid) {
      const tokenData = this.createToken(user, true);
      const cookie = this.createCookie(tokenData);
      user.password = undefined;
      user.twoFactorAuthenticationCode = undefined;

      return { cookie, result: user };
    }
    throw new WrongAuthenticationTokenException();
  };

  public getTwoFactorAuthenticationCode = (): TwoFactorAuthenticationCode => {
    const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      length: 64,
    });

    return {
      otpauthUrl: secretCode.otpauth_url,
      base32: secretCode.base32,
    };
  };

  public respondWithQRCode = (data: string, res: Response): any => {
    QRCode.toFileStream(res, data);
  };

  public verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode: string, user: User): boolean {
    return speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationCode,
      encoding: 'base32',
      token: twoFactorAuthenticationCode,
    });
  }

  public createToken(user: User, isSecondFactorAuthenticated = false): TokenData {
    const expiresIn = +process.env.JWT_TTL;
    const secret = process.env.JWT_SECRET;

    const dataStoredInToken: DataStoredInToken = {
      isSecondFactorAuthenticated,
      _id: user._id,
    };

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData = { token: '', expiresIn: 0 }): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationService;
