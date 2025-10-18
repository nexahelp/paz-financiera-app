
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import NavBar from '@components/NavBar'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) navigate('/')
    })
    return () => listener.subscription.unsubscribe()
  }, [navigate])

  return (
    <div>
      <NavBar session={session} />
      <main className="container py-6">
        {!session ? <AuthLanding /> : <Outlet />}
      </main>
    </div>
  )
}

function AuthLanding() {
  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
    if (error) alert(error.message)
    else setMagicSent(true)
  }

  return (
    <div className="max-w-md mx-auto card">
      <div className="card-header">Bienvenido a Paz Financiera</div>
      <div className="card-body space-y-3">
        {magicSent ? (
          <p>Revisa tu correo para el enlace mágico de acceso.</p>
        ) : (
          <>
            <label className="label">Correo</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" />
            <button className="btn btn-primary w-full mt-2" onClick={signIn}>Ingresar</button>
          </>
        )}
        <p className="text-sm text-slate-500">Al ingresar aceptas nuestras políticas de privacidad.</p>
      </div>
    </div>
  )
}
