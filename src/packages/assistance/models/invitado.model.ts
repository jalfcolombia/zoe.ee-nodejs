// Librerías
import Zoe from '@core/zoe.module';
import { Sequelize } from 'sequelize';

// Modelo base
import { Invitado, InvitadoAttributes } from './base/invitado';

class InvitadoModel extends Invitado implements InvitadoAttributes {
  private connection: Sequelize;
  private static instance: InvitadoModel;

  constructor() {
    super();
    this.connection = Zoe.SQLServer.getInstance().connection;
  }

  public static getInstance(): InvitadoModel {
    if (!InvitadoModel.instance) {
      InvitadoModel.instance = new InvitadoModel();
    }
    return InvitadoModel.instance;
  }
}

export { InvitadoModel };
