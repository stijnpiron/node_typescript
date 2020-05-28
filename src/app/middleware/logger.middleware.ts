import { stringContainsElementOfArray } from './../utils/utils';
import { NextFunction, Request, Response } from 'express';

/**
 * loggerMiddleware:
 *  Middleware that logs all requests to the console in the dev environment.
 *  When there are paths provided in the ignorePaths, requests to these paths will be ignored and not be printed to the console
 * @param {Array.string} ignorePaths Paths to ignore by loggerMiddleware
 */
const loggerMiddleware = (ignorePaths?: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!ignorePaths || (!stringContainsElementOfArray(req.path, ignorePaths) && process.env.NODE_ENV === 'development')) {
      console.info(`${req.method} ${req.path}`);
    }
    next();
  };
};

export default loggerMiddleware;
