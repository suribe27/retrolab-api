import { z } from 'zod';
import { TALLAS } from './camiseta.schema';

// OJO: no hay userId aquí. Si alguien lo manda en el body, zod lo descarta.
export const crearSolicitudSchema = z.object({
  camisetaId: z.coerce
    .number({ required_error: 'Selecciona una camiseta', invalid_type_error: 'Selecciona una camiseta' })
    .int()
    .positive('Selecciona una camiseta'),
  talla: z.enum(TALLAS, { errorMap: () => ({ message: 'Selecciona una talla válida (S, M, L, XL, 2XL)' }) }),
  mensaje: z.string().trim().max(500, 'Máximo 500 caracteres').optional(),
});
