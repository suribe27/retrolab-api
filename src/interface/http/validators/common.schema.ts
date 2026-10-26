import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El id debe ser un número' })
    .int('El id debe ser un número entero')
    .positive('El id debe ser positivo'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int('page debe ser entero').min(1, 'page debe ser mayor o igual a 1').default(1),
  limit: z.coerce
    .number()
    .int('limit debe ser entero')
    .min(1, 'limit debe ser mayor o igual a 1')
    .max(50, 'limit no puede ser mayor a 50')
    .default(6),
});
