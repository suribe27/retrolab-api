import { CreateSolicitudData, SolicitudConDetalle } from '../../domain/entities/Solicitud';
import { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';
import { prisma } from '../database/prisma';

const incluirCamiseta = {
  camiseta: { select: { id: true, name: true, image: true, price: true } },
} as const;

const incluirTodo = {
  ...incluirCamiseta,
  user: { select: { id: true, nombre: true, email: true } },
} as const;

export class PrismaSolicitudRepository implements SolicitudRepository {
  create(data: CreateSolicitudData): Promise<SolicitudConDetalle> {
    return prisma.solicitud.create({ data, include: incluirCamiseta });
  }

  findByUser(userId: number): Promise<SolicitudConDetalle[]> {
    return prisma.solicitud.findMany({
      where: { userId },
      include: incluirCamiseta,
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll(): Promise<SolicitudConDetalle[]> {
    return prisma.solicitud.findMany({ include: incluirTodo, orderBy: { createdAt: 'desc' } });
  }
}
