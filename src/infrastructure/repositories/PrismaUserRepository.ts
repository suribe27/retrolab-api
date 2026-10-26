import { CreateUserData, User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { prisma } from '../database/prisma';

export class PrismaUserRepository implements UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }
}
