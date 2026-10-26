import express from 'express';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);

app.use(errorHandler);
