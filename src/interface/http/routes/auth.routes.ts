import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller';
import { auth } from '../middlewares/auth';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', auth, me);
