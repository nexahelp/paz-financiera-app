
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import { sendTaskEmail } from '@lib/email'

export default function Tareas() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  useEffect(() => { refresh() }, [])

  async function refresh() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setTasks(data ?? [])
  }

  async function addTask() {
    const user = (await supabase.auth.getUser()).data.user
    await supabase.from('tasks').insert({ title, due_date: due || null, user_id: user!.id })
    // Enviar correo (si hay EmailJS configurado)
    const { data: prof } = await supabase.from('profiles').select('full_name,email').eq('user_id', user!.id).maybeSingle()
    if (prof?.email) await sendTaskEmail(prof.email, prof.full_name, title, due)
    setTitle(''); setDue(''); refresh()
  }

  async function toggle(id: string, status: string) {
    await supabase.from('tasks').update({ status: status === 'pendiente' ? 'hecha' : 'pendiente' }).eq('id', id)
    refresh()
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <div className="card-header">Compromisos</div>
      <div className="card-body space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <input className="input col-span-2" placeholder="Descripción" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" type="date" value={due} onChange={e=>setDue(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={addTask}>Agregar</button>
        <ul className="divide-y">
          {tasks.map(t => (
            <li key={t.id} className="py-2 flex items-center justify-between">
              <div>
                <p className={t.status==='hecha' ? 'line-through text-slate-400' : ''}>{t.title}</p>
                {t.due_date && <p className="text-xs text-slate-500">Vence: {new Date(t.due_date).toLocaleDateString()}</p>}
              </div>
              <button className="btn" onClick={()=>toggle(t.id, t.status)}>{t.status==='pendiente' ? 'Marcar hecha' : 'Marcar pendiente'}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
