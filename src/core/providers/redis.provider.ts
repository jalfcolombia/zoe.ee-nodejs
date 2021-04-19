/* eslint-disable @typescript-eslint/ban-types */

// Librerías
import { Tedis } from 'tedis';
import { IRedisOptions } from '@core/interfaces/redis-options.interface';

/**
 * Clase para el manejo de Redis
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeRedisServer {
  /**
   * Variable para manejar la conexión a Redis
   * @private
   * @type {Tedis}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private connection!: Tedis;

  /**
   * Variable para manejar las opciones de conexión a Redis
   * @private
   * @type {IRedisOptions}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private options: IRedisOptions;

  /**
   * Instancia para manejar la conexión a Redis
   * @private
   * @static
   * @type {ZoeRedisServer}
   */
  private static instance: ZoeRedisServer;

  /**
   * Manejo de Redis
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public constructor() {
    this.options = {
      host: String(process.env.REDIS_HOST) || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    };
    this.connection = new Tedis(this.options);
    this.connection.on('connect', () => {
      console.log('✅ Se conecto exitosamente a Redis Server');
      this.selectDB(process.env.REDIS_DB || 0);
    });
    this.connection.on('error', (error: Error) => {
      console.log(error);
    });
  }

  /**
   * Método para manejar la instancia de la conexión a Redis
   * @method
   * @public
   * @returns {ZoeRedisServer}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public static getInstance(): ZoeRedisServer {
    if (!ZoeRedisServer.instance) {
      ZoeRedisServer.instance = new ZoeRedisServer();
    }
    return ZoeRedisServer.instance;
  }

  /**
   * Selecciona una base de datos
   * @param {string | number} db - Número de la base de datos
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async selectDB(db: string | number): Promise<void> {
    await this.command('SELECT', db);
  }

  /**
   * Ejecuta un comando de Redis
   * @param {Array<string | number>} parameters - Comando y parámetros del comando a ejecutar
   * @returns {Promise<unknown>} - Respuesta del comando ejecutado
   * @see https://tedis.silkjs.org/api/base.html#command
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async command(...parameters: Array<string | number>): Promise<unknown> {
    return await this.connection.command(...parameters);
  }

  /**
   * Crea o reemplaza el valor de una llave
   * @param {string} key - Nombre de la llave
   * @param {number | string | boolean | Array<unknown> | object} value - Valor de la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async set(key: string, value: number | string | boolean | Array<unknown> | object): Promise<void> {
    const tmp = this.dataToString(value);
    await this.connection.set(key, tmp);
  }

  /**
   * Obtiene el valor de una llave
   * @param {string} key - Nombre de la llave
   * @returns {Promise<number | string | boolean | Array<unknown> | object>} - Contenido de la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async get(key: string): Promise<number | string | boolean | Array<unknown> | object> {
    return this.stringtoData(String(await this.connection.get(key)));
  }

  /**
   * Determina la existencia de una llave
   * @param {string} key - Nombre de la llave
   * @returns {Promise<boolean>} - Falso o Verdadero si existe o no la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async has(key: string): Promise<boolean> {
    return ((await this.connection.exists(key)) as number) === 1 ? true : false;
  }

  /**
   * Registra el tiempo de expiración de una llave en segundos
   * @param {string} key - Nombre de la llave
   * @param {number} seconds - Tiempo de expiración en segundos
   * @returns {Promise<boolean>} - Falso o Verdadero si el tiempo de expiración fue registrado
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async expire(key: string, seconds: number): Promise<boolean> {
    return ((await this.connection.expire(key, seconds)) as number) === 1 ? true : false;
  }

  /**
   * Borra una o varias llaves
   * @param {string} key - Nombre de la llave
   * @param {string[]} keys - Arreglo con nombre de las llaves
   * @returns {Promise<boolean>} - Falso o Verdadero si se pudo o no eliminar la o las llaves indicadas
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async delete(key: string, ...keys: string[]): Promise<boolean> {
    return ((await this.connection.del(key, ...keys)) as number) >= 1 ? true : false;
  }

  /**
   * Crea un listado o lo reemplaza junto a su contenido
   * @param {String} key - Nombre del listado
   * @param {{ [propName: string]: number | string | boolean | Array<unknown> | object }} hash - Contenido del listado tipo objeto
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async hmset(
    key: string,
    hash: { [propName: string]: number | string | boolean | Array<unknown> | object },
  ): Promise<void> {
    await this.connection.hmset(key, this.dataToStringForHash(hash));
  }

  /**
   * Crea un listado con el contenido dado o reemplaza el contenido de un campo si el listado ya existe
   * @param {string} key - Nombre del listado
   * @param {string} field - Nombre del campo
   * @param {number | string | boolean | Array<unknown> | object} value - Valor para el campo
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async hset(
    key: string,
    field: string,
    value: number | string | boolean | Array<unknown> | object,
  ): Promise<boolean> {
    return ((await this.connection.hset(key, field, this.dataToString(value))) as number) >= 1 ? true : false;
  }

  /**
   * Devuele el contenido de un campo en una llave
   * @param {string} key - Nombre de la llave
   * @param {string} field - Nombre del campo
   * @returns {Promise<number | string | boolean | Array<unknown> | object>} - Contenido del campo en la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async hmget(key: string, field: string): Promise<number | string | boolean | Array<unknown> | object> {
    return this.stringtoData(String(await this.connection.hmget(key, field)));
  }

  /**
   * Borra el connection de un campo o varios campos de una llave
   * @param {string} key - Nombre de la llave
   * @param {string} field - Nombre del campo
   * @param {string[]} fields - Arreglo con los nombres de los campos
   * @returns {Promise<boolean>} - Falso o Verdadero si fue posible borrar o no el o los campos de la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async hdelete(key: string, field: string, ...fields: string[]): Promise<boolean> {
    return ((await this.connection.hdel(key, field, ...fields)) as number) >= 1 ? true : false;
  }

  /**
   * Determina la existencia de un campo en la llave
   * @method
   * @public
   * @param {string} key - Nombre de la llave
   * @param {string} field - Nombre del campo
   * @returns {Promise<boolean>} - Falso o Verdadero si el campo existe o no en la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async hhas(key: string, field: string): Promise<boolean> {
    return ((await this.connection.hexists(key, field)) as number) === 1 ? true : false;
  }

  /**
   * Devuelve un objeto con el contenido de una llave
   * @method
   * @public
   * @param key - Nombre de la llave
   * @returns {Promise<{ [propName: string]: string }>} - Objeto con el contenido de la llave
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async hgetall(key: string): Promise<{ [propName: string]: string }> {
    return await this.connection.hgetall(key);
  }

  /**
   * Convierte un objeto en una cadena de caracteres
   * @method
   * @private
   * @param {{[propName: string]: number | string | boolean | Array<unknown> | object}} hash - Objeto con campos y valores
   * @returns {{ [propName: string]: string }} - String del objeto a convertir
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private dataToStringForHash(hash: {
    [propName: string]: number | string | boolean | Array<unknown> | object;
  }): { [propName: string]: string } {
    const newHash: { [propName: string]: string } = {};
    Object.entries(hash).forEach(([key, value]) => {
      newHash[key] = this.dataToString(value);
    });
    return newHash;
  }

  /**
   * Convierte cualquier tipo de dato en una cadena de caracteres
   * @param {number | string | boolean | Array<unknown> | object} value - Datos a convertir
   * @returns {string} - Cadena de caracteres como resultado de la conversión
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private dataToString(value: number | string | boolean | Array<unknown> | object): string {
    let answer;
    switch (typeof value) {
      case 'object':
        answer = JSON.stringify(value);
        break;
      default:
        answer = String(value);
    }
    return answer;
  }

  /**
   * Convierte una cadena de caracteres en sus datos originales
   * @param {string} value - Datos a convertir
   * @returns {number | string | boolean | Array<unknown> | object} - Datos de la cadena de caracteres
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private stringtoData(value: string): number | string | boolean | Array<unknown> | object {
    let answer;
    if (/^(\[).+(\])$/.test(value) === true || /^(\{).+(\})$/.test(value) === true) {
      answer = JSON.parse(value);
    } else {
      answer = String(value);
    }
    return answer;
  }
}

export default ZoeRedisServer;
