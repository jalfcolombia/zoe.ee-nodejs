// Librerías
import fs from 'fs';
import cors from 'cors';
import http from 'http';
import https from 'https';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import ZoeCache from '@core/providers/cache.provider';
import ZoeConfig from '@core/providers/config.provider';
import ZoeSession from '@core/providers/session.provider';
import ZoeHttpException from '@core/exceptions/HttpException';
import ZoeSQLServer from '@core/providers/sql-server.provider';
import ZoeDictionary from '@core/providers/dictionary.provider';
import express, { Application, NextFunction, Request, Response } from 'express';

// Diccionarios
import { ZoeListHttpCodesDictionary } from '@core/messages/list-http-codes.dictionary';

// Rutas globales
import AppRoutes from '@root/app.routes';

/**
 * Clase para manejar el servidor del sistema
 * @class
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
class ZoeServer {
  /**
   * Variable para manejar ExpressJS
   * @private
   * @type {Application}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private app: Application;

  /**
   * Variable para manejar el puerto del servidor
   * @private
   * @type {string}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private port: string;

  /**
   * Variable para manejar el servidor por HTTP
   * @private
   * @type {http.Server}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private httpServer?: http.Server;

  /**
   * Variable para manejar el servidor por HTTPS
   * @private
   * @type {https.Server}
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private httpsServer?: https.Server;

  /**
   * Manejo del servidor del sistema
   * @constructor
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  constructor() {
    new ZoeConfig();
    ZoeDictionary.register(ZoeListHttpCodesDictionary);
    this.app = express();
    this.port = process.env.NODE_SERVER_PORT || '3000';
    this.middlewares();
    this.routes();
    this.catch404();
    this.errorHandler();
  }

  /**
   * Método para correr el servidor
   * @method
   * @public
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  public run(): void {
    if (process.env.NODE_SERVER_SCOPE === 'development' || process.env.NODE_SERVER_SCOPE === 'test') {
      this.httpServer = http.createServer(this.app);
      this.httpServer.listen(this.port, () => {
        console.log('Servidor de desarrollo corriendo en puerto ' + this.port);
      });
    } else {
      const options = {
        key: fs.readFileSync(process.env.HTTP_SSL_KEY || ''),
        cert: fs.readFileSync(process.env.HTTP_SSL_CERT || ''),
      };
      this.httpsServer = https.createServer(options, this.app);
      this.httpsServer.listen(this.port, () => {
        console.log('Servidor de producción corriendo en puerto ' + this.port);
      });
    }
  }

  /**
   * Método para definir las rutas del sistema
   * @method
   * @private
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private routes(): void {
    const routs = new AppRoutes(this.app);
    this.app = routs.getRoutes();
  }

  /**
   * Método para manejar los middlewares del servidor
   * @method
   * @private
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private middlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(logger(process.env.NODE_SERVER_SCOPE || 'development'));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      request.zSession = new ZoeSession();
      next();
    });
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      request.zCache = new ZoeCache();
      next();
    });
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      request.zSQLServerConnection = ZoeSQLServer.getInstance().connection;
      next();
    });
  }

  /**
   * Método para manejar las api no encontradas
   * @method
   * @private
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private catch404(): void {
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      next(new ZoeHttpException(404));
    });
  }

  /**
   * Método para manejar los errores del servidor
   * @method
   * @private
   * @since 0.0.1
   * @version 0.0.1
   * @author Julian Lasso <jalasso69@misena.edu.co>
   */
  private errorHandler(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((error: ZoeHttpException, request: Request, response: Response, next: NextFunction) => {
      const status = error.code || 500;
      const message = error.message || ZoeDictionary.getMessage(500);
      console.error(error);
      // set locals, only providing error in development
      response.locals.message = message;
      response.locals.error = request.app.get('env') === 'dev' ? error : {};
      response.status(status).json({ status, message });
    });
  }
}

export default ZoeServer;
