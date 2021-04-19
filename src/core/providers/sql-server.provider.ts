// Librerías
import { Sequelize, DataTypes } from 'sequelize';

/**
 * Clase para manejar la conexión a SQL Server
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeSQLServer {
  /**
   * Variable para manejar la conexión a la base de datos con Sequelize
   * @public
   * @type {Sequelize}
   */
  public connection: Sequelize;

  /**
   * Instancia para manejar la conexión a la base de datos con Sequelize
   * @private
   * @static
   * @type {ZoeSQLServer}
   */
  private static instance: ZoeSQLServer;

  /**
   * Manejar la conexión a SQL Server
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public constructor() {
    this.solveDatesIssueCompatibilityWithMSSQL();
    const connection = new Sequelize({
      host: process.env.SQLSERVER_HOST,
      port: Number(process.env.SQLSERVER_PORT) || 1433,
      database: process.env.SQLSERVER_DATABASE,
      username: process.env.SQLSERVER_USERNAME,
      password: process.env.SQLSERVER_PASSWORD,
      dialect: 'mssql',
      timezone: process.env.TZ,
      dialectOptions: {
        options: {
          instanceName: 'MSSQLSERVER',
          cryptoCredentialsDetails: {
            minVersion: 'TLSv1',
          },
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000,
        evict: 1000,
      },
    });
    this.connection = connection;
    this.authenticate();
  }

  /**
   * Método para testear la conexión a la base de datos
   * @method
   * @public
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public authenticate(): void {
    this.connection
      .authenticate()
      .then(() => console.log('✅ Se conecto exitosamente a SQL Server'))
      .catch(() => console.log('❌ Error al conectarse a SQL Server'));
  }

  /**
   * Método para manejar la instancia de la conexión a la base de datos con Sequelize
   * @method
   * @public
   * @returns {ZoeSQLServer}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public static getInstance(): ZoeSQLServer {
    if (!ZoeSQLServer.instance) {
      ZoeSQLServer.instance = new ZoeSQLServer();
    }
    return ZoeSQLServer.instance;
  }

  /**
   * Solve dates issue compatibility with MSSQL
   * @method
   * @private
   * @version 0.0.1
   * @author David Sanchez <david.sanchezm@misena.edu.co>
   */
  private solveDatesIssueCompatibilityWithMSSQL(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DataTypes.DATE.prototype._stringify = function (date: any, options: any): void {
      date = this._applyTimezone(date, options);
      return date.format('YYYY-MM-DD HH:mm:ss.SSS');
    }.bind(DataTypes.DATE.prototype);
  }
}

export default ZoeSQLServer;
