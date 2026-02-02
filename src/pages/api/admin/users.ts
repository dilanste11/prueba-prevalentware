import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Autenticación
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  // 2. VERIFICACIÓN DE ROL (Solo ADMIN puede ver esto)
  if (session.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Prohibido: Requiere rol de Administrador" });
  }

  // --- GET: Listar todos los usuarios ---
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error obteniendo usuarios" });
    }
  }

  // --- PUT: Editar Rol de Usuario ---
  if (req.method === "PUT") {
    const { userId, role, name, phone } = req.body;
    
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role, name, phone },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Error actualizando usuario" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}