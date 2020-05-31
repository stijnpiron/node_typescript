import HttpException from './HttpException';
import { FORBIDDEN } from 'http-status-codes';

class NotAuthorizedException extends HttpException {
  constructor() {
    super(FORBIDDEN, "You're not authorized");
  }
}

export default NotAuthorizedException;
