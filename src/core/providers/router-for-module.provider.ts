// Librerías
import { Router } from 'express';

/**
 * Clase abstracta del router para implementación del archivo de rutas de un módulo
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeRouterForModule {
  /**
   * Variable para el manejo del Router de Express
   * @public
   * @static
   * @type {Router}
   */
  public static router: Router = Router();

  /**
   * Obtiene las rutas establecidas
   * @method
   * @public
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public static getRoutes(): Router {
    this.defineRoutes();
    return ZoeRouterForModule.router;
  }

  /**
   * Define las rutas en un módulo
   * @method
   * @public
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public static defineRoutes(): void {
    throw new Error('Las rutas del módulo no se han definido.');
  }
}

export default ZoeRouterForModule;
