// Librerías
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { Op } from 'sequelize';
import neatCsv from 'neat-csv';
import Zoe from '@core/zoe.module';

// Interfaces
import { IAsistenciaReport } from '@assistance/interfaces/asistenciaReport.interface';

// Modelos
import { InvitadoModel } from '@assistance/models/invitado.model';
import { AsistenciaModel } from '@assistance/models/asistencia.model';

class AsistenciaGetReportHook {
  public static async execute(): Promise<IAsistenciaReport[]> {
    try {
      const list: IAsistenciaReport[] = [];
      const fsPromises = fs.promises;

      const pathConsolidadoFebrero = path.join(`${process.env.NODE_SERVER_ASSETS}/consolidado-febrero.csv`);
      const pathConsolidadoMarzo = path.join(`${process.env.NODE_SERVER_ASSETS}/consolidado-marzo.csv`);

      const consolidadoFebreroBuffer = await fsPromises.readFile(pathConsolidadoFebrero);
      const consolidadoMarzoBuffer = await fsPromises.readFile(pathConsolidadoMarzo);

      const febreroCsv = await neatCsv<IAsistenciaReport>(consolidadoFebreroBuffer, { separator: ';' });
      const marzoCsv = await neatCsv<IAsistenciaReport>(consolidadoMarzoBuffer, { separator: ';' });

      list.push(...febreroCsv);
      list.push(...marzoCsv);

      // Traer las charlas incluyendo las asistencias e invitados
      const resultInvitados = await InvitadoModel.findAll({
        include: ['charla', 'encuestum'],
        raw: true,
        nest: true,
        where: {
          deleted_at: {
            [Op.eq]: null,
          },
        },
        order: [['created_at', 'ASC']],
      });

      resultInvitados.forEach((invitado: InvitadoModel) => {
        const asistenciaReporte: IAsistenciaReport = {
          charla: invitado.charla.nombre,
          expositor: invitado.charla.expositor,
          fecha: moment(invitado.charla.fecha_inicio).format('YYYY-MM-DD'),
          tipo_documento: invitado.tipo_documento,
          documento: invitado.documento,
          correo: invitado.correo,
          invitado: 1,
          ficha: undefined,
          programa_formacion: undefined,
          codigo_centro: undefined,
          centro_formacion: undefined,
          regional: undefined,
          modalidad_formacion: undefined,
          tipo_programa: undefined,
          mes: Zoe.Dictionary.getMessage(`month${invitado.charla.fecha_inicio.getMonth()}`),
          usuarios_zoom: invitado.charla.usuarios_zoom,
          tipo_transferencia: invitado.charla.tipo_transferencia,
          publico: invitado.charla.publico,
          encuesta_respuesta: invitado.encuestum.pregunta,
          encuesta_respuesta_otro: invitado.encuesta_respuesta || '',
        };

        list.push(asistenciaReporte);
      });

      // Traer las charlas incluyendo las asistencias e invitados
      const resultAsistencias = await AsistenciaModel.findAll({
        include: 'charla',
        raw: true,
        nest: true,
        where: {
          deleted_at: {
            [Op.eq]: null,
          },
        },
        order: [['created_at', 'ASC']],
      });

      resultAsistencias.forEach((asistencia) => {
        const asistenciaReporte: IAsistenciaReport = {
          charla: asistencia.charla.nombre,
          expositor: asistencia.charla.expositor,
          fecha: moment(asistencia.charla.fecha_inicio).format('YYYY-MM-DD'),
          tipo_documento: asistencia.tipo_documento,
          documento: asistencia.documento,
          correo: asistencia.correo,
          invitado: 0,
          ficha: asistencia.ficha,
          programa_formacion: asistencia.programa_formacion,
          codigo_centro: asistencia.codigo_centro,
          centro_formacion: asistencia.centro_formacion,
          regional: asistencia.regional,
          modalidad_formacion: asistencia.modalidad_formacion
            ? Zoe.Dictionary.getMessage(`lmf${asistencia.modalidad_formacion}`)
            : undefined,
          tipo_programa: asistencia.tipo_programa
            ? Zoe.Dictionary.getMessage(`ltp${asistencia.tipo_programa}`)
            : undefined,
          mes: Zoe.Dictionary.getMessage(`month${asistencia.charla.fecha_inicio.getMonth()}`),
          usuarios_zoom: asistencia.charla.usuarios_zoom,
          tipo_transferencia: asistencia.charla.tipo_transferencia,
          publico: asistencia.charla.publico,
          encuesta_respuesta: '',
          encuesta_respuesta_otro: '',
        };

        list.push(asistenciaReporte);
      });

      return list;
    } catch (error) {
      throw error;
    }
  }
}

export default AsistenciaGetReportHook;
