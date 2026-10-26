import { env } from './infrastructure/config/env';
import { app } from './interface/http/app';

app.listen(env.PORT, () => {
  console.log(`RetroLab API escuchando en http://localhost:${env.PORT}`);
});
