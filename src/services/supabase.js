import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing — running in local-only mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Etiket CRUD ─────────────────────────────────────────────────────────────

export async function saveEtiketToCloud(etiket) {
  if (!supabase) return { error: 'No Supabase connection', data: null }
  const { data, error } = await supabase
    .from('etiket')
    .insert([etiket])
    .select()
    .single()
  return { data, error }
}

export async function fetchEtiketHistory(limit = 50) {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('etiket')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data || [], error }
}

export async function deleteEtiket(id) {
  if (!supabase) return { error: null }
  const { error } = await supabase
    .from('etiket')
    .delete()
    .eq('id', id)
  return { error }
}

export async function fetchApotekSettings() {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase
    .from('apotek_settings')
    .select('*')
    .single()
  return { data, error }
}

export async function upsertApotekSettings(settings) {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase
    .from('apotek_settings')
    .upsert(settings, { onConflict: 'id' })
    .select()
    .single()
  return { data, error }
}
