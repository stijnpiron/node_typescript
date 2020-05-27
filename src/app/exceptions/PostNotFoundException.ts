import HttpException from './HttpException';
import { NOT_FOUND } from 'http-status-codes';

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(NOT_FOUND, `Post with id ${id} not found`);
  }
}

export default PostNotFoundException;
