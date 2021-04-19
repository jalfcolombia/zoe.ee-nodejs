// Librerías
import stringify from 'csv-stringify';
import { NextFunction, Request, Response } from 'express';

// Interfaces
import { IPostEncuesta } from '../interfaces/postEncuesta.interface';
import { IPostAsistenciaDto } from '../interfaces/postAsistenciaDto.interface';
import { IPostAsistenciaInvitadoDto } from '../interfaces/postAsistenciaInvitadoDto.interface';

// Hooks
import EncuestaPostHook from '@assistance/controllers/hooks/encuesta.post.hook';
import InvitadoUpdateHook from '@assistance/controllers/hooks/invitado.update.hook';
import AsistenciaRegisgerHook from '@assistance/controllers/hooks/asistencia.register.hook';
import AsistenciaGetReportHook from '@assistance/controllers/hooks/asistencia.get-report.hook';

class AsistenciaController {
  /**
   * Reporta la asistencia de una persona en el sistema sea aprendiz o no
   * @param {Request} request - Request del sistema
   * @param {Response} response - Response del sistema
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}
   */
  public static async postAsistencia(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await AsistenciaRegisgerHook.setTransaction(await request.zSQLServerConnection.transaction());
      const message = await AsistenciaRegisgerHook.execute(request.body as IPostAsistenciaDto);
      return response.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registra la encuesta del usuario invitado
   * @param {Request} request - Request del sistema
   * @param {Response} response - Response del sistema
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}
   */
  public static async postEncuesta(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    try {
      const message = await EncuestaPostHook.execute(request.body as IPostEncuesta);
      return response.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza el correo de un invitado
   * @param {Request} request - Request del sistema
   * @param {Response} response - Response del sistema
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}
   */
  public static async postUpdateInvitado(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const message = await InvitadoUpdateHook.execute(request.body as IPostAsistenciaInvitadoDto);
      return response.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retorna un archivo CSV con toda la información de la asistencia
   * @param {Request} request - Request del sistema
   * @param {Response} response - Response del sistema
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}
   */
  public static async getReportAsistencia(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await AsistenciaGetReportHook.execute();

      response.setHeader('Content-Type', 'text/csv');
      response.setHeader('Content-Disposition', 'attachment; filename="' + 'download-' + Date.now() + '.csv"');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Pragma', 'no-cache');

      return stringify(result, { header: true, delimiter: ';' }).pipe(response);
    } catch (error) {
      next(error);
    }
  }
}

export default AsistenciaController;
