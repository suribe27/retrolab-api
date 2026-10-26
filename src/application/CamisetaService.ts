import { Camiseta, CamisetaFilters, CreateCamisetaData, UpdateCamisetaData } from '../domain/entities/Camiseta';
import { NotFoundError } from '../domain/errors/AppError';
import { CamisetaRepository } from '../domain/repositories/CamisetaRepository';
import { Paginated, PaginationParams } from '../domain/types/Pagination';

export type CreateCamisetaInput = Omit<CreateCamisetaData, 'slug'> & { slug?: string };

function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export class CamisetaService {
  constructor(private readonly camisetas: CamisetaRepository) {}

  async listar(filters: CamisetaFilters, pagination: PaginationParams): Promise<Paginated<Camiseta>> {
    const { items, total } = await this.camisetas.findMany(filters, pagination);
    return {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
      },
      data: items,
    };
  }

  async obtener(id: number): Promise<Camiseta> {
    const camiseta = await this.camisetas.findById(id);
    if (!camiseta) throw new NotFoundError('Camiseta no encontrada');
    return camiseta;
  }

  crear(input: CreateCamisetaInput): Promise<Camiseta> {
    return this.camisetas.create({ ...input, slug: input.slug ?? slugify(input.name) });
  }

  async actualizar(id: number, data: UpdateCamisetaData): Promise<Camiseta> {
    await this.obtener(id); // 404 si no existe
    return this.camisetas.update(id, data);
  }

  async eliminar(id: number): Promise<void> {
    await this.obtener(id); // 404 si no existe
    await this.camisetas.delete(id);
  }
}
