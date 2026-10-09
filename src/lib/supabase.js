import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.PUBLIC_SUPABASE_URL
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// En local sin .env se trabaja con entradas de ejemplo (ver posts.js).
if ((!url || !key) && !import.meta.env.DEV)
  throw new Error('Faltan PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY')

export const supabase =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
