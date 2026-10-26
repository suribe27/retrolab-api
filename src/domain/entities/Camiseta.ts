export interface Camiseta {
  id: number;
  slug: string;
  name: string;
  team: string;
  year: string;
  price: number;
  image: string;
  type: string;
  era: string;
  category: string;
  description: string;
  isAvailable: boolean;
  immediateStock: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCamisetaData = Omit<Camiseta, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCamisetaData = Partial<CreateCamisetaData>;

export interface CamisetaFilters {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
}
