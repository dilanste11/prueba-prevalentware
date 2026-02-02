import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Seguridad (Solo Admin)
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session || session.user.role !== "ADMIN") return res.status(403).json({ message: "Prohibido" });

  if (req.method === "GET") {
    try {
      // Obtenemos TODAS las transacciones del sistema (Admin ve todo)
      const transactions = await prisma.transaction.findMany({
        include: { user: { select: { name: true, email: true } } }, // Incluimos quién hizo el gasto
        orderBy: { date: "asc" },
      });

      // Calcular totales
      const totalIncome = transactions.filter(t => t.type === "INGRESO").reduce((acc, t) => acc + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === "EGRESO").reduce((acc, t) => acc + t.amount, 0);
      const balance = totalIncome - totalExpense;

      return res.status(200).json({
        stats: { totalIncome, totalExpense, balance },
        transactions, // Lista completa para el CSV
      });
    } catch (error) {
      return res.status(500).json({ message: "Error generando reporte" });
    }
  }
}