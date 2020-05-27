import HttpException from './HttpException';

class ErrorWithPayload extends HttpException {
  constructor(status: number, message: string, payload?: any) {
    super(status, message, payload);
  }
}

export default ErrorWithPayload;
