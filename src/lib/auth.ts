import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * CONFIGURACIÓN CENTRAL DE BETTER AUTH
 * Aquí definimos los proveedores, la base de datos y los hooks.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // Definimos GitHub como proveedor social
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  // -----------------------------------------------------------
  // REQUISITO: CONTROL DE ACCESO (RBAC)
  // Definimos que el usuario tiene propiedades extra: role y phone
  // -----------------------------------------------------------
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "ADMIN", // Requisito: Nuevos usuarios son ADMIN
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  // Hook de seguridad para asegurar que el rol se guarde
databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "ADMIN", // Refuerzo de seguridad
            },
          };
        },
      },
    },
  },
}); 