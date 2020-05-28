import HttpException from './HttpException';

class ExceptionWithPayload extends HttpException {
  constructor(status: number, message: string, payload?: any) {
    super(status, message, payload);
  }
}

export default ExceptionWithPayload;
