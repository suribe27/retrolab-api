import { Prisma } from '@prisma/client';
import { Camiseta, CamisetaFilters, CreateCamisetaData, UpdateCamisetaData } from '../../domain/entities/Camiseta';
import { CamisetaRepository } from '../../domain/repositories/CamisetaRepository';
import { PaginationParams } from '../../domain/types/Pagination';
import { prisma } from '../database/prisma';

function construirWhere(filters: CamisetaFilters): Prisma.CamisetaWhereInput {
  const where: Prisma.CamisetaWhereInput = {};

  if (filters.category) where.category = filters.category;

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { team: { contains: filters.q, mode: 'insensitive' } },
      { year: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  return where;
}

export class PrismaCamisetaRepository implements CamisetaRepository {
  async findMany(filters: CamisetaFilters, { page, limit }: PaginationParams): Promise<{ items: Camiseta[]; total: number }> {
    const where = construirWhere(filters);
    const [items, total] = await prisma.$transaction([
      prisma.camiseta.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.camiseta.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: number): Promise<Camiseta | null> {
    return prisma.camiseta.findUnique({ where: { id } });
  }

  create(data: CreateCamisetaData): Promise<Camiseta> {
    return prisma.camiseta.create({ data });
  }

  update(id: number, data: UpdateCamisetaData): Promise<Camiseta> {
    return prisma.camiseta.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.camiseta.delete({ where: { id } });
  }
}
