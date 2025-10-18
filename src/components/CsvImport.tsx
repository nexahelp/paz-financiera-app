
import Papa from 'papaparse'
import { supabase } from '@lib/supabaseClient'
import { getActiveHouseholdId } from '@lib/households'

type Table = 'incomes'|'expenses'|'debts'
export default function CsvImport({ table, mapping }:{ table:Table, mapping:Record<string,string> }) {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const user = (await supabase.auth.getUser()).data.user
    const householdId = await getActiveHouseholdId()
    Papa.parse(file, {
      header: true,
      complete: async (results: Papa.ParseResult<any>) => {
        const rows = (results.data as any[]).filter(Boolean).map(r => {
          const obj:any = { user_id: user!.id }
          if (householdId) obj.household_id = householdId
          Object.entries(mapping).forEach(([csvKey, dbKey]) => { obj[dbKey] = (r as any)[csvKey] })
          ;['amount','balance','min_payment','rate'].forEach(k=>{ if(obj[k]!==undefined) obj[k]=Number(String(obj[k]).replace(',','.'))||0 })
          if (obj['essential']!==undefined) obj['essential'] = String(obj['essential']).toLowerCase() in { 'true':1, '1':1, 'si':1, 'sí':1 }
          return obj
        })
        if (rows.length) {
          const { error } = await supabase.from(table).insert(rows)
          if (error) alert(error.message)
          else alert(`Importadas ${rows.length} filas a ${table}`)
        }
      }
    })
  }

  return (
    <label className="btn cursor-pointer">
      Importar CSV
      <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
    </label>
  )
}
