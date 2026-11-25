This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Administrar el portafolio

El panel privado está disponible en `/admin`. Supabase Auth administra el inicio de sesión, la recuperación de contraseña y las sesiones; las tablas y Storage protegen el acceso con RLS.

1. Crea un proyecto Supabase y configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el entorno de ejecución. `.env.example` contiene los nombres de las variables. Nunca agregues secretos reales al repositorio.
2. Ejecuta las migraciones de `supabase/migrations/` en orden. Con Supabase CLI, usa `supabase db push`; en el SQL Editor, ejecuta cada archivo en orden. La migración `20261125132000_blog_posts.sql` crea el blog y conserva los seis artículos existentes como publicaciones iniciales. Si la migración inicial ya se aplicó, ejecuta `20261124164500_authorize_all_portfolio_admins.sql`.
3. La migración autoriza todas las cuentas existentes de **Authentication → Users** y también las cuentas que se creen allí en el futuro.
4. Añade `/admin/cambiar-contrasena` a las URLs de redirección permitidas de Authentication y configura las plantillas SMTP y de recuperación de Supabase.
5. Inicia el sitio y accede en `/admin/login`. Si la sesión anterior se cerró por falta de permiso, vuelve a iniciar sesión después de aplicar la migración.

**Importante:** todas las cuentas de Supabase Auth tendrán acceso administrativo. Si el registro público está habilitado, cualquier persona que se registre también podrá administrar proyectos, imágenes y artículos del blog; desactívalo si solo quieres permitir cuentas creadas de forma controlada desde Supabase.

`SUPABASE_SERVICE_ROLE_KEY` no se necesita en el frontend ni en el flujo actual. Si en el futuro se configura para tareas administrativas del servidor, solo debe leerse en módulos de servidor y nunca con el prefijo `NEXT_PUBLIC_`.

El bucket privado `portfolio-images` acepta imágenes JPEG, PNG y WebP de hasta 8 MB. Las vistas públicas generan enlaces firmados solo después de comprobar que el proyecto está publicado; la administración verifica la identidad y el permiso antes de mostrar imágenes de borrador.

La descripción admite formato enriquecido y se limpia antes de mostrarse. El detalle público usa la ruta `/portafolio/[slug]`; los datos de las páginas y los resultados de búsqueda se rigen por RLS.

## Aplicación web progresiva (PWA)

La aplicación incluye un manifiesto, iconos instalables y un service worker. En producción, publícala mediante HTTPS; `localhost` también permite probar estas funciones.
Los iconos PWA y las variantes del logo están en `public/icons/`; el favicon del navegador está en `app/favicon.ico`.

- **Android:** abre el sitio en Chrome y usa el aviso **Instalar** cuando aparezca, o el menú de Chrome → **Instalar aplicación**.
- **iPhone y iPad:** abre el sitio en Safari, toca **Compartir** → **Añadir a pantalla de inicio** → **Añadir**.
- **Sin conexión:** se conserva una versión local de páginas públicas estáticas y recursos ya visitados, y hay una pantalla de respaldo. Se muestra un aviso cuando el contenido guardado podría estar desactualizado.

El panel, el portafolio dinámico, Supabase y los envíos requieren conexión. Las rutas administrativas, las respuestas de API y los datos de sesión no se guardan en la caché. Si cambian los recursos estáticos, incrementa `CACHE_VERSION` en `public/sw.js` para activar una caché nueva.

## Google Analytics 4

Las páginas públicas cargan Google Analytics 4 con el ID de medición `G-MZD19EGP7C`. Los eventos de navegación se envían en los cambios de ruta; las rutas `/admin` quedan excluidas.

## Formulario de contacto

El formulario envía las solicitudes a `contacto@webprols.com` mediante SMTP de Hostinger y envía al correo ingresado una copia con la confirmación y el resumen de los datos enviados. Configura `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` y `SMTP_PASSWORD` en el archivo local `.env` o en las variables privadas del entorno donde se despliega la aplicación. Usa `smtp.hostinger.com`, puerto `465` con SSL, el buzón `contacto@webprols.com` y la contraseña de ese buzón. Para el puerto `587`, configura `SMTP_PORT=587`.

El envío usa SMTP; no necesita configuración IMAP. Nunca publiques ni compartas `SMTP_PASSWORD`, y no la agregues a `.env.example`, al repositorio ni a variables con prefijo `NEXT_PUBLIC_`.
