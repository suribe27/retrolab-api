import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { AuthPayload, Role } from '../../domain/entities/User';
import { UnauthorizedError } from '../../domain/errors/AppError';
import { TokenService } from '../../domain/services/security';
import { env } from '../config/env';

function esRole(valor: unknown): valor is Role {
  return valor === 'admin' || valor === 'user';
}

export class JwtTokenService implements TokenService {
  sign(payload: AuthPayload): string {
    const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
    // Solo id y role: el payload se puede leer sin la clave
    return jwt.sign({ id: payload.id, role: payload.role }, env.JWT_SECRET, options);
  }

  verify(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (typeof decoded.id !== 'number' || !esRole(decoded.role)) {
        throw new UnauthorizedError('Token inválido');
      }
      return { id: decoded.id, role: decoded.role };
    } catch {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  }
}
