import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { camisetasSeed } from './data/camisetas';

const prisma = new PrismaClient();

// Usuarios de prueba (solo para el ambiente de la entrega)
const usuarios = [
  { nombre: 'Admin RetroLab', email: 'admin@retrolab.com', password: 'Admin123*', role: Role.admin },
  { nombre: 'Usuario Prueba', email: 'user@retrolab.com', password: 'User123*', role: Role.user },
];

async function main(): Promise<void> {
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { nombre: u.nombre, role: u.role, password: hash },
      create: { nombre: u.nombre, email: u.email, role: u.role, password: hash },
    });
  }

  for (const c of camisetasSeed) {
    await prisma.camiseta.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  console.log(`Seed listo: ${usuarios.length} usuarios y ${camisetasSeed.length} camisetas`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
