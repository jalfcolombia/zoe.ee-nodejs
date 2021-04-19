// Librerías
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Hooks
import MapErrorsHook from '@assistance/validators/hooks/map-errors.hook';

// NEGATIVO - status code 400 - Datos no validos
// {
//   error: {
//     idCharla: 'mensaje de error para el ID de la charla',
//     tipoDocumento: 'mensaje de error para el tipo de documento',
//     documento: 'mensaje de error para el documento',
//   }
// }
export class UpdateInvitadoValidator {
  public static async postUpdateInvitado(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const schema = Joi.object({
      idInvitado: Joi.string().guid().required(),
      correo: Joi.string().email().required(),
      acepto: Joi.boolean().required(),
    });

    const validationResult = schema.validate(request.body, { abortEarly: false });

    if (validationResult.error) {
      const errorResult = MapErrorsHook.execute(validationResult.error);
      return response.status(400).json({ error: errorResult });
    }

    return next();
  }
}
