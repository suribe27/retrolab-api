import { Request, Response } from 'express';
import { authService } from '../../../infrastructure/container';
import { loginSchema, registerSchema } from '../validators/auth.schema';
import { getAuthUser } from '../middlewares/auth';

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);
  const user = await authService.register(data);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data);
  res.json(result);
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.me(getAuthUser(req).id);
  res.json(user);
}
