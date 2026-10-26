import { NextFunction, Request, Response } from 'express';
import { AuthPayload } from '../../../domain/entities/User';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { tokenService } from '../../../infrastructure/container';

/**
 * Middleware de autenticación centralizado.
 * Lee "Authorization: Bearer <token>", lo verifica y deja el usuario en req.user.
 * Sin token o token inválido/expirado → 401.
 */
export function auth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Falta el token de autenticación');
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new UnauthorizedError('Falta el token de autenticación');
  }

  req.user = tokenService.verify(token);
  next();
}

/** Devuelve el usuario del token. Solo se usa en rutas que pasaron por auth. */
export function getAuthUser(req: Request): AuthPayload {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}
