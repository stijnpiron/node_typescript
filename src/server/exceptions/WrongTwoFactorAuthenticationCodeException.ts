import { BAD_REQUEST } from 'http-status-codes';
import HttpException from './HttpException';

class WrongTwoFactorAuthenticationCodeException extends HttpException {
  constructor() {
    super(BAD_REQUEST, 'Invalid two factor authentication token');
  }
}

export default WrongTwoFactorAuthenticationCodeException;
