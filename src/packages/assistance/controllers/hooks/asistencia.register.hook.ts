// Librerías
// import moment from 'moment';
import Zoe from '@core/zoe.module';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';

// Modelos
import { CharlaModel } from '@assistance/models/charla.model';
import { InvitadoModel } from '@assistance/models/invitado.model';
import { AsistenciaModel } from '@assistance/models/asistencia.model';
import { UserSofiaPlusModel } from '@assistance/models/userSofiaPlus.model';
import { EncuestaInvitadoModel } from '@assistance/models/encuesta-invitado.model';
import { Invitado, InvitadoCreationAttributes } from '@assistance/models/base/invitado';
import { Asistencia, AsistenciaCreationAttributes } from '@assistance/models/base/asistencia';

// Interfaces
import { IUserSofiaPlus } from '@assistance/interfaces/userSofiaPlus.interface';
import { IPostAsistenciaDto } from '@assistance/interfaces/postAsistenciaDto.interface';

class AsistenciaRegisgerHook {
  private static transaction: Transaction;

  public static setTransaction(transaction: Transaction): void {
    AsistenciaRegisgerHook.transaction = transaction;
  }

  public static async execute(
    asistenciaInput: IPostAsistenciaDto,
  ): Promise<{ message: string; id?: string; encuesta?: EncuestaInvitadoModel[] }> {
    const registrarAsistenciaInstance = new AsistenciaRegisgerHook();
    try {
      const listUsersSofiaPlus = await UserSofiaPlusModel.getAllByIdAndType(
        asistenciaInput.documento,
        asistenciaInput.tipoDocumento,
      );
      const charla = await CharlaModel.findByPk(asistenciaInput.idCharla);

      if (!charla) {
        throw new Zoe.HttpException(400, 'No existe una charla con ese id');
      }

      let response;

      if (listUsersSofiaPlus && listUsersSofiaPlus.length > 0) {
        // EJECUTAR ACCION PARA REGISTRADOS EN SOFIA
        // POSITIVO - status code 200 - Registrado en SOFIA Plus
        // {
        //   message: 'OK'
        // }
        await registrarAsistenciaInstance.addUserAssistance(
          asistenciaInput,
          listUsersSofiaPlus,
          AsistenciaRegisgerHook.transaction,
        );
        response = { message: 'OK' };
      } else {
        // EJECUTAR ACCION PARA INVITADOS
        // POSITIVO - status code 200 - Invitado
        // {
        //   id: string -- 4B900A74-E2D9-4837-B9A4-9E828752716E
        //   message: 'invitado'
        // }
        const usuarioInvitado = await registrarAsistenciaInstance.addGuestAssistance(asistenciaInput);
        const encuesta = await EncuestaInvitadoModel.findAll({
          attributes: ['id', 'pregunta'],
          raw: true,
          order: [['orden', 'ASC']],
        });
        response = { id: usuarioInvitado.id, message: 'invitado', encuesta };
      }

      await AsistenciaRegisgerHook.transaction.commit();

      return response;
    } catch (error) {
      if (AsistenciaRegisgerHook.transaction) {
        await AsistenciaRegisgerHook.transaction.rollback();
      }
      throw error;
    }
  }

  // /**
  //  * Si el invitado existe, entonces se actualiza el correo del invitado y
  //  * si aprueba el uso de su correo para envio de información en el SENA
  //  * @param {IAsistenciaInvitadoDto} asistenciaInput - La información que envia el usuario en el body de la petición POST
  //  * @returns {Promise<{ message: string }>} - Un mensaje OK
  //  */
  // public async addInvitado(asistenciaInput: IAsistenciaInvitadoDto): Promise<{ message: string }> {
  //   let transaction: Transaction | undefined;

  //   try {
  //     transaction = await new Zoe.SQLServer().connection.transaction();
  //     const response = { message: 'OK' };

  //     const invitado = await InvitadoModel.findByPk(asistenciaInput.idInvitado);

  //     if (!invitado) throw new Zoe.HttpException(400, 'No existe un invitado con ese id');

  //     invitado.aprobado = asistenciaInput.acepto;
  //     invitado.correo = asistenciaInput.correo;

  //     await invitado.save({ transaction: transaction });

  //     await transaction.commit();
  //     return response;
  //   } catch (error) {
  //     if (transaction) await transaction.rollback();
  //     throw error;
  //   }
  // }

  /**
   * Si el usuario ya se encuentra registrado en SOFIA se debe añadir a la tabla de asistencia
   * si el usuario tiene algún curso en estado 'Matriculado' se guarda toda la información
   * en caso contrario solo se registra el documento, tipo de documento y correo
   * @param {IPostAsistenciaDto} asistenciaInput - Id de la charla, documento y tipo de documento
   * @param {IUserSofiaPlus[]} listUsersSofiaPlus - Los datos que devuelve Oracle sin mapear
   * @param {Transaction} transaction
   * @returns {Promise<void>}
   */
  private async addUserAssistance(
    asistenciaInput: IPostAsistenciaDto,
    listUsersSofiaPlus: IUserSofiaPlus[],
    transaction: Transaction,
  ): Promise<void> {
    // Revisar si ya esta registrado en la tabla de asistencia
    const isRegistered = await AsistenciaModel.findOne({
      where: {
        charla_id: asistenciaInput.idCharla,
        tipo_documento: asistenciaInput.tipoDocumento,
        documento: asistenciaInput.documento,
      },
    });

    if (isRegistered) throw new Zoe.HttpException(403, 'El usuario ya registró su asistencia a la charla');

    const listaCursosEstadoMatriculado = this.getCursosEstadoMatriculado(listUsersSofiaPlus);

    if (listaCursosEstadoMatriculado.length > 0) {
      // Buscar el curso donde esta matriculado teniendo en cuenta la prioridad de cursos
      const usuario: IUserSofiaPlus = this.getCursoMatricula(listaCursosEstadoMatriculado);

      // Guardar la información del estudiante y el curso (Tabla asistencia)
      const attrAsistencia: AsistenciaCreationAttributes = {
        id: uuidv4(),
        charla_id: asistenciaInput.idCharla,
        ficha: usuario.FICHA,
        tipo_documento: usuario.TIPO_DOCUMENTO,
        documento: usuario.DOCUMENTO,
        correo: usuario.CORREO || undefined,
        programa_formacion: usuario.PROGRAMA_FORMACION,
        codigo_centro: usuario.CODIGO_CENTRO,
        centro_formacion: usuario.NOMBRE_CENTRO,
        regional: usuario.REGIONAL,
        modalidad_formacion: usuario.MODALIDAD_FORMACION,
        tipo_programa: usuario.TIPO_PROGRAMA,
      };
      await Asistencia.create(attrAsistencia, {
        transaction: transaction,
      });
    } else {
      // Guardar la información del estudiante, unicamente correo, documento, tipoDocumento (Tabla asistencia)
      const attrAsistencia: AsistenciaCreationAttributes = {
        id: uuidv4(),
        charla_id: asistenciaInput.idCharla,
        tipo_documento: asistenciaInput.tipoDocumento,
        documento: asistenciaInput.documento,
        correo: listUsersSofiaPlus[0].CORREO || undefined,
      };
      await Asistencia.create(attrAsistencia, {
        transaction: transaction,
      });
    }
  }

  /**
   * Si el usuario tiene cursos en estado 'Matriculado' se debe seleccionar uno
   * teniendo en cuenta la siguiente combinación de prioridades
   * TIPO_PROGRAMA | MODALIDAD_FORMACIÓN
   * T | V
   * C | V
   * T | P
   * C | P
   * @param {IUserSofiaPlus[]} listUsers - Lista de usuarios IUserSofiaPlus
   * @returns {IUserSofiaPlus} - Devuelve un objeto de tipo IUserSofiaPlus
   */
  private getCursoMatricula(listUsers: IUserSofiaPlus[]): IUserSofiaPlus {
    // T V
    const userTituladaVirtual = listUsers.find((user) => {
      if (user.TIPO_PROGRAMA === 'T' && user.MODALIDAD_FORMACION === 'V') {
        return user;
      }
    });

    if (userTituladaVirtual) return userTituladaVirtual;

    // C V
    const userComplementariaVirtual = listUsers.find((user) => {
      if (user.TIPO_PROGRAMA === 'C' && user.MODALIDAD_FORMACION === 'V') {
        return user;
      }
    });

    if (userComplementariaVirtual) return userComplementariaVirtual;

    // T P
    const userTituladaPresencial = listUsers.find((user) => {
      if (user.TIPO_PROGRAMA === 'T' && user.MODALIDAD_FORMACION === 'P') {
        return user;
      }
    });

    if (userTituladaPresencial) return userTituladaPresencial;

    // C P
    const userComplementariaPresencial = listUsers.find((user) => {
      if (user.TIPO_PROGRAMA === 'C' && user.MODALIDAD_FORMACION === 'P') {
        return user;
      }
    });

    if (userComplementariaPresencial) return userComplementariaPresencial;

    // default
    return listUsers[0];
  }

  private getCursosEstadoMatriculado(listUsers: IUserSofiaPlus[]): IUserSofiaPlus[] {
    return listUsers.filter((user) => {
      return user.ESTADO_APRENDIZ_EN_FICHA === 'Matriculado';
    });
  }

  /**
   * Al no estar registrado en SOFIA se añade a la tabla de invitados
   * @param {IPostAsistenciaDto} asistenciaInput - Id de la charla, documento y tipo de documento
   * @returns {Promise<Invitado>} - El nuevo usuario creado en la tabla de invitados
   */
  private async addGuestAssistance(asistenciaInput: IPostAsistenciaDto): Promise<Invitado> {
    // Revisar si ya esta registrado en la tabla de invitados
    const isRegistered = await InvitadoModel.findOne({
      where: {
        charla_id: asistenciaInput.idCharla,
        tipo_documento: asistenciaInput.tipoDocumento,
        documento: asistenciaInput.documento,
      },
    });

    if (isRegistered) throw new Zoe.HttpException(403, 'El usuario ya registró su asistencia a la charla');

    const attrInvitado: InvitadoCreationAttributes = {
      id: uuidv4(),
      charla_id: asistenciaInput.idCharla,
      tipo_documento: asistenciaInput.tipoDocumento,
      documento: asistenciaInput.documento,
      aprobado: false,
    };
    const newInvitado = await Invitado.create(attrInvitado, {
      transaction: AsistenciaRegisgerHook.transaction,
    });

    return newInvitado;
  }
}

export default AsistenciaRegisgerHook;
