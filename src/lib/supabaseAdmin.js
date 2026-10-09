import { createClient } from '@supabase/supabase-js'

// Cliente SOLO para el servidor (endpoints /api). Usa la service_role, que es
// secreta y nunca debe llegar al navegador. null si falta la variable (en local).
const url = import.meta.env.PUBLIC_SUPABASE_URL
const key = import.meta.env.SUPABASE_SERVICE_KEY

export const supabaseAdmin = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
