
import { supabase } from './supabaseClient'

export async function getActiveHouseholdId(): Promise<string | null> {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return null
  const { data } = await supabase.from('profiles').select('preferred_household_id').eq('user_id', user.id).maybeSingle()
  return data?.preferred_household_id ?? null
}

export async function createHousehold(name: string) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return
  const { data: h, error } = await supabase.from('households').insert({ name, created_by: user.id }).select().single()
  if (error) throw error
  await supabase.from('household_members').insert({ household_id: h.id, user_id: user.id, role: 'owner' })
  await supabase.from('profiles').update({ preferred_household_id: h.id }).eq('user_id', user.id)
  return h.id as string
}

export async function listMyHouseholds() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return []
  const { data } = await supabase
    .from('household_members')
    .select('household_id, households(name)')
    .eq('user_id', user.id)
  return data ?? []
}
