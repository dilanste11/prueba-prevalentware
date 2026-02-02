import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

/**
 * ------------------------------------------------------------------
 * ENDPOINT REST: CREAR TRANSACCIÓN
 * Ruta: POST /api/transactions/create
 * ------------------------------------------------------------------
 * Recibe: { amount: number, concept: string, type: "INGRESO" | "EGRESO", date?: string }
 * Retorna: La transacción creada.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Validar Método HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido. Use POST." });
  }

  try {
    // 2. Autenticación (Better Auth)
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // 3. Obtener y Validar Datos 
    const { amount, concept, type, date } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "El monto es obligatorio y debe ser un número." });
    }
    if (!concept || typeof concept !== "string") {
      return res.status(400).json({ message: "El concepto es obligatorio." });
    }
    if (type !== "INGRESO" && type !== "EGRESO") {
      return res.status(400).json({ message: "El tipo debe ser 'INGRESO' o 'EGRESO'." });
    }

    // 4. Guardar en Base de Datos (Prisma)
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        concept,
        type,        
        // Si nos envían fecha, la usamos. Si no, usa la actual.
        date: date ? new Date(date) : new Date(),
        
        // Conectamos la transacción al usuario dueño de la sesión
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return res.status(201).json(transaction);

  } catch (error) {
    console.error("Error creando transacción:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}