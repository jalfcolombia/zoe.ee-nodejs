import { Request, Response, NextFunction } from 'express';

class PowerBIMiddleware {
  public static async hasToken(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    const validator = new PowerBIMiddleware();

    const token = validator.getTokenFromHeader(request);

    if (token !== process.env.POWERBI_TOKEN)
      return response.status(403).json({
        code: 403,
        message: 'Unauthorized',
      });

    return next();
  }

  /**
   * Authorization: Bearer ${token}
   */
  private getTokenFromHeader(req: Request): string | null {
    if (
      (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
      (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}

export default PowerBIMiddleware;
