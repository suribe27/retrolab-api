import cors from 'cors';
import express from 'express';
import { env } from '../../infrastructure/config/env';
import { authRouter } from './routes/auth.routes';
import { camisetasRouter } from './routes/camisetas.routes';
import { solicitudesRouter } from './routes/solicitudes.routes';
import { errorHandler, notFound } from './middlewares/errorHandler';

export const app = express();

// CORS solo para el frontend (Vercel y local), nunca "*"
app.use(
  cors({
    origin: env.FRONTEND_URLS,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '100kb' }));
app.disable('x-powered-by');

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/camisetas', camisetasRouter);
app.use('/api/solicitudes', solicitudesRouter);

app.use(notFound);
app.use(errorHandler);
