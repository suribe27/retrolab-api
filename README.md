# RetroLab API

API REST de **RetroLab**, la tienda de camisetas retro de fútbol de la Entrega 1, ahora con base de datos, usuarios con roles y autenticación con JWT.

- **API en producción:** _(pega aquí la URL de Render)_
- **Frontend en Vercel:** _(pega aquí la URL de Vercel)_
- **Repositorio del frontend:** https://github.com/suribe27/retrolab-web

## Stack

Node.js · Express 5 · TypeScript · Prisma · PostgreSQL · JWT · bcrypt · Zod

## Arquitectura en cuatro capas

```
src/
├── domain/          Entidades, interfaces de repositorios, puertos de seguridad y errores
├── application/     Casos de uso: AuthService, CamisetaService, SolicitudService
├── infrastructure/  Prisma, repositorios, bcrypt, JWT, variables de entorno y composición
└── interface/http/  Rutas, controladores, middlewares (auth, soloAdmin, errores) y validadores Zod
```

Prisma solo se usa dentro de `infrastructure/`.

## Modelo de datos

| Tabla | Descripción |
|---|---|
| `users` | nombre, email único, password (hash bcrypt), role (`admin` \| `user`) |
| `camisetas` | El catálogo de la Entrega 1 (14 camisetas reales cargadas con el seed) |
| `solicitudes` | Lo que hacía el formulario "¿No encontraste tu camiseta?": un usuario pide una camiseta en una talla. Llaves foráneas hacia `users` y `camisetas` |

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/me` | Autenticado |
| GET | `/api/camisetas?page=1&limit=6&category=clubes&q=inter&minPrice=0&maxPrice=200000` | Público, paginado `{ pagination, data }` |
| GET | `/api/camisetas/:id` | Público |
| POST | `/api/camisetas` | Solo admin |
| PUT | `/api/camisetas/:id` | Solo admin |
| DELETE | `/api/camisetas/:id` | Solo admin |
| POST | `/api/solicitudes` | Autenticado (el usuario sale del token) |
| GET | `/api/solicitudes/mias` | Autenticado: solo las suyas |
| GET | `/api/solicitudes` | Solo admin: todas |

## Correr en local

Requisitos: Node 20+ y PostgreSQL.

```bash
npm install
cp .env.example .env        # y llena tus valores
npx prisma migrate dev      # crea las tablas
npm run db:seed             # carga camisetas y usuarios de prueba
npm run dev                 # http://localhost:3000
```

### Variables de entorno

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Clave para firmar los tokens |
| `JWT_EXPIRES_IN` | Expiración del token (ej. `1d`) |
| `PORT` | Puerto del servidor |
| `FRONTEND_URL` | URL(s) permitidas por CORS, separadas por coma |

## Credenciales de prueba

Creadas por el seed (solo para el ambiente de la entrega):

| Rol | Email | Contraseña |
|---|---|---|
| admin | `admin@retrolab.com` | `Admin123*` |
| user | `user@retrolab.com` | `User123*` |

## Decisiones técnicas

> ✍️ Esta sección la escribo con mis propias palabras.

### Flujo completo de un login

_(Explica desde que envías el formulario hasta que una ruta protegida responde.)_

### ¿Dónde guardo el token en el frontend y qué riesgo tiene?

_(…)_

### ¿Cuándo responde 401 y cuándo 403?

_(Da un ejemplo real del proyecto, por ejemplo `DELETE /api/camisetas/3` sin token y con el token del usuario normal.)_

### Uso de IA

_(Para qué la usé y qué tuve que corregir.)_

## Captura de Network

_(Captura de una petición protegida mostrando el header `Authorization: Bearer ...`)_
