import { AuthPayload } from '../../../domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      /** Usuario autenticado, lo deja el middleware auth */
      user?: AuthPayload;
    }
  }
}

export {};
