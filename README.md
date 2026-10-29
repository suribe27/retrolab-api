# RetroLab API

API REST de **RetroLab**, la tienda de camisetas retro de fútbol de la Entrega 1. Lo que antes era un arreglo en `script.js` ahora vive en PostgreSQL, y la tienda tiene usuarios con roles y autenticación con JWT.

- **API en producción:** https://retrolab-api.onrender.com (ejemplo: https://retrolab-api.onrender.com/api/camisetas)
- **Frontend en Vercel:** https://retrolab-web.vercel.app
- **Repositorio del frontend:** https://github.com/suribe27/retrolab-web

> La API está en el plan gratis de Render: si lleva un rato sin uso, la primera petición puede tardar unos 50 segundos mientras despierta.

## Stack

Node.js · Express 5 · TypeScript · Prisma · PostgreSQL (Neon) · JWT · bcrypt · Zod

## Arquitectura en cuatro capas

```
src/
├── domain/          Entidades, interfaces de repositorios, puertos de seguridad y errores
├── application/     Casos de uso: AuthService, CamisetaService, SolicitudService
├── infrastructure/  Prisma, repositorios, bcrypt, JWT, variables de entorno y composición
└── interface/http/  Rutas, controladores, middlewares (auth, soloAdmin, errores) y validadores Zod
```

Prisma solo se usa dentro de `infrastructure/`. Los controladores solo validan la entrada y llaman al caso de uso; la lógica está en `application/`.

## Modelo de datos

| Tabla | Descripción |
|---|---|
| `users` | nombre, email único, password (hash bcrypt), role (`admin` \| `user`) |
| `camisetas` | El catálogo de la Entrega 1, cargado con un seed con las camisetas reales de la tienda |
| `solicitudes` | Lo que hacía el formulario "¿No encontraste tu camiseta?": un usuario pide una camiseta del catálogo en una talla. Tiene llaves foráneas hacia `users` y `camisetas` |

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

Requisitos: Node 20+ y una base de datos PostgreSQL (yo uso Neon).

```bash
npm install
cp .env.example .env        # y llenar los valores
npx prisma migrate dev      # crea las tablas
npm run db:seed             # carga las camisetas y los usuarios de prueba
npm run dev                 # http://localhost:3000
```

### Variables de entorno

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Clave para firmar los tokens |
| `JWT_EXPIRES_IN` | Expiración del token (uso `1d`) |
| `PORT` | Puerto del servidor |
| `FRONTEND_URL` | URL(s) permitidas por CORS, separadas por coma (en producción: `https://retrolab-web.vercel.app,http://localhost:3001`) |

## Credenciales de prueba

Creadas por el seed (solo para el ambiente de la entrega):

| Rol | Email | Contraseña |
|---|---|---|
| admin | `admin@retrolab.com` | `Admin123*` |
| user | `user@retrolab.com` | `User123*` |

## Decisiones técnicas

### Flujo completo de un login

Cuando el usuario envía el formulario de login en el frontend, primero se valida que el correo y la contraseña no estén vacíos. Después, el hook `useAuth` llama al service, y el service usa el cliente `http.ts` para hacer `POST /api/auth/login`.

En la API, Zod valida el body. Luego `AuthService` busca al usuario por el email y compara la contraseña con el hash usando `bcrypt.compare`. Si algo falla, responde **401** con "Credenciales inválidas", el mismo mensaje para el email y para la contraseña, para no dar pistas de cuál de los dos estaba mal. Si todo está bien, firma un JWT con `JWT_SECRET` que lleva solo `id` y `role` y expira en 1 día. La respuesta trae el token y los datos del usuario, nunca la contraseña.

El frontend guarda el token en una cookie y el usuario en el contexto de sesión, así que la navbar cambia. Cuando el usuario entra a una ruta protegida, por ejemplo "Mis solicitudes", `http.ts` agrega automáticamente el header `Authorization: Bearer <token>` a la petición `GET /api/solicitudes/mias`. En la API, el middleware `auth` lee ese header, verifica la firma y la expiración con `jwt.verify` y deja el usuario en `req.user`. El controlador usa ese `id` para devolver solo las solicitudes de esa persona.

### ¿Dónde guardo el token en el frontend y qué riesgo tiene?

Lo guardo en una cookie (`retrolab_token`) que se crea desde JavaScript, con `SameSite=Lax`, `Secure` cuando el sitio va por https y una duración igual a la expiración del token. La elegí porque la sesión sobrevive al refrescar la página y porque `proxy.ts` de Next puede leerla en el servidor para redirigir antes de mostrar una ruta privada.

El riesgo es que, como JavaScript la puede leer, si el sitio tuviera una vulnerabilidad XSS (un script inyectado), ese script podría robar el token y hacerse pasar por el usuario hasta que expire. Lo que lo mitiga es que el token dura solo 1 día y que React escapa el contenido que se muestra. Una opción más segura sería una cookie `httpOnly` creada por la API, que JavaScript no puede leer.

### ¿Cuándo responde 401 y cuándo 403?

- **401** significa que la API no sabe quién eres: no mandaste token, o el token es inválido o ya expiró. También en un login con credenciales malas.
- **403** significa que sí sabe quién eres, pero no tienes permiso para esa acción.

Ejemplo real que probé en producción: `DELETE /api/camisetas/3` **sin token** responde **401** porque el middleware `auth` no encuentra el header. La misma petición **con el token de `user@retrolab.com`** responde **403**, porque el token es válido pero el middleware `soloAdmin` exige rol `admin`. En ninguno de los dos casos se borra la camiseta.

### Uso de IA

Usé IA (Claude) como apoyo durante toda la entrega. La usé para generar la base del código del backend siguiendo la estructura en cuatro capas que vimos en clase, guiarme paso a paso con Prisma, Neon y Render, y organizar la documentación. Por eso los primeros cuatro commits del backend quedaron con pocos minutos de diferencia: corresponden a la base generada en una sola sesión. Después de eso, todo lo fui probando y subiendo yo por partes.

Lo que tuve que revisar y corregir yo:
- Probé cada endpoint en local y en producción con PowerShell para confirmar los códigos 201, 401, 403 y 409 antes de cada push.
- Cambié las imágenes del catálogo de Cloudinary a ImageKit. Una de las URLs (Argentina) no existía y además el año estaba mal (era 1994, no 1984). La corregí, y como cambié el slug, el seed creó un registro nuevo, así que tuve que borrar el duplicado usando mi propia API con el token de admin.
- Configuré CORS en Render con la URL real de Vercel después de desplegar el frontend.

## Captura de Network

Petición protegida a `GET /api/solicitudes/mias` desde el sitio en Vercel, con el header `Authorization: Bearer ...`:

![Petición protegida con Authorization](capturas/network.png)
