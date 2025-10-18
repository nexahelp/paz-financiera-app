
# Paz Financiera App (v2.1 FULL)

App completa con **React + TypeScript + Tailwind + Supabase** (lista para GitHub + Vercel).

## Despliegue rápido
1) Sube este contenido a un repo de **GitHub** (no subas el ZIP, sube los archivos).  
2) En **Supabase → Settings → API**, copia **Project URL** y **anon public**.  
3) En **Vercel → Import Project (desde tu GitHub)**, añade variables:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
```
(Opcional EmailJS)
```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```
4) Deploy. Si ves pantalla en blanco, revisa las variables y redeploy.

## Scripts
- `npm run dev` — entorno local
- `npm run build` — compilar
- `npm run preview` — vista previa del build

## Estructura
- `src/pages` — vistas (Dashboard, Radiografia, Deudas, Fondo, Tareas, Recursos, Perfil, Coach)
- `src/lib` — supabase client, pdf, email, households
- `src/components` — NavBar, CsvImport
- `supabase-fixed.sql` — esquema y políticas RLS
