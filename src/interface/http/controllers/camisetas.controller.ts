import { Request, Response } from 'express';
import { camisetaService } from '../../../infrastructure/container';
import { idParamSchema } from '../validators/common.schema';
import {
  actualizarCamisetaSchema,
  crearCamisetaSchema,
  listarCamisetasQuerySchema,
} from '../validators/camiseta.schema';

export async function listar(req: Request, res: Response): Promise<void> {
  const { page, limit, ...filters } = listarCamisetasQuerySchema.parse(req.query);
  const result = await camisetaService.listar(filters, { page, limit });
  res.json(result);
}

export async function obtener(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  res.json(await camisetaService.obtener(id));
}

export async function crear(req: Request, res: Response): Promise<void> {
  const data = crearCamisetaSchema.parse(req.body);
  res.status(201).json(await camisetaService.crear(data));
}

export async function actualizar(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const data = actualizarCamisetaSchema.parse(req.body);
  res.json(await camisetaService.actualizar(id, data));
}

export async function eliminar(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  await camisetaService.eliminar(id);
  res.status(204).send();
}
