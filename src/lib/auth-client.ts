import { createAuthClient } from "better-auth/react";

/**
 * CLIENTE DE AUTENTICACIÓN
 * Exportamos los hooks necesarios para usar la sesión en el Frontend.
 * baseURL asegura que funcione tanto en localhost como en producción.
 */
export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});