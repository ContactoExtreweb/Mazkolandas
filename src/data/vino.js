// Valores por defecto del vino. Los de verdad se editan en el panel (/admin/vino/)
// y viven en la tabla `vino` de Supabase (ver sql/2026-10-vino.sql). Estos solo se
// usan en local sin Supabase o si la tabla aún no existe.
//
// Mientras `listo` sea false, la home enseña una botella de muestra (dibujada en 3D
// por código, con una etiqueta provisional) y la ficha dice "por anunciar".

export const VINO = {
  listo: false,

  botella: {
    forma: 'bordelesa', // 'bordelesa' (hombros marcados) | 'borgonona' (caída suave)
    vidrio: '#3f6234', // tono del vidrio (verde de botella de tinto; más oscuro = se ve menos el vino)
    liquido: '#4a0b17', // color del vino que se ve dentro
    capsula: '#6b1f3a',
    etiqueta: null, // URL del arte plano de la etiqueta (la imagen que va pegada)
    etiquetaVuelta: 0.42, // qué parte del contorno cubre la etiqueta (0–1)
    contraetiqueta: null,
    modelo: null, // URL de un .glb con su botella exacta (sustituye a la dibujada)
  },

  es: { nombre: '', tipo: '', uva: '', anada: '', elaboracion: '', nota: '', comprar: null },
  eu: { nombre: '', tipo: '', uva: '', anada: '', elaboracion: '', nota: '', comprar: null },
}
