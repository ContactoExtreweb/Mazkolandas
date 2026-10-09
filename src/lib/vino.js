// Lectura del vino (una sola fila en la tabla `vino`). Si no hay Supabase o la
// tabla aún no existe, se usan los valores por defecto de src/data/vino.js.
import { supabase } from './supabase.js'
import { VINO } from '../data/vino.js'

/** Fila de la tabla → la forma que usan la home y la botella 3D. */
export function mapVino(r) {
  if (!r) return VINO
  const comprar = (texto, url) => (texto && url ? { texto, url } : null)
  return {
    listo: !!r.listo,
    botella: {
      forma: r.forma ?? VINO.botella.forma,
      vidrio: r.vidrio ?? VINO.botella.vidrio,
      liquido: r.liquido ?? VINO.botella.liquido,
      capsula: r.capsula ?? VINO.botella.capsula,
      etiqueta: r.etiqueta || null,
      etiquetaVuelta: r.etiqueta_vuelta ?? VINO.botella.etiquetaVuelta,
      contraetiqueta: r.contraetiqueta || null,
      modelo: r.modelo || null,
    },
    es: {
      nombre: r.nombre ?? '',
      tipo: r.tipo ?? '',
      uva: r.uva ?? '',
      anada: r.anada ?? '',
      elaboracion: r.elaboracion ?? '',
      nota: r.nota ?? '',
      comprar: comprar(r.comprar_texto, r.comprar_url),
    },
    // En euskera, lo que no esté traducido cae al castellano (el nombre suele ser el mismo)
    eu: {
      nombre: r.nombre_eu || r.nombre || '',
      tipo: r.tipo_eu || r.tipo || '',
      uva: r.uva_eu || r.uva || '',
      anada: r.anada_eu || r.anada || '',
      elaboracion: r.elaboracion_eu || '',
      nota: r.nota_eu || '',
      comprar: comprar(r.comprar_texto_eu || r.comprar_texto, r.comprar_url),
    },
  }
}

export async function getVino() {
  if (!supabase) return VINO
  const { data, error } = await supabase.from('vino').select('*').eq('id', 1).maybeSingle()
  if (error) {
    console.warn('[vino] Uso los valores por defecto:', error.message)
    return VINO
  }
  return mapVino(data)
}
