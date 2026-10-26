import { Camiseta, CamisetaFilters, CreateCamisetaData, UpdateCamisetaData } from '../entities/Camiseta';
import { PaginationParams } from '../types/Pagination';

export interface CamisetaRepository {
  findMany(filters: CamisetaFilters, pagination: PaginationParams): Promise<{ items: Camiseta[]; total: number }>;
  findById(id: number): Promise<Camiseta | null>;
  create(data: CreateCamisetaData): Promise<Camiseta>;
  update(id: number, data: UpdateCamisetaData): Promise<Camiseta>;
  delete(id: number): Promise<void>;
}
