import { Request, Response } from 'express';
import { solicitudService } from '../../../infrastructure/container';
import { getAuthUser } from '../middlewares/auth';
import { crearSolicitudSchema } from '../validators/solicitud.schema';

export async function crear(req: Request, res: Response): Promise<void> {
  const data = crearSolicitudSchema.parse(req.body);
  const { id: userId } = getAuthUser(req); // el autor sale del token
  res.status(201).json(await solicitudService.crear(userId, data));
}

export async function mias(req: Request, res: Response): Promise<void> {
  const { id: userId } = getAuthUser(req);
  res.json(await solicitudService.mias(userId));
}

export async function todas(_req: Request, res: Response): Promise<void> {
  res.json(await solicitudService.todas());
}
