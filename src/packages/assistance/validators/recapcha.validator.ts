// Librerías
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { Request, Response, NextFunction } from 'express';

export class RecapchaValidator {
  public static async validate(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPCHA_SECRET_KEY || '');
    params.append('response', request.body.recapcha);
    await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params })
      .then((answer) => {
        if (answer.statusText === 'OK') {
          return next();
        } else {
          return response.status(answer.status).json({ error: answer.statusText });
        }
      })
      .catch((error) => {
        return response.status(400).json(error);
      });
  }
}
