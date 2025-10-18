
# Paz Financiera — App para clientes (v2)

App web (Vite + React + TS + Tailwind) con backend **Supabase** (PostgreSQL + Auth + RLS).

## Novedades v2
- ✅ Exportación a **PDF** (Radiografía y Plan de Deudas)
- ✅ Importación **CSV** (Ingresos/Gastos/Deudas) para onboarding rápido
- ✅ **EmailJS** para enviar correo al crear tareas
- ✅ Esquema de **Households** (pareja/familia) listo para compartir datos

## Requisitos
- Cuenta en Supabase, Vercel y GitHub
- Variables de entorno en Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - (opcional) `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

## Pasos rápidos
1. Sube este repo a GitHub.
2. En Supabase ejecuta `supabase.sql` (SQL Editor) y activa Auth por Email.
3. En Vercel importa el repo y configura env vars.
4. Deploy.

## PDF e Importadores
- PDF: usa botones en Radiografía/Deudas para exportar el contenedor visible.
- CSV: componente en Radiografía/Deudas para importar encabezados comunes (puedes adaptar los mappings).
