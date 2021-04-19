// Librerías
import { Application } from 'express';
import ZoeHttpException from '@core/exceptions/HttpException';

/**
 * Clase router para implementación del archivo de rutas
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeRouter {
  /**
   * Variable para el manejo de la instancia de Aplicación de Express
   * @protected
   * @type {Application}
   */
  protected app: Application;

  /**
   * Router para implementación del archivo de rutas
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   * @param {Application} app - Variable para el manejo de la instancia de Aplicación de Express
   */
  constructor(app: Application) {
    this.app = app;
    this.defineRoutes();
  }

  /**
   * Obtiene las rutas establecidas
   * @method
   * @public
   * @since 0.0.1
   * @version 0.0.1
   * @returns {Application} - Devuelve la instancia de la aplicación con las rutas principales del sistema
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public getRoutes(): Application {
    return this.app;
  }

  /**
   * Define las rutas del sistema principal
   * @method
   * @public
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public defineRoutes(): void {
    throw new ZoeHttpException(500.1, 'No ha definido las rutas principales del sistema');
  }
}

export default ZoeRouter;
