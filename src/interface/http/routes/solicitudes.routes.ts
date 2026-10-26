import { Router } from 'express';
import { crear, mias, todas } from '../controllers/solicitudes.controller';
import { auth } from '../middlewares/auth';
import { soloAdmin } from '../middlewares/soloAdmin';

export const solicitudesRouter = Router();

// Todas las rutas de solicitudes requieren sesión
solicitudesRouter.use(auth);

solicitudesRouter.post('/', crear);
solicitudesRouter.get('/mias', mias);
solicitudesRouter.get('/', soloAdmin, todas);
