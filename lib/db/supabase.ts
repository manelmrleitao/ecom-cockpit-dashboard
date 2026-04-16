/**
 * Cliente Supabase
 * Configuração para conectar com o banco de dados
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found in environment variables')
}

/**
 * Cliente para uso no lado do cliente
 */
export const supabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '')

/**
 * Função helper para criar cliente com service role key (servidor)
 */
export function createSupabaseServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not found in environment variables')
  }

  return createClient(supabaseUrl || '', serviceRoleKey)
}

export default supabaseClient
