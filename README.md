# 💰 Finanzas App - Prueba Técnica Fullstack

Aplicación web para la gestión de ingresos, egresos y control de usuarios. Este proyecto implementa un sistema robusto de roles (RBAC), reportes financieros, selección de fechas personalizada y seguridad moderna.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js (Pages Router):** Framework principal.
- **TypeScript:** Tipado estático estricto.
- **Tailwind CSS:** Estilos modernos y responsivos.
- **Shadcn UI:** Componentes de interfaz accesibles y elegantes.
- **Recharts:** Visualización de datos financieros.

### Backend & Seguridad
- **Next.js API Routes:** API RESTful documentada.
- **Better Auth:** Autenticación segura con GitHub OAuth.
- **Prisma ORM:** Manejo de base de datos eficiente.
- **PostgreSQL (Supabase):** Base de datos relacional en la nube.
- **Swagger/OpenAPI:** Documentación técnica detallada de endpoints.

### Calidad de Software (Testing)
- **Jest & React Testing Library:** Framework de pruebas.
- **Cobertura:** Pruebas unitarias para componentes visuales (UI) y lógica de negocio (validaciones matemáticas).

---

## 📋 Funcionalidades Principales

### 🔐 Seguridad y Roles
- **Autenticación:** Login social vía GitHub.
- **RBAC (Control de Acceso):**
  - **ADMIN:** Acceso total (Crear movimientos, gestionar usuarios, ver reportes).
  - **USER:** Acceso de lectura y privacidad (Solo ve sus propios registros).
  - *Nota:* Por defecto, los nuevos usuarios se crean como **ADMIN** para facilitar la revisión de la prueba.

### 📊 Gestión Financiera
- **Historial:** Tabla de Ingresos y Gastos con filtrado por concepto/usuario.
- **Selector de Fecha:** Permite registrar movimientos en fechas pasadas o futuras.
- **Seguridad de Datos:** Implementación de Row Level Security (RLS) a nivel de API (cada usuario solo ve lo que le corresponde).
- **Creación:** Formulario validado con alertas de error en tiempo real.

### 📈 Reportes y Exportación (Solo Admin)
- Gráficos comparativos de flujo de dinero (Ingresos vs Egresos).
- Cálculo de balance total en tiempo real.
- **Exportar a CSV:** Descarga directa de reportes financieros.

---

## 🛠️ Instrucciones de Instalación

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone <TU_URL_DEL_REPOSITORIO>
   cd prueba-prevalentware

2. **Instalar dependencias:**
   ```npm install

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz con las siguientes credenciales:
   ```env
   # Conexión a Base de Datos (Supabase Transaction Pooler)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[aws-0-region.pooler.supabase.com:6543/postgres](https://aws-0-region.pooler.supabase.com:6543/postgres)"

   # Configuración de Better Auth
   BETTER_AUTH_SECRET="generar_secreto_random"
   BETTER_AUTH_URL="http://localhost:3000"

   # Credenciales de GitHub OAuth
   GITHUB_CLIENT_ID="tu_github_client_id"
   GITHUB_CLIENT_SECRET="tu_github_client_secret"

4. **Sincronizar base de datos:**
   ```bash
   npx prisma db push

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev

## ☁️ Despliegue en Vercel

Este proyecto está optimizado para desplegarse en [Vercel](https://vercel.com/), la plataforma nativa de Next.js.

1. **Sube tu código a GitHub** (asegúrate de no subir el archivo `.env`).
2. Entra a **Vercel**, inicia sesión y haz clic en **"Add New Project"**.
3. Importa tu repositorio de GitHub.
4. **IMPORTANTE: Variables de Entorno**
   En la pantalla de configuración del despliegue, despliega la sección **"Environment Variables"** y agrega las siguientes (copia los valores de tu `.env` local):
   
   - `DATABASE_URL`: Tu conexión a Supabase.
   - `BETTER_AUTH_SECRET`: Tu secreto de autenticación.
   - `GITHUB_CLIENT_ID`: Tu ID de cliente de GitHub.
   - `GITHUB_CLIENT_SECRET`: Tu secreto de cliente de GitHub.
   - `BETTER_AUTH_URL`: **OJO:** Aquí NO pongas localhost. Debes poner la URL que Vercel te asignará (ej: `https://finanzas-app-dilan.vercel.app`).

5. Haz clic en **"Deploy"**. Vercel instalará las dependencias, generará el cliente de Prisma y construirá la aplicación automáticamente.


## 🧪 Pruebas y Documentación
### Ejecutar Tests Unitarios
El proyecto incluye 2 suites de pruebas:
1. **UI Tests:** Valida renderizado de componentes críticos (Login, Home).
2. **Logic Tests:** Valida funciones de utilidad (Formatos de moneda, validación de inputs).

Ejecutar comando:
```bash
npm test

## 📘 Documentación de API (Swagger)

El proyecto cuenta con documentación interactiva bajo el estándar **OpenAPI 3.0**.

### Acceso a la Documentación
Una vez iniciado el servidor, visita la siguiente ruta para ver los endpoints, probar las peticiones y ver los esquemas de datos:

👉 **URL:** [http://localhost:3000/docs](http://localhost:3000/docs)

### Endpoints Documentados
- **Transacciones:** `GET /list`, `POST /create` (Incluye ejemplos de JSON y códigos de respuesta 200/400/401).
- **Administración:** `GET /users`, `PUT /users` (Gestión de roles).
- **Reportes:** `GET /reports` (Datos financieros agregados).