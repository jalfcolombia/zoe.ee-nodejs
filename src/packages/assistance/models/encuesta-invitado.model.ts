// Librerías
import Zoe from '@core/zoe.module';
import { Sequelize } from 'sequelize';

// Base
import { EncuestaInvitado, EncuestaInvitadoAttributes } from './base/encuesta_invitado';

class EncuestaInvitadoModel extends EncuestaInvitado implements EncuestaInvitadoAttributes {
  private connection: Sequelize;
  private static instance: EncuestaInvitado;

  constructor() {
    super();
    this.connection = Zoe.SQLServer.getInstance().connection;
  }

  public static getInstance(): EncuestaInvitado {
    if (!EncuestaInvitadoModel.instance) {
      EncuestaInvitadoModel.instance = new EncuestaInvitadoModel();
    }
    return EncuestaInvitadoModel.instance;
  }
}

export { EncuestaInvitadoModel };
