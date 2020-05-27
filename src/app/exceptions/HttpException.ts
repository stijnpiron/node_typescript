import { getStatusText } from 'http-status-codes';

class HttpException extends Error {
  public status: number;
  public message: string;
  payload: any;

  constructor(status: number, message: string, payload?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.payload = payload;
  }
}

export default HttpException;
