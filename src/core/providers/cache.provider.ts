/* eslint-disable @typescript-eslint/ban-types */

// Librerías
import ZoeRedisServer from '@core/providers/redis.provider';

/**
 * Clase para manejar el caché del sistema
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeCache {
  private redis: ZoeRedisServer;

  /**
   * Manejo del caché del sistema
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  constructor() {
    this.redis = ZoeRedisServer.getInstance();
  }

  /**
   * Registra el valor de una variable o llave
   * @public
   * @method
   * @param {string} key - Nombre de la llave o variable
   * @param {number | string | boolean | Array<unknown> | object} value - Valor de la llave o variable
   * @param {number} seconds - Tiempo en segundo de duración de la llave o variable, por defecto -1 si no se relaciona ningún valor, es decir, su diración es persistente
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async set(
    key: string,
    value: number | string | boolean | Array<unknown> | object,
    seconds: number = -1,
  ): Promise<void> {
    await this.redis.set(key, value);
    if (seconds > -1) {
      await this.redis.expire(key, seconds);
    }
  }

  /**
   * Devuelve el contenido de una llave o variable
   * @public
   * @method
   * @param {string} key - Nombre de la llave o variable
   * @returns {Promise<number | string | boolean | Array<unknown> | object>} - Contenido de la llave o variable
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async get(key: string): Promise<number | string | boolean | Array<unknown> | object> {
    return await this.redis.get(key);
  }

  /**
   * Determina la existencia de una llave o variable
   * @public
   * @method
   * @param {string} key - Nombre de la llave o variable
   * @returns {Promise<boolean>} - Falso o Verdadero si la llave o variable existe o no
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async has(key: string): Promise<boolean> {
    return await this.redis.has(key);
  }

  /**
   * Borra una llave o variable
   * @public
   * @method
   * @param {string} key - Nombre de la llave o variable
   * @returns {Promise<boolean>} - Falso o Verdadero si la llave o variable fue borrada
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public async delete(key: string): Promise<boolean> {
    return await this.redis.delete(key);
  }
}

export default ZoeCache;
