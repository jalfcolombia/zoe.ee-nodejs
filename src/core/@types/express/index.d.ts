import { Sequelize } from 'sequelize';
import ZoeCache from '@core/providers/cache.provider';
import ZoeSession from '@core/providers/session.provider';

declare global {
  namespace Express {
    interface Request {
      zToken: string;
      zCache: ZoeCache;
      zSession: ZoeSession;
      zSQLServerConnection: Sequelize;
    }
  }
}
