
import { Link } from 'react-router-dom'
import { supabase } from '@lib/supabaseClient'

export default function NavBar({ session }: { session: any }) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="font-semibold text-brand-700">Paz Financiera</Link>
        {session && (
          <nav className="flex gap-4 text-sm">
            <Link to="/">Dashboard</Link>
            <Link to="/radiografia">Radiografía</Link>
            <Link to="/deudas">Deudas</Link>
            <Link to="/fondo">Fondo</Link>
            <Link to="/tareas">Tareas</Link>
            <Link to="/recursos">Recursos</Link>
            <Link to="/perfil">Perfil</Link>
            <Link to="/coach">Coach</Link>
            <button className="ml-4 btn" onClick={() => supabase.auth.signOut()}>Salir</button>
          </nav>
        )}
      </div>
    </header>
  )
}
