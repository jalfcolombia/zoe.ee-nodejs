// Librerías
import Zoe from '@core/zoe.module';

// Interfaces
import { IPostEncuesta } from '@assistance/interfaces/postEncuesta.interface';

// Modelos
import { Invitado } from '@assistance/models/base/invitado';

class EncuestaPostHook {
  public static async execute(datos: IPostEncuesta): Promise<{ message: string }> {
    const transaction = await new Zoe.SQLServer().connection.transaction();
    try {
      const response = { message: 'OK' };
      const invitado = await Invitado.findByPk(datos.idInvitado);
      if (!invitado) {
        throw new Zoe.HttpException(400, 'No existe un invitado con ese id');
      }
      invitado.encuesta_id = datos.idEncuesta;
      if (datos.respuesta !== null) {
        invitado.encuesta_respuesta = datos.respuesta;
      }
      await invitado.save({ transaction: transaction });
      await transaction.commit();
      return response;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }
}

export default EncuestaPostHook;
