/* eslint-disable @typescript-eslint/ban-types */

// Librerías
import { crc32 } from 'crc';
import ZoeRedisServer from '@core/providers/redis.provider';

/**
 * Clase para manejar la sesiones del sistema
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeSession {
  private id: string;
  private redis: ZoeRedisServer;
  private dataNewSession: { [propName: string]: boolean };

  /**
   * Maneja las sesiones del sistema
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  constructor() {
    this.id = '';
    this.dataNewSession = { init: true };
    this.redis = ZoeRedisServer.getInstance();
  }

  /**
   * Registra el ID o nombre de la sesión
   * @public
   * @method
   * @param {string} id - ID o nombre de la sesión
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async setId(id: string): Promise<void> {
    this.id = crc32(id).toString(16);
    await this.redis.hmset(this.id, this.dataNewSession);
  }

  /**
   * Registra una variable de sesión con su valor
   * @public
   * @method
   * @param {string} key - Nombre de la vairable
   * @param {number | string | boolean | Array<unknown> | object} value - Valor de la variable
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async set(key: string, value: number | string | boolean | Array<unknown> | object): Promise<void> {
    await this.redis.hset(this.id, key, value);
  }

  /**
   * Devuelve el valor de la variable de sesión
   * @public
   * @method
   * @param {string} key - Nombre de la variable
   * @returns {Promise<number | string | boolean | Array<unknown> | object>} - Valor de la variable
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async get(key: string): Promise<number | string | boolean | Array<unknown> | object> {
    return await this.redis.hmget(this.id, key);
  }

  /**
   * Verifica la existencia de una variable
   * @public
   * @method
   * @param {string} key - Nombre de la variable
   * @returns {Promise<boolean>} - Falso o Verdadero si la variable existe o no
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async has(key: string): Promise<boolean> {
    return await this.redis.hhas(this.id, key);
  }

  /**
   * Borra una variable
   * @public
   * @method
   * @param {string} key - Nombre de la variable
   * @returns {Promise<boolean>} - Falso o Verdadero si la variable fue o no borrada
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async delete(key: string): Promise<boolean> {
    return await this.redis.hdelete(this.id, key);
  }

  /**
   * Borra la sesión activa
   * @public
   * @method
   * @returns {Promise<boolean>} - Falso o Verdadero si la sesión fue borrada o no
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async close(): Promise<boolean> {
    return await this.redis.delete(this.id);
  }

  /**
   * Cambia el ID o nombre de la sesión activa
   * @public
   * @method
   * @param {string} id - Nuevo ID o nombre de la sesión
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async changeId(id: string): Promise<void> {
    let data = null;
    if ((await this.redis.has(this.id)) === true) {
      data = await this.redis.hgetall(this.id);
    } else {
      data = this.dataNewSession;
    }
    this.id = crc32(id).toString(16);
    await this.redis.hmset(this.id, data);
  }
}

export default ZoeSession;
