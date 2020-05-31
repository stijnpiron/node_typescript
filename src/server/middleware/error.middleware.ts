import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';

function errorMiddleware(err: HttpException, _: Request, res: Response, __: NextFunction): void {
  const code = err.status || INTERNAL_SERVER_ERROR;
  const type = getStatusText(code);
  const message = err.message || 'Something went wrong';
  const data = err.payload || undefined;
  res.status(code).send({ code, type, message, data });
}

export default errorMiddleware;
