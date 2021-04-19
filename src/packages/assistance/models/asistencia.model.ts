// Librerías
import Zoe from '@core/zoe.module';
import { Sequelize } from 'sequelize';

// Base
import { Asistencia, AsistenciaAttributes } from './base/asistencia';

class AsistenciaModel extends Asistencia implements AsistenciaAttributes {
  private connection: Sequelize;
  private static instance: AsistenciaModel;

  constructor() {
    super();
    this.connection = Zoe.SQLServer.getInstance().connection;
  }

  public static getInstance(): AsistenciaModel {
    if (!AsistenciaModel.instance) {
      AsistenciaModel.instance = new AsistenciaModel();
    }
    return AsistenciaModel.instance;
  }
}

export { AsistenciaModel };
