// Librerías
import Zoe from '@core/zoe.module';
import { ValidationError } from 'joi';

class MapErrorsHook {
  public static execute(error: ValidationError): Zoe.IMessageDictionary {
    const errorResult: Zoe.IMessageDictionary = {};
    error.details.forEach((detail) => {
      if (detail.context && detail.context.label) {
        errorResult[detail.context.label] = detail.message;
      }
    });
    return errorResult;
  }
}

export default MapErrorsHook;
