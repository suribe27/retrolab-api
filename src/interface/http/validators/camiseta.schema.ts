import { z } from 'zod';
import { paginationSchema } from './common.schema';

export const CATEGORIAS = ['clubes', 'selecciones'] as const;
export const TALLAS = ['S', 'M', 'L', 'XL', '2XL'] as const;

export const listarCamisetasQuerySchema = paginationSchema
  .extend({
    category: z.enum(CATEGORIAS, { errorMap: () => ({ message: 'La categoría debe ser clubes o selecciones' }) }).optional(),
    q: z.string().trim().max(100).optional(),
    minPrice: z.coerce.number().int().min(0, 'minPrice no puede ser negativo').optional(),
    maxPrice: z.coerce.number().int().min(0, 'maxPrice no puede ser negativo').optional(),
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: 'minPrice no puede ser mayor que maxPrice',
    path: ['minPrice'],
  });

export const crearCamisetaSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'El slug solo puede tener minúsculas, números y guiones')
    .optional(),
  name: z.string({ required_error: 'El nombre es obligatorio' }).trim().min(3, 'Mínimo 3 caracteres').max(150),
  team: z.string({ required_error: 'El equipo es obligatorio' }).trim().min(2, 'Mínimo 2 caracteres').max(100),
  year: z.string({ required_error: 'El año es obligatorio' }).trim().regex(/^\d{4}(\/\d{2})?$/, 'Formato: 1998 o 2005/06'),
  price: z.number({ required_error: 'El precio es obligatorio', invalid_type_error: 'El precio debe ser un número' })
    .int('El precio debe ser entero')
    .positive('El precio debe ser mayor a 0'),
  image: z.string({ required_error: 'La imagen es obligatoria' }).trim().url('Debe ser una URL válida'),
  type: z.string({ required_error: 'El tipo es obligatorio' }).trim().min(3).max(30),
  era: z.string({ required_error: 'La época es obligatoria' }).trim().regex(/^\d{2}s$/, 'Formato: 90s, 00s'),
  category: z.enum(CATEGORIAS, { errorMap: () => ({ message: 'La categoría debe ser clubes o selecciones' }) }),
  description: z.string({ required_error: 'La descripción es obligatoria' }).trim().min(3).max(300),
  isAvailable: z.boolean().default(true),
  immediateStock: z.array(z.enum(TALLAS)).default([]),
});

export const actualizarCamisetaSchema = crearCamisetaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'Envía al menos un campo para actualizar' });
