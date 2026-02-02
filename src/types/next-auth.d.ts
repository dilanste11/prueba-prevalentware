import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extendemos la interfaz de Usuario que viene por defecto
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;  // Añadimos nuestro campo custom
      phone?: string | null; // Añadimos nuestro campo custom
    };
  }

  interface User {
    id: string;
    role?: string;
    phone?: string | null;
  }
}