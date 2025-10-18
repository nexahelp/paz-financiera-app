
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import { createHousehold, listMyHouseholds } from '@lib/households'

export default function Perfil() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [households, setHouseholds] = useState<any[]>([])
  const [householdName, setHouseholdName] = useState('')

  useEffect(() => { refresh() }, [])

  async function refresh() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    setEmail(user.email ?? '')
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
    if (data) setFullName(data.full_name || '')
    const hs = await listMyHouseholds()
    setHouseholds(hs)
  }

  async function save() {
    const user = (await supabase.auth.getUser()).data.user
    const { data } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle()
    if (data?.id) await supabase.from('profiles').update({ full_name: fullName }).eq('id', data.id)
    else await supabase.from('profiles').insert({ full_name: fullName, user_id: user!.id, email })
    refresh()
  }

  async function onCreateHousehold() {
    if (!householdName.trim()) return
    await createHousehold(householdName.trim())
    setHouseholdName('')
    refresh()
  }

  return (
    <div className="max-w-lg card mx-auto">
      <div className="card-header">Perfil</div>
      <div className="card-body space-y-4">
        <div>
          <label className="label">Nombre completo</label>
          <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">Correo</label>
          <input className="input bg-slate-100" value={email} disabled />
        </div>
        <button className="btn btn-primary" onClick={save}>Guardar</button>

        <hr className="my-4" />
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Hogares (pareja/familia)</h3>
          </div>
          <ul className="mt-2 space-y-1">
            {households.map((h:any) => (
              <li key={h.household_id} className="text-sm">{h.households?.name || h.household_id}</li>
            ))}
            {households.length === 0 && <li className="text-sm text-slate-500">Aún no tienes hogares.</li>}
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <input className="input col-span-2" placeholder="Nombre del hogar (p. ej. Familia Fontecha)"
              value={householdName} onChange={e=>setHouseholdName(e.target.value)} />
            <button className="btn" onClick={onCreateHousehold}>Crear</button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Luego podrás invitar a tu pareja/familia agregándolos en Supabase → household_members.</p>
        </div>
      </div>
    </div>
  )
}
