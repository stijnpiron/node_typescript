import User from '../user/user.interface';

export interface SecondFactorAuthentication {
  cookie: string;
  result: User;
}
