// Librerías
import Joi, { ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';

// Interfaces
import { IAsistenciaDto } from '@assistance/interfaces/postAsistenciaDto.interface';

interface IpostAsistenciaError {
  [key: string]: string;
}

// NEGATIVO - status code 400 - Datos no validos
// {
//   error: {
//     idCharla: 'mensaje de error para el ID de la charla',
//     tipoDocumento: 'mensaje de error para el tipo de documento',
//     documento: 'mensaje de error para el documento',
//   }
// }
export class AsistenciaValidator {
  public static async postAsistencia(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const schema = Joi.object({
      idCharla: Joi.string().guid().required(),
      tipoDocumento: Joi.string().valid('CC', 'TI', 'CE', 'NCS', 'PS', 'PR', 'PEP').min(1).max(10).required(),
      documento: Joi.number().prefs({ convert: false }).required(),
      // documentoConfirm: Joi.ref('documento'),
      documentoConfirm: Joi.number().prefs({ convert: false }).valid(Joi.ref('documento')).required(),
      // documento: Joi.string().regex(new RegExp(/^\d+$/)).required(),
      // documentoConfirm: Joi.string().regex(new RegExp(/^\d+$/)).valid(Joi.ref('documento')).required(),
      recaptcha: process.env.NODE_SERVER_SCOPE === 'development' ? Joi.allow() : Joi.string().required(),
    });

    const validationResult = schema.validate(request.body, { abortEarly: false });

    const asistenciaValidatorInstance = new AsistenciaValidator();

    if (validationResult.error) {
      const errorResult = asistenciaValidatorInstance.mapErrors(validationResult.error);
      return response.status(400).json({ error: errorResult });
    }

    const bodyRequest: IAsistenciaDto = request.body;
    if (asistenciaValidatorInstance.isNumeric(Number(bodyRequest.documento))) {
      bodyRequest.documento = bodyRequest.documento.toString();
    }

    return next();
  }

  private isNumeric(n: number): boolean {
    return typeof n == 'number' && !isNaN(n);
  }

  private mapErrors(error: ValidationError): IpostAsistenciaError {
    const errorResult: IpostAsistenciaError = {};
    error.details.forEach((detail) => {
      if (detail.context && detail.context.label) {
        errorResult[detail.context.label] = detail.message;
      }
    });
    return errorResult;
  }
}
