import User from '../user/user.interface';

export default interface Login {
  cookie: string;
  user?: User;
  isTwoFactorAuthenticationEnabled?: boolean;
}
