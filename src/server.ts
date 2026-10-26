import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`RetroLab API escuchando en http://localhost:${PORT}`);
});
