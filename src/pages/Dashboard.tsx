
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import { getActiveHouseholdId } from '@lib/households'

export default function Dashboard() {
  const [summary, setSummary] = useState<{ ingresos:number, gastos:number, deuda:number, fondo:number }|null>(null)

  useEffect(() => {
    (async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      const householdId = await getActiveHouseholdId()

      const filters = (q:any) => householdId ? q.eq('household_id', householdId) : q.eq('user_id', user.id)

      const [{ data: inc }, { data: exp }, { data: deb }, { data: fund }] = await Promise.all([
        filters(supabase.from('incomes').select('amount')),
        filters(supabase.from('expenses').select('amount')),
        filters(supabase.from('debts').select('balance')),
        filters(supabase.from('savings_fund').select('current')).maybeSingle()
      ])

      const ingresos = (inc ?? []).reduce((a, b:any) => a + Number(b.amount), 0)
      const gastos = (exp ?? []).reduce((a, b:any) => a + Number(b.amount), 0)
      const deuda = (deb ?? []).reduce((a, b:any) => a + Number(b.balance), 0)
      const fondo = fund?.current ? Number(fund.current) : 0
      setSummary({ ingresos, gastos, deuda, fondo })
    })()
  }, [])

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Stat title="Ingresos" value={summary?.ingresos ?? 0} prefix="$" />
      <Stat title="Gastos" value={summary?.gastos ?? 0} prefix="$" />
      <Stat title="Deuda total" value={summary?.deuda ?? 0} prefix="$" />
      <Stat title="Fondo de Paz" value={summary?.fondo ?? 0} prefix="$" />
    </div>
  )
}

function Stat({ title, value, prefix='' }: { title:string, value:number, prefix?:string }) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body text-2xl font-semibold">{prefix}{value.toLocaleString()}</div>
    </div>
  )
}
