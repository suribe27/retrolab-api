import { AuthPayload } from '../entities/User';

/** Puertos de seguridad: el dominio no sabe si es bcrypt o jsonwebtoken. */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  sign(payload: AuthPayload): string;
  /** Lanza UnauthorizedError si el token es inválido o expiró. */
  verify(token: string): AuthPayload;
}
