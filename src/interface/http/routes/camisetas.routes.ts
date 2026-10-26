import { Router } from 'express';
import { actualizar, crear, eliminar, listar, obtener } from '../controllers/camisetas.controller';
import { auth } from '../middlewares/auth';
import { soloAdmin } from '../middlewares/soloAdmin';

export const camisetasRouter = Router();

// Públicas
camisetasRouter.get('/', listar);
camisetasRouter.get('/:id', obtener);

// Solo admin
camisetasRouter.post('/', auth, soloAdmin, crear);
camisetasRouter.put('/:id', auth, soloAdmin, actualizar);
camisetasRouter.delete('/:id', auth, soloAdmin, eliminar);
