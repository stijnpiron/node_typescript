import HttpException from './HttpException';
import { UNAUTHORIZED } from 'http-status-codes';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(UNAUTHORIZED, 'Wrong credentials provided');
  }
}

export default WrongCredentialsException;
