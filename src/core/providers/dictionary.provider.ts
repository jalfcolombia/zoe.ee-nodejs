// Interfaces
import { IZoeMessageVariables } from '@core/interfaces/message-variables.interface';
import { IZoeMessageDictionary } from '@core/interfaces/message-dictionary.interface';

/**
 * Clase para manejar los mensajes en los diccionarios del sistema
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeDictionary {
  /**
   * Variable para almacenar todos los diccionarios del sistema
   * @private
   * @static
   * @type {IZoeMessageDictionary}
   */
  private static dictionary: IZoeMessageDictionary = {};

  /**
   * Registra un diccionario
   * @method
   * @public
   * @static
   * @param {IZoeMessageDictionary} dictionary - Diccionario a registrar
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public static register(dictionary: IZoeMessageDictionary): void {
    ZoeDictionary.dictionary = { ...ZoeDictionary.dictionary, ...dictionary };
  }

  /**
   * Registra un arreglo de diccionario
   * @method
   * @public
   * @static
   * @param {Array<IZoeMessageDictionary>} dictionary - Arreglo de diccionario a registrar
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public static registerArray(dictionary: Array<IZoeMessageDictionary>): void {
    dictionary.forEach((element: IZoeMessageDictionary) => {
      ZoeDictionary.dictionary = { ...ZoeDictionary.dictionary, ...element };
    });
  }

  /**
   * Obtiene un mensaje almancenado en los diccionarios del sistema
   * @param {string | number} key - Llave o indice del mensaje
   * @param {IZoeMessageVariables} data - [Opcional] Variables de un mesan
   * @returns {string} - Mensaje buscado
   */
  public static getMessage(key: string | number, data?: IZoeMessageVariables): string {
    const message = ZoeDictionary.dictionary[key] || '';
    if (typeof data !== 'undefined') {
      const regex = new RegExp('{{(' + Object.keys(data).join('|') + ')}}', 'g');
      return message.replace(regex, (m, $1) => String(data[$1]) || m);
    }
    return message;
  }
}

export default ZoeDictionary;
