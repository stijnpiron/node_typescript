import HttpException from './HttpException';
import { UNAUTHORIZED } from 'http-status-codes';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(UNAUTHORIZED, 'Authentication token missing');
  }
}

export default AuthenticationTokenMissingException;
