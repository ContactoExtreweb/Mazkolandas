import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.PUBLIC_SUPABASE_URL
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// null en local sin .env: el panel avisa en vez de romperse.
export const supabase = url && key ? createClient(url, key) : null
