
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import { exportSectionToPDF } from '@lib/pdf'
import CsvImport from '@components/CsvImport'
import { getActiveHouseholdId } from '@lib/households'

export default function Deudas() {
  const [debts, setDebts] = useState<any[]>([])
  const [newDebt, setNewDebt] = useState({ creditor:'', type:'tarjeta', balance:0, min_payment:0, rate:0 })

  useEffect(() => { refresh() }, [])

  async function refresh() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    const householdId = await getActiveHouseholdId()
    const base = householdId ? { household_id: householdId } : { user_id: user.id }
    const { data } = await supabase.from('debts').select('*').match(base).order('balance',{ascending:true})
    setDebts(data ?? [])
  }

  async function addDebt() {
    const user = (await supabase.auth.getUser()).data.user
    const householdId = await getActiveHouseholdId()
    await supabase.from('debts').insert({ ...newDebt, balance:Number(newDebt.balance)||0, min_payment:Number(newDebt.min_payment)||0, rate:Number(newDebt.rate)||0, user_id: user!.id, household_id: householdId })
    setNewDebt({ creditor:'', type:'tarjeta', balance:0, min_payment:0, rate:0 })
    refresh()
  }

  const snowball = useMemo(() => debts.slice().sort((a,b)=>Number(a.balance)-Number(b.balance)), [debts])

  return (
    <div>
      <div id="deudas-container" className="grid md:grid-cols-2 gap-6">
        <section className="card">
          <div className="card-header">Registrar deuda</div>
          <div className="card-body space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Acreedor" value={newDebt.creditor} onChange={e=>setNewDebt({...newDebt,creditor:e.target.value})} />
              <select className="input" value={newDebt.type} onChange={e=>setNewDebt({...newDebt,type:e.target.value})}>
                <option value="tarjeta">Tarjeta</option>
                <option value="prestamo">Préstamo</option>
                <option value="hipoteca">Hipoteca</option>
                <option value="otro">Otro</option>
              </select>
              <input className="input" type="number" placeholder="Saldo" value={newDebt.balance} onChange={e=>setNewDebt({...newDebt,balance:e.target.valueAsNumber||0})} />
              <input className="input" type="number" placeholder="Pago mínimo" value={newDebt.min_payment} onChange={e=>setNewDebt({...newDebt,min_payment:e.target.valueAsNumber||0})} />
              <input className="input" type="number" placeholder="Tasa anual %" value={newDebt.rate} onChange={e=>setNewDebt({...newDebt,rate:e.target.valueAsNumber||0})} />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={addDebt}>Agregar deuda</button>
              <CsvImport table="debts" mapping={{ "Acreedor":"creditor", "Tipo":"type", "Saldo":"balance", "Pago minimo":"min_payment", "Tasa":"rate" }} />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">Plan de Bola de Nieve</div>
          <div className="card-body">
            <ol className="list-decimal pl-6 space-y-2">
              {snowball.map((d, idx) => (
                <li key={d.id} className="flex justify-between">
                  <span>#{idx+1} {d.creditor} — {d.type}</span>
                  <span>${Number(d.balance).toLocaleString()} <span className="text-slate-500 text-sm">(mín {Number(d.min_payment).toLocaleString()})</span></span>
                </li>
              ))}
            </ol>
            {snowball.length === 0 && <p>No hay deudas registradas.</p>}
          </div>
        </section>
      </div>

      <button className="btn mt-4" onClick={() => exportSectionToPDF('deudas-container','plan-de-deudas.pdf')}>
        Exportar Plan (PDF)
      </button>
    </div>
  )
}
