import { PrismaClient } from "@prisma/client";

// Declaración global para evitar múltiples instancias en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Útil para ver las consultas SQL en la terminal
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;