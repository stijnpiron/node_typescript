import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import ErrorWithPayload from '../exceptions/ErrorWithPayload';
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

class AuthenticationService {
  private user = userModel;

  public register = async (userData: CreateUserDto) => {
    if (await this.user.findOne({ email: userData.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
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
    } catch (err) {
      throw new ErrorWithPayload(INTERNAL_SERVER_ERROR, 'Unable to register new user', { err, userData });
    }
  };

  public login = async (loginData: LoginDto) => {
    const user = await this.user.findOne({ email: loginData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return { cookie, user };
      }
      throw new WrongCredentialsException();
    }
    throw new WrongCredentialsException();
  };

  public logout = async () => {
    const cookie = this.createCookie();
    return { cookie };
  };

  private createToken(user: User): TokenData {
    const expiresIn = +process.env.JWT_TTL; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData = { token: '', expiresIn: 0 }) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationService;
