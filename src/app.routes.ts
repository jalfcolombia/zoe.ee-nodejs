// Librerías
import Zoe from '@core/zoe.module';
import ZoeRouter from '@core/providers/router.provider';

// Módulos
import AssistanceModule from '@assistance/assistance.module';

class AppRoutes extends ZoeRouter {
  public defineRoutes(): void {
    this.app.use('/api/v1/assistance', Zoe.GeneralValidator.isAjaxRequest, AssistanceModule.Router.getRoutes());
  }
}

export default AppRoutes;
