import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Verificar Sesión
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "GET") {
    try {
      let transactions;

      // 2. LÓGICA DE FILTRADO SEGÚN ROL
      if (session.user.role === "ADMIN") {
        // CASO ADMIN: Trae TODO (de todos los usuarios)
        transactions = await prisma.transaction.findMany({
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: {
            date: "desc", 
          },
        });
      } else {
        // CASO USUARIO NORMAL: Trae SOLO lo suyo
        transactions = await prisma.transaction.findMany({
          where: {
            userId: session.user.id, 
          },
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: {
            date: "desc",
          },
        });
      }

      return res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener transacciones" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}