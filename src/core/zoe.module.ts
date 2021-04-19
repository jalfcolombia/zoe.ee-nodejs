// Librerías
import ZoeCache from '@core/providers/cache.provider';
import ZoeServer from '@core/providers/server.provider';
import ZoeSession from '@core/providers/session.provider';
import ZoeOracleServer from '@core/providers/oracle.provider';
import ZoeHttpException from '@core/exceptions/HttpException';
import ZoeSQLServer from '@core/providers/sql-server.provider';
import ZoeDictionary from '@core/providers/dictionary.provider';

// Validadores
import ZoeGeneralValidator from '@core/validators/general.validator';

// Interfaces
import { IZoeMessageDictionary } from '@core/interfaces/message-dictionary.interface';

/**
 * Zoe nombre de espacio del paquete base
 * @namespace
 * @since 0.0.1
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
namespace Zoe {
  /**
   * Clase Server para manejar el servidor del sistema
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class Server extends ZoeServer {}

  /**
   * Clase para manejar la conexión a SQL Server
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class SQLServer extends ZoeSQLServer {}

  /**
   * Clase para manejar la conexión a Oracle
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author David Sanchez <david.sanchezm@misena.edu.co>
   */
  export class OracleServer extends ZoeOracleServer {}

  /**
   * Clase para manejar las excepciones por parte de la base del sistema
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class HttpException extends ZoeHttpException {}

  /**
   * Interface para el manejo de los mensajes de los diccionarios
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export type IMessageDictionary = IZoeMessageDictionary;

  /**
   * Clase para manejar los diccionarios del sistema incluyendo los de los módulos
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class Dictionary extends ZoeDictionary {}

  /**
   * Clase para manejar los diferentes validadores del sistema base
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class GeneralValidator extends ZoeGeneralValidator {}

  /**
   * Clase para manejar las sesiones del sistema
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class Session extends ZoeSession {}

  /**
   * Clase para manejar el caché del sistema
   * @class
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  export class Cache extends ZoeCache {}
}

export default Zoe;
