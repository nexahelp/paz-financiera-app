
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'

export default function Coach() {
  const [isCoach, setIsCoach] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => { (async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    const { data: coach } = await supabase.from('coaches').select('user_id').eq('user_id', user.id).maybeSingle()
    setIsCoach(!!coach)
    if (coach) {
      const [{ data: cl }, { data: ts }] = await Promise.all([
        supabase.from('profiles').select('full_name, email, user_id'),
        supabase.from('tasks').select('*').order('created_at', { ascending: false })
      ])
      setClients(cl ?? []); setTasks(ts ?? [])
    }
  })() }, [])

  async function assignTask(uid: string) {
    const title = prompt('Tarea para el cliente:')
    if (!title) return
    const currentUser = (await supabase.auth.getUser()).data.user
    await supabase.from('tasks').insert({ user_id: uid, title, created_by: currentUser?.id })
    const { data: ts } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    setTasks(ts ?? [])
  }

  if (!isCoach) return <p>Acceso restringido. Si eres coach, pide que te activen en la tabla <code>coaches</code>.</p>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="card">
        <div className="card-header">Clientes</div>
        <div className="card-body">
          <ul className="divide-y">
            {clients.map(c => (
              <li key={c.user_id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.full_name || c.email}</p>
                  <p className="text-xs text-slate-500">{c.email}</p>
                </div>
                <button className="btn" onClick={()=>assignTask(c.user_id)}>Asignar tarea</button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="card">
        <div className="card-header">Tareas recientes</div>
        <div className="card-body">
          <ul className="divide-y">
            {tasks.map(t => (
              <li key={t.id} className="py-2 flex justify-between">
                <span>{t.title}</span>
                <span className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
