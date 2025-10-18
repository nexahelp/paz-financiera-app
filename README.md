
# 🧭 Paz Financiera App (v2.1)

Aplicación web completa construida con **React + TypeScript + Tailwind + Supabase**.

## 🚀 Instrucciones para desplegar en GitHub + Vercel

### 1️⃣ Subir a GitHub
1. Crea un repositorio en GitHub llamado `paz-financiera-app`.
2. Sube todos los archivos de esta carpeta (no subas el ZIP, sino el contenido).
3. Verifica que se vean carpetas como `src`, `package.json`, `vite.config.ts`.

### 2️⃣ Configurar Supabase
1. Ve a [https://supabase.com](https://supabase.com) → Sign in.
2. Crea un nuevo proyecto.
3. Entra al menú **Settings → API**.
4. Copia tu:
   - `Project URL` → para `VITE_SUPABASE_URL`
   - `anon public key` → para `VITE_SUPABASE_ANON_KEY`
5. En el menú **SQL Editor**, copia y ejecuta el contenido de `supabase-fixed.sql`.
6. Activa **Auth → Providers → Email**.

### 3️⃣ Configurar Vercel
1. Entra a [https://vercel.com](https://vercel.com) → Sign in con tu GitHub.
2. Haz clic en **Add New Project** → selecciona `paz-financiera-app`.
3. En “Environment Variables”, agrega:
   ```
   VITE_SUPABASE_URL=https://tuproyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_publica
   ```
   (Opcional si usarás correos automáticos)
   ```
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
4. Asegúrate que el **Build Command** sea `npm run build` y el **Output Directory** sea `dist`.
5. Clic en **Deploy**.

### 4️⃣ Comprobar
- Si aparece la pantalla de login de Paz Financiera, ¡todo salió bien!
- Revisa tu correo para el “enlace mágico” de Supabase.
- Entra y prueba registrar ingresos, gastos, deudas, tareas, etc.

### 🧠 Consejos
- No uses la `service_role key` en el frontend.
- Cada cambio que hagas en GitHub se publicará automáticamente en Vercel.
- Si el build falla, verifica el nombre del proyecto (solo letras y guiones).

---
🧩 Creado para **Coach Ana Karina Fontecha** — Sistema de Paz Financiera 💚
