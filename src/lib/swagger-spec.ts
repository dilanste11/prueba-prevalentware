export const apiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Finanzas App API",
    version: "1.0.0",
    description: "API REST para la gestión de ingresos, egresos y usuarios. Desarrollada con Next.js.",
    contact: {
      name: "Soporte Técnico",
      email: "support@finanzasapp.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de Desarrollo Local",
    },
    {
      url: "https://tu-proyecto.vercel.app",
      description: "Servidor de Producción",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "header",
        name: "cookie",
        description: "La autenticación se maneja vía cookies de sesión (Better Auth).",
      },
    },
    schemas: {
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string", example: "cm6o123450000x" },
          amount: { type: "number", example: 150000 },
          concept: { type: "string", example: "Pago de Servicios Públicos" },
          type: { type: "string", enum: ["INGRESO", "EGRESO"], example: "EGRESO" },
          date: { type: "string", format: "date-time", example: "2026-02-02T14:30:00.000Z" },
          userId: { type: "string", example: "user_123456789" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "user_987654321" },
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", format: "email", example: "juan@empresa.com" },
          role: { type: "string", enum: ["ADMIN", "USER"], example: "USER" },
          image: { type: "string", nullable: true },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "No autorizado o datos inválidos." },
        },
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
  paths: {
    "/api/transactions/list": {
      get: {
        summary: "Obtener historial de transacciones",
        description: "Devuelve la lista de movimientos. Si es ADMIN ve todo; si es USER solo ve lo suyo.",
        tags: ["Transacciones"],
        responses: {
          "200": {
            description: "Lista obtenida exitosamente.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
          },
          "401": {
            description: "No autorizado (Sesión no encontrada).",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
    "/api/transactions/create": {
      post: {
        summary: "Crear nueva transacción",
        description: "Registra un ingreso o egreso en la base de datos.",
        tags: ["Transacciones"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "concept", "type"],
                properties: {
                  amount: { type: "number", description: "Monto del movimiento", example: 50000 },
                  concept: { type: "string", description: "Descripción corta", example: "Venta de Monitor" },
                  type: { type: "string", enum: ["INGRESO", "EGRESO"], example: "INGRESO" },
                  date: { type: "string", format: "date", description: "Fecha del movimiento (Opcional, por defecto hoy)", example: "2026-02-01" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Transacción creada exitosamente.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } },
          },
          "400": {
            description: "Datos faltantes o inválidos.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
    "/api/admin/users": {
      get: {
        summary: "Listar todos los usuarios",
        description: "Obtiene el listado completo de usuarios registrados. Requiere rol ADMIN.",
        tags: ["Administración"],
        responses: {
          "200": {
            description: "Lista de usuarios.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          "403": {
            description: "Prohibido. El usuario no tiene rol ADMIN.",
          },
        },
      },
      put: {
        summary: "Actualizar rol de usuario",
        description: "Permite ascender o degradar usuarios (Admin <-> User).",
        tags: ["Administración"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "role"],
                properties: {
                  userId: { type: "string", example: "user_abc123" },
                  role: { type: "string", enum: ["ADMIN", "USER"], example: "ADMIN" },
                  name: { type: "string", example: "Nuevo Nombre (Opcional)" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Usuario actualizado." },
        },
      },
    },
    "/api/admin/reports": {
      get: {
        summary: "Obtener estadísticas financieras",
        description: "Devuelve los totales calculados y datos para gráficos. Solo ADMIN.",
        tags: ["Reportes"],
        responses: {
          "200": {
            description: "Reporte generado.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    stats: {
                      type: "object",
                      properties: {
                        totalIncome: { type: "number", example: 1000000 },
                        totalExpense: { type: "number", example: 450000 },
                        balance: { type: "number", example: 550000 },
                      },
                    },
                    transactions: {
                      type: "array",
                      description: "Listado plano para exportar a CSV",
                      items: { $ref: "#/components/schemas/Transaction" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/user/delete": {
      delete: {
        summary: "Eliminar mi cuenta",
        description: "Borra permanentemente la cuenta del usuario actual y sus datos.",
        tags: ["Usuario"],
        responses: {
          "200": { description: "Cuenta eliminada correctamente." },
        },
      },
    },
  },
};