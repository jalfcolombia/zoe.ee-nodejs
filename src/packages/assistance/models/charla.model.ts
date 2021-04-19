// Librerías
import Zoe from '@core/zoe.module';
import { QueryTypes, Sequelize } from 'sequelize';

// Base
import { Charla, CharlaAttributes } from './base/charla';

class CharlaModel extends Charla implements CharlaAttributes {
  private connection: Sequelize;
  private static instance: CharlaModel;

  constructor(connection?: Sequelize) {
    super();
    this.connection = connection || Zoe.SQLServer.getInstance().connection;
  }

  public static getInstance(): CharlaModel {
    if (!CharlaModel.instance) {
      CharlaModel.instance = new CharlaModel();
    }
    return CharlaModel.instance;
  }

  public static async getAllActiveCharlas(cache: Zoe.Cache): Promise<Charla[]> {
    const cacheName = `${this.name}.getAllActiveCharlas`;
    const cacheTime = 60;
    let listaCharlas: Array<Charla>;
    if ((await cache.has(cacheName)) === true) {
      listaCharlas = (await cache.get(cacheName)) as Array<Charla>;
    } else {
      listaCharlas = await CharlaModel.getInstance().connection.query(
        `SELECT id, nombre
        FROM asistencia.charla
        WHERE GETDATE() < DATEADD(MINUTE, tiempo_margen, fecha_fin)
        AND GETDATE() > fecha_inicio
        AND activated = 1
        AND deleted_at IS NULL`,
        {
          model: Charla,
          mapToModel: true,
          raw: true,
          type: QueryTypes.SELECT,
        },
      );
      await cache.set(cacheName, listaCharlas, cacheTime);
    }
    return listaCharlas;
  }
}

export { CharlaModel };
