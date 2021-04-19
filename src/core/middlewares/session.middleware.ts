import { Request, Response, NextFunction } from 'express';
import ZoeSession from '@core/providers/session.provider';

export class SessionMiddleware {
  public static init(request: Request, response: Response, next: NextFunction): void {
    request.zSession = new ZoeSession();
    next();
  }
}
