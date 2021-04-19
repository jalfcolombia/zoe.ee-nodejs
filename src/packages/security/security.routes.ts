// Librerías
import ZoeRouterForModule from '@core/providers/router-for-module.provider';

class SecurityRouter extends ZoeRouterForModule {
  public static defineRoutes(): void {
    throw new Error('Las rutas del módulo no se han definido.');
  }
}

export default SecurityRouter;
