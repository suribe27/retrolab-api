import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError, NotFoundError } from '../../../domain/errors/AppError';
import { mapPrismaError } from '../../../infrastructure/database/mapPrismaError';

function enviarAppError(res: Response, err: AppError): void {
  res.status(err.statusCode).json({ message: err.message, ...(err.errors ? { errors: err.errors } : {}) });
}

function esJsonMalformado(err: unknown): boolean {
  return err instanceof SyntaxError && 'type' in err && err.type === 'entity.parse.failed';
}

/** Rutas que no existen → 404 en JSON */
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`No existe la ruta ${req.method} ${req.originalUrl}`));
}

/** Manejo centralizado de errores: nunca se devuelve el stack trace. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Datos inválidos',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (esJsonMalformado(err)) {
    res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  if (err instanceof AppError) {
    enviarAppError(res, err);
    return;
  }

  const prismaError = mapPrismaError(err);
  if (prismaError) {
    enviarAppError(res, prismaError);
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
