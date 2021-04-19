// Librerías
import Joi from 'joi';
import Zoe from '@core/zoe.module';
import { Request, Response, NextFunction } from 'express';

// Hooks
import MapErrorsHook from '@assistance/validators/hooks/map-errors.hook';

export class EncuestaValidator {
  public static async validarEncuesta(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    let schema = Joi.object({
      idEncuesta: Joi.string()
        .guid()
        .required()
        .messages({
          'string.guid': Zoe.Dictionary.getMessage('uuidInvalid'),
        }),
      idInvitado: Joi.string()
        .guid()
        .required()
        .messages({
          'string.guid': Zoe.Dictionary.getMessage('uuidInvalid'),
        }),
      respuesta: Joi.allow(),
    });

    if (request.body.idEncuesta === process.env.ASISTENCIA_ENCUESTA_OTRO) {
      schema = schema.keys({
        respuesta: Joi.string()
          .trim()
          .required()
          .messages({
            'string.empty': Zoe.Dictionary.getMessage('validComment'),
          }),
      });
    }

    const validationResult = schema.validate(request.body, { abortEarly: false });

    if (validationResult.error) {
      const errorResult = MapErrorsHook.execute(validationResult.error);
      return response.status(400).json({ error: errorResult });
    }

    return next();
  }
}
