/* eslint-disable @typescript-eslint/no-explicit-any */

// Librerías
import { NextFunction, Request, Response } from 'express';
import ZoeHttpException from '@core/exceptions/HttpException';

class ZoeGeneralValidator {
  public static isAjaxRequest(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<Response | void> | void {
    try {
      if (request.xhr === false && process.env.NODE_SERVER_SCOPE === 'prod') {
        throw new ZoeHttpException(404);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default ZoeGeneralValidator;
