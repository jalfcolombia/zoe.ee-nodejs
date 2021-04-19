// Librerías
import Zoe from '@core/zoe.module';
import { Transaction } from 'sequelize';

// Interfaces
import { IPostAsistenciaInvitadoDto } from '@assistance/interfaces/postAsistenciaInvitadoDto.interface';

// Modelos
import { Invitado } from '@assistance/models/base/invitado';

class InvitadoUpdateHook {
  public static async execute(asistenciaInput: IPostAsistenciaInvitadoDto): Promise<{ message: string }> {
    let transaction: Transaction | undefined;

    try {
      transaction = await new Zoe.SQLServer().connection.transaction();
      const response = { message: 'OK' };

      const invitado = await Invitado.findByPk(asistenciaInput.idInvitado);

      if (!invitado) throw new Zoe.HttpException(400, 'No existe un invitado con ese id');

      invitado.aprobado = asistenciaInput.acepto;
      invitado.correo = asistenciaInput.correo;

      await invitado.save({ transaction: transaction });

      await transaction.commit();
      return response;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}

export default InvitadoUpdateHook;
