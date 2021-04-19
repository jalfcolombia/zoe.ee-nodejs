// Librerías
import dotenv, { DotenvConfigOutput } from 'dotenv';

/**
 * Clase para manejar la configuración del sistema
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeConfig {
  /**
   * @private
   * @type {DotenvConfigOutput}
   */
  private envFound: DotenvConfigOutput;

  /**
   * Manejar la configuración del sistema
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  constructor() {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    this.envFound = dotenv.config({ path: `./environments/.${process.env.NODE_ENV}.env` });
    this.errorHandler();
  }

  /**
   * Maneja los errores al intentar cargar un archivo de configuración
   * @method
   * @private
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private errorHandler(): void {
    if (this.envFound.error) {
      throw new Error(`⚠️ El archivo .${process.env.NODE_ENV}.env no fue encontrado ⚠️`);
    }
  }
}

export default ZoeConfig;
