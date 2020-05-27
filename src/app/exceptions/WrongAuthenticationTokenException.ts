import HttpException from './HttpException';
import { UNAUTHORIZED } from 'http-status-codes';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(UNAUTHORIZED, 'Wrong authentication token');
  }
}

export default WrongAuthenticationTokenException;
