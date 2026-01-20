Actúa como un Senior Full-Stack Developer experto en Next.js 14 (App Router), Convex y Clerk.

Estoy integrando la autenticación en mi proyecto.
Mis API Keys de Clerk ya están configuradas en el archivo `.env.local`.

Objetivo:
Implementar autenticación completa restringiendo el acceso administrativo.

Instrucciones paso a paso para ejecutar:

1. INSTALACIÓN:
   - Ejecuta el comando para instalar `@clerk/nextjs` y `convex-react-clerk` (o la librería necesaria para conectar ambos).

2. CONFIGURACIÓN BACKEND (Convex):
   - Crea el archivo `convex/auth.config.ts`.
   - Estructura el archivo exportando el objeto `providers`.
   - IMPORTANTE: Deja un comentario o un string vacío donde va el `domain` (Issuer URL) para que yo lo rellene manualmente después.

3. CONFIGURACIÓN FRONTEND (Providers):
   - Busca mi archivo `ConvexClientProvider.tsx` (o donde se defina el `ConvexReactClient`).
   - Envuelve la aplicación integrando `<ClerkProvider>` y `<ConvexProviderWithClerk>`.
   - Asegúrate de pasar el prop `useAuth={useAuth}` al provider de Convex.

4. MIDDLEWARE (Protección de Rutas):
   - Crea el archivo `middleware.ts` en la raíz del proyecto.
   - Configura `clerkMiddleware` para definir las rutas.
   - REGLA DE ORO: Toda la aplicación es PÚBLICA, excepto cualquier ruta que empiece por `/admin`. Protege `/admin` para que redirija al login si no hay sesión.

5. PÁGINA DE LOGIN:
   - Crea la ruta `app/sign-in/[[...sign-in]]/page.tsx`.
   - Renderiza el componente `<SignIn />` de Clerk centrado vertical y horizontalmente.

6. SEGURIDAD DE DATOS (Whitelist):
   - Crea un archivo de ejemplo en `convex/admin.ts`.
   - Escribe una `query` llamada `getAdminData` que:
     a) Verifique `ctx.auth.getUserIdentity()`.
     b) Si no hay usuario, lance error.
     c) Si el email del usuario NO es "admin@oasis.cr" (o mi email), lance error de autorización.

Ejecuta estos pasos y confirma cuando estés listo para que yo ponga la Issuer URL.