// Librerías
// import Zoe from '@core/zoe.module';
import { NextFunction, Request, Response } from 'express';

// Casos de uso
import { CharlaModel } from '@assistance/models/charla.model';

class CharlaController {
  public static async getCharlas(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      return response.status(200).json(await CharlaModel.getAllActiveCharlas(request.zCache));
      // return response.status(200).json({ msg: Zoe.Dictionary.getMessage(404, { str: 'hola mundo' }) });
      // return response.status(200).json({ msg: Zoe.Dictionary.getMessage('month0') });
    } catch (error) {
      next(error);
    }
  }
}

export default CharlaController;
