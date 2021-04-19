// Librerías
import ZoeRouterForModule from '@core/providers/router-for-module.provider';

// Middlewares
import InitModelMiddleware from '@assistance/middlewares/init-models.middleware';
import PowerBIMiddleware from '@assistance/middlewares/has-token-powerbi.middleware';

// Validadores
import { RecapchaValidator } from '@assistance/validators/recapcha.validator';
import { EncuestaValidator } from '@assistance/validators/encuesta.validator';
import { AsistenciaValidator } from '@assistance/validators/asistencia.validator';
import { UpdateInvitadoValidator } from '@assistance/validators/update-invitado.validator';

// Controladores
import CharlaController from '@assistance/controllers/charla.controller';
import AsistenciaController from '@assistance/controllers/asistencia.controller';

class RouterAssistance extends ZoeRouterForModule {
  /**
   * Definición de rutas del módulo assistance
   */
  public static defineRoutes(): void {
    /**
     * Devuelve las charlas disponibles
     */
    RouterAssistance.router.get('/charlas', InitModelMiddleware.init, CharlaController.getCharlas);

    /**
     * Reporta la asistencia de una persona en el sistema sea aprendiz o no
     */
    RouterAssistance.router.post(
      '/asistencia',
      AsistenciaValidator.postAsistencia,
      RecapchaValidator.validate,
      AsistenciaController.postAsistencia,
    );

    /**
     * Actualiza el correo de un invitado
     */
    RouterAssistance.router.post(
      '/asistencia/invitado',
      UpdateInvitadoValidator.postUpdateInvitado,
      AsistenciaController.postUpdateInvitado,
    );

    /**
     * Registra la respuesta de la encuesta a un invitado
     */
    RouterAssistance.router.post('/encuesta', EncuestaValidator.validarEncuesta, AsistenciaController.postEncuesta);

    /**
     * Retorna un archivo CSV con toda la información de la asistencia
     */
    RouterAssistance.router.get('/asistencia', PowerBIMiddleware.hasToken, AsistenciaController.getReportAsistencia);
  }
}

export default RouterAssistance;
