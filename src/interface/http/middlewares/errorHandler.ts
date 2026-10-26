import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../domain/errors/AppError';

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

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
