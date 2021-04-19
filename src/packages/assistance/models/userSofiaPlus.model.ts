// Librerías
import Zoe from '@core/zoe.module';

// Interfaces
import { IObjectKeys } from '../interfaces/object-keys.interface';
import { IUserSofiaPlus } from '../interfaces/userSofiaPlus.interface';

class UserSofiaPlusModel {
  public static async getAllByIdAndType(documento: string, tipoDocumento: string): Promise<IUserSofiaPlus[]> {
    const oracle = await Zoe.OracleServer.getInstance().connection;
    const result = await oracle.execute<IObjectKeys>(
      `SELECT
          a.tipo_documento              AS tipo_documento,
          a.num_doc_identidad           AS documento,
          b.asp_correo_e                AS correo,
          d.fic_id                      AS ficha,
          f.prf_denominacion            AS programa_formacion,
          g.SED_ID             AS codigo_centro,
          g.sed_nombre                  AS nombre_centro,
          h.rgn_nombre                  AS regional,
          e.fic_mod_formacion           AS modalidad_formacion,
          f.prf_tipo_programa           AS tipo_programa,
          CASE d.ing_estado
              WHEN 3 THEN 'No admitido'
              WHEN 4 THEN 'Matricula Anulada'
              WHEN 6 THEN 'Matriculado'
              WHEN 8 THEN 'Seleccionado'
              WHEN 9 THEN 'No Seleccionado'
              WHEN 11 THEN 'Inscripción Anulada'
              WHEN 14 THEN 'Convocado Matrícula'
              WHEN 18 THEN 'Cancelado'
              WHEN 20 THEN 'Aplazado'
              WHEN 21 THEN 'Retiro Voluntario'
              WHEN 22 THEN 'Cancelado Académico'
              WHEN 7 THEN 'Preinscrito'
              WHEN 16 THEN 'Certificado'
              WHEN 17 THEN 'Trasladado'
              WHEN 25 THEN 'Retiro Voluntario'
              WHEN 29 THEN 'No admitido segunda opción'
              WHEN 31 THEN 'Inscripción no autorizada'
              ELSE TO_CHAR(d.ing_estado)
          END                           AS estado_aprendiz_en_ficha
      FROM
          comun.datos_basicos_usuario                      a
          INNER JOIN integracion.aspirante_av              b ON b.nis = a.nis
          INNER JOIN inscripcion.ingreso_aspirante         d ON d.nis = a.nis
          INNER JOIN PLANFORMACION.ficha_caracterizacion   e ON e.fic_id = d.fic_id
          INNER JOIN DISENIOCUR.programa_formacion         f ON f.prf_id = e.prf_id
          INNER JOIN catalogo.sede                         g ON g.sed_id = e.sed_id
          INNER JOIN catalogo.regional                     h ON h.rgn_id = e.rgn_id
      WHERE a.tipo_documento = :tipoDocumento
      AND a.num_doc_identidad = :documento`,
      { tipoDocumento: tipoDocumento, documento: documento },
    );

    if (result.rows) {
      const userSofiaModel = new UserSofiaPlusModel();
      const resultDto = userSofiaModel.mapToUserSofiaPlus(result.rows);
      return resultDto;
    }
    return [];
  }

  private mapToUserSofiaPlus(result: IObjectKeys[]): IUserSofiaPlus[] {
    const listUsers: IUserSofiaPlus[] = [];

    result.forEach((row) => {
      const user: IUserSofiaPlus = {
        TIPO_DOCUMENTO: row[0],
        DOCUMENTO: row[1],
        CORREO: row[2],
        FICHA: Number(row[3]),
        PROGRAMA_FORMACION: row[4],
        CODIGO_CENTRO: Number(row[5]),
        NOMBRE_CENTRO: row[6],
        REGIONAL: row[7],
        MODALIDAD_FORMACION: row[8],
        TIPO_PROGRAMA: row[9],
        ESTADO_APRENDIZ_EN_FICHA: row[10],
      };
      listUsers.push(user);
    });

    return listUsers;
  }
}

export { UserSofiaPlusModel };
