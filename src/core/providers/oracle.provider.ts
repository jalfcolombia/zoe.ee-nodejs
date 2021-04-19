// Librerías
import oracledb, { Connection, Pool, PoolAttributes } from 'oracledb';

/**
 * Clase para manejar la conexión a Oracle
 * @class
 * @version 0.0.2
 * @author David Sanchez <david.sanchezm@misena.edu.co>
 */
class ZoeOracleServer {
  /**
   * Variable para manejar la persistencia en Oracle
   * @private
   * @type {Promise<Pool>}
   * @since 0.0.2
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private pool: Promise<Pool>;

  /**
   * Variable para manejar la conexión a Oracle
   * @private
   * @type {Promise<Connection>}
   * @since 0.0.1
   * @version 0.0.1
   * @author David Sanchez <david.sanchezm@misena.edu.co>
   */
  public connection: Promise<Connection>;

  /**
   * Variable para manejar la instancia de ZoeOracleServer
   * @private
   * @type {ZoeOracleServer}
   * @since 0.0.1
   * @version 0.0.1
   * @author David Sanchez <david.sanchezm@misena.edu.co>
   */
  private static instance: ZoeOracleServer;

  /**
   * Maneja la conexión a Oracle
   * @constructor
   * @since 0.0.1
   * @version 0.0.2
   * @author David Sanchez <david.sanchezm@misena.edu.co>
   */
  public constructor() {
    oracledb.initOracleClient({ libDir: process.env.ORACLEDB_CLIENT });
    const dbConfig = {
      user: process.env.ORACLEDB_USER,
      password: process.env.ORACLEDB_PASSWORD,
      connectString: process.env.ORACLEDB_CONNECTION_STRING,
      poolMin: 1,
      poolMax: 1,
      poolIncrement: 0,
      poolTimeout: 60,
    };
    this.pool = this.createPool(dbConfig);
    this.connection = this.getConnection();
  }

  /**
   * Devuelve la instancia de ZoeOracleServer
   * @method
   * @public
   * @returns {ZoeOracleServer}
   * @since 0.0.1
   * @version 0.0.1
   * @author David Sanchez <david.sanchezm@misena.edu.co>
   */
  public static getInstance(): ZoeOracleServer {
    if (!ZoeOracleServer.instance) {
      ZoeOracleServer.instance = new ZoeOracleServer();
    }
    return ZoeOracleServer.instance;
  }

  /**
   * Crea la conexión de tipo Pool para temas de persistencia
   * @method
   * @private
   * @param {PoolAttributes} dbConfig - Objeto de configuración de Oracle
   * @returns {Promise<Pool>}
   * @since 0.0.2
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private async createPool(dbConfig: PoolAttributes): Promise<Pool> {
    return await oracledb.createPool(dbConfig);
  }

  /**
   * Devuelve la conexión a Oracle
   * @method
   * @private
   * @returns {Promise<Connection>}
   * @since 0.0.2
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private async getConnection(): Promise<Connection> {
    return (await this.pool).getConnection();
  }
}

export default ZoeOracleServer;
