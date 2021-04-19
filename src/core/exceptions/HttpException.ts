// Librerías
import { CustomError } from 'ts-custom-error';
import ZoeDictionary from '@core/providers/dictionary.provider';

/**
 * Clase para manejar las excepciones por parte de la base del sistema
 * @class
 * @since 0.0.1
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeHttpException extends CustomError {
  /**
   * @constructor
   * @extends CustomError
   * @param {number} code - Código del error
   * @param {string} [message] - Mensaje del error
   */
  constructor(public code: number, message?: string) {
    super(message || ZoeDictionary.getMessage(code));
  }
}

export default ZoeHttpException;
