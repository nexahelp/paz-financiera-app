
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import { getActiveHouseholdId } from '@lib/households'

export default function Fondo() {
  const [goal, setGoal] = useState<number>(0)
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => { refresh() }, [])

  async function refresh() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    const householdId = await getActiveHouseholdId()
    const base = householdId ? { household_id: householdId } : { user_id: user.id }
    const { data } = await supabase.from('savings_fund').select('*').match(base).maybeSingle()
    if (data) { setGoal(Number(data.goal)); setCurrent(Number(data.current)) }
  }

  async function save() {
    const user = (await supabase.auth.getUser()).data.user
    const householdId = await getActiveHouseholdId()
    const base = householdId ? { household_id: householdId } : { user_id: user!.id }
    const { data } = await supabase.from('savings_fund').select('id').match(base).maybeSingle()
    if (data?.id) {
      await supabase.from('savings_fund').update({ goal, current, updated_at: new Date().toISOString() }).eq('id', data.id)
    } else {
      await supabase.from('savings_fund').insert({ goal, current, user_id: user!.id, household_id: householdId })
    }
    refresh()
  }

  const pct = goal > 0 ? Math.min(100, Math.round((current/goal)*100)) : 0

  return (
    <div className="max-w-xl card mx-auto">
      <div className="card-header">Fondo de Paz Financiera</div>
      <div className="card-body space-y-3">
        <label className="label">Meta total (3–6 meses de gastos esenciales)</label>
        <input className="input" type="number" value={goal} onChange={e=>setGoal(e.target.valueAsNumber||0)} />
        <label className="label">Ahorro actual</label>
        <input className="input" type="number" value={current} onChange={e=>setCurrent(e.target.valueAsNumber||0)} />
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-success" style={{width: pct+'%'}} /></div>
        <p className="text-sm text-slate-600">{pct}% alcanzado</p>
        <button className="btn btn-primary" onClick={save}>Guardar</button>
      </div>
    </div>
  )
}
