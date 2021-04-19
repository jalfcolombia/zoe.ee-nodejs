/**
 * Interface para el manejo de las opciones de conexión a Reds
 * @interface
 * @since 0.0.1
 * @version 0.0.1
 * @author Julian Lasso <jalasso69@misena.edu.co>
 */
export interface IRedisOptions {
  host?: string;
  port?: number;
  password?: string;
  timeout?: number;
  tls?: {
    key: Buffer;
    cert: Buffer;
  };
}
