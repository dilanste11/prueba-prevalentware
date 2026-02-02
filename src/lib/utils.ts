import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Función pura para formatear dinero (Lógica de negocio)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Función para validar si una transacción es válida
export const validateTransaction = (amount: number, concept: string): string | null => {
  if (amount <= 0) return "El monto debe ser mayor a 0";
  if (!concept.trim()) return "El concepto es obligatorio";
  return null; // Null significa que no hay error
};