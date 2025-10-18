
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'

export default function Recursos() {
  const [res, setRes] = useState<any[]>([])

  useEffect(() => { (async () => {
    const { data } = await supabase.from('resources').select('*').order('level').order('title')
    setRes(data ?? [])
  })() }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {res.map(r => (
        <a key={r.id} href={r.url || '#'} target="_blank" className="card hover:shadow-md transition">
          <div className="card-header">{r.title}</div>
          <div className="card-body">
            <span className="badge">{r.level}</span>
            <p className="mt-2 text-sm text-slate-600">Tipo: {r.kind}</p>
          </div>
        </a>
      ))}
      {res.length === 0 && <p>No hay recursos disponibles aún.</p>}
    </div>
  )
}
