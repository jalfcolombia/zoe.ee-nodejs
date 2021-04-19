// Librerías
import { Request, Response, NextFunction } from 'express';

// Modelos
import { initModels } from '../models/base/init-models';

class InitModelMiddleware {
  public static init(request: Request, response: Response, next: NextFunction): void {
    initModels(request.zSQLServerConnection);
    next();
  }
}

export default InitModelMiddleware;
