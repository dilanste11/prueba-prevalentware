import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Use PUT" });

  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ message: "No autorizado" });

  // Recibimos nombre y teléfono
  const { name, phone } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        phone: phone, // Actualiza teléfono
        name: name    // Actualiza nombre (nuevo)
      },
    });

    return res.status(200).json({ message: "Datos actualizados", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
}