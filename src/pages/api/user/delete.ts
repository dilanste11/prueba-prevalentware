import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // ELIMINAR USUARIO (Prisma borrará en cascada sus sesiones y cuentas)
    await prisma.user.delete({
      where: { email: session.user.email },
    });

    return res.status(200).json({ message: "Cuenta eliminada correctamente" });

  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}