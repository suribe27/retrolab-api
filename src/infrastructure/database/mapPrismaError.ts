import { Prisma } from '@prisma/client';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../../domain/errors/AppError';

/**
 * Traduce errores de Prisma a errores de dominio.
 * Vive en infrastructure para que Prisma no se filtre a las otras capas.
 */
export function mapPrismaError(err: unknown): AppError | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = err.meta?.target;
        const field = Array.isArray(target) ? String(target[0]) : 'campo';
        return new ConflictError(`Ya existe un registro con ese ${field}`, [
          { field, message: `Este ${field} ya está en uso` },
        ]);
      }
      case 'P2025':
        return new NotFoundError('Recurso no encontrado');
      case 'P2003':
        return new BadRequestError('La referencia indicada no existe');
      default:
        return null;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestError('Datos inválidos para la base de datos');
  }

  return null;
}
