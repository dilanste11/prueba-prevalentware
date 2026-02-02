import { auth } from "@/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * CONFIGURACIÓN DE NEXT.JS PARA PAGES ROUTER
 * Importante: Desactivamos el bodyParser.
 * Better Auth necesita leer el stream de la petición directamente.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * MANEJADOR DE RUTAS
 * Usamos 'toNodeHandler' que es específico para entornos Node.js
 * como el de Next.js Pages API Routes.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await toNodeHandler(auth)(req, res);
}