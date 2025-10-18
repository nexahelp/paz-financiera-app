
import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import { exportSectionToPDF } from '@lib/pdf'
import CsvImport from '@components/CsvImport'
import { getActiveHouseholdId } from '@lib/households'

export default function Radiografia() {
  const [incomes, setIncomes] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [newIncome, setNewIncome] = useState({ source:'', amount:0, kind:'fijo' })
  const [newExpense, setNewExpense] = useState({ category:'', amount:0, essential:true })

  useEffect(() => { refresh() }, [])

  async function refresh() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    const householdId = await getActiveHouseholdId()
    const base = householdId ? { household_id: householdId } : { user_id: user.id }
    const { data: inc } = await supabase.from('incomes').select('*').match(base).order('created_at',{ascending:false})
    const { data: exp } = await supabase.from('expenses').select('*').match(base).order('created_at',{ascending:false})
    setIncomes(inc??[]); setExpenses(exp??[])
  }

  async function addIncome() {
    const user = (await supabase.auth.getUser()).data.user
    const householdId = await getActiveHouseholdId()
    await supabase.from('incomes').insert({ ...newIncome, amount: Number(newIncome.amount), user_id: user!.id, household_id: householdId })
    setNewIncome({ source:'', amount:0, kind:'fijo' }); refresh()
  }
  async function addExpense() {
    const user = (await supabase.auth.getUser()).data.user
    const householdId = await getActiveHouseholdId()
    await supabase.from('expenses').insert({ ...newExpense, amount: Number(newExpense.amount), user_id: user!.id, household_id: householdId })
    setNewExpense({ category:'', amount:0, essential:true }); refresh()
  }

  return (
    <div>
      <div id="radiografia-container" className="grid md:grid-cols-2 gap-6">
        <section className="card">
          <div className="card-header flex items-center justify-between">
            <span>Ingresos</span>
            <CsvImport table="incomes" mapping={{ "Fuente":"source", "Monto":"amount", "Tipo":"kind" }} />
          </div>
          <div className="card-body space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input className="input col-span-1" placeholder="Fuente" value={newIncome.source} onChange={e=>setNewIncome({...newIncome,source:e.target.value})} />
              <input className="input col-span-1" type="number" placeholder="Monto" value={newIncome.amount} onChange={e=>setNewIncome({...newIncome,amount:e.target.valueAsNumber||0})} />
              <select className="input col-span-1" value={newIncome.kind} onChange={e=>setNewIncome({...newIncome,kind:e.target.value})}>
                <option value="fijo">Fijo</option>
                <option value="variable">Variable</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={addIncome}>Agregar ingreso</button>
            <ul className="divide-y">
              {incomes.map(i => <li key={i.id} className="py-2 flex justify-between"><span>{i.source} • {i.kind}</span><span>${Number(i.amount).toLocaleString()}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="card">
          <div className="card-header flex items-center justify-between">
            <span>Gastos</span>
            <CsvImport table="expenses" mapping={{ "Categoria":"category", "Monto":"amount", "Esencial":"essential" }} />
          </div>
          <div className="card-body space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input className="input col-span-1" placeholder="Categoría" value={newExpense.category} onChange={e=>setNewExpense({...newExpense,category:e.target.value})} />
              <input className="input col-span-1" type="number" placeholder="Monto" value={newExpense.amount} onChange={e=>setNewExpense({...newExpense,amount:e.target.valueAsNumber||0})} />
              <select className="input col-span-1" value={String(newExpense.essential)} onChange={e=>setNewExpense({...newExpense,essential:e.target.value==='true'})}>
                <option value="true">Esencial</option>
                <option value="false">No esencial</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={addExpense}>Agregar gasto</button>
            <ul className="divide-y">
              {expenses.map(x => <li key={x.id} className="py-2 flex justify-between"><span>{x.category} {x.essential? '• esencial':''}</span><span>${Number(x.amount).toLocaleString()}</span></li>)}
            </ul>
          </div>
        </section>
      </div>

      <button className="btn mt-4" onClick={() => exportSectionToPDF('radiografia-container','radiografia.pdf')}>
        Exportar Radiografía (PDF)
      </button>
    </div>
  )
}
