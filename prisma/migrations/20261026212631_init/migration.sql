-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camisetas" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "team" VARCHAR(100) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "era" VARCHAR(10) NOT NULL,
    "category" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "immediateStock" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "camisetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "camisetaId" INTEGER NOT NULL,
    "talla" VARCHAR(5) NOT NULL,
    "mensaje" VARCHAR(500),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "camisetas_slug_key" ON "camisetas"("slug");

-- CreateIndex
CREATE INDEX "solicitudes_userId_idx" ON "solicitudes"("userId");

-- CreateIndex
CREATE INDEX "solicitudes_camisetaId_idx" ON "solicitudes"("camisetaId");

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_camisetaId_fkey" FOREIGN KEY ("camisetaId") REFERENCES "camisetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
