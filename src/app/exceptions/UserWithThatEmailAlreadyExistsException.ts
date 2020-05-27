import HttpException from './HttpException';
import { BAD_REQUEST } from 'http-status-codes';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(BAD_REQUEST, `User with email ${email} already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;
