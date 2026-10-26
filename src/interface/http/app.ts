import express from 'express';
import { authRouter } from './routes/auth.routes';
import { camisetasRouter } from './routes/camisetas.routes';
import { solicitudesRouter } from './routes/solicitudes.routes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/camisetas', camisetasRouter);
app.use('/api/solicitudes', solicitudesRouter);

app.use(errorHandler);
