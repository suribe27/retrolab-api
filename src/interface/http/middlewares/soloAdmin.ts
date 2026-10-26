import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../domain/errors/AppError';

/**
 * Middleware de rol. Va siempre DESPUÉS de auth.
 * Token válido pero sin rol admin → 403.
 */
export function soloAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) throw new UnauthorizedError();
  if (req.user.role !== 'admin') {
    throw new ForbiddenError('Solo un administrador puede realizar esta acción');
  }
  next();
}
