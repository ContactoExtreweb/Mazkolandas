// Reduce una imagen en el navegador antes de subirla. JPEG a propósito: Safari de
// iPhone no sabe generar WebP con canvas.toBlob (lección de Guadicar).
// La usan el formulario de entradas (fotos) y el del vino (etiquetas).

/**
 * @param {File} file
 * @param {number} lado lado mayor máximo en píxeles
 * @param {number} calidad 0–1
 * @returns {Promise<Blob>}
 */
export async function comprimir(file, lado = 1600, calidad = 0.8) {
  const img = await createImageBitmap(file)
  const k = Math.min(1, lado / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * k)
  canvas.height = Math.round(img.height * k)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  img.close()
  return new Promise((ok, mal) =>
    canvas.toBlob((b) => (b ? ok(b) : mal(new Error('No se pudo comprimir'))), 'image/jpeg', calidad),
  )
}

/** Ruta dentro del bucket "cuaderno" a partir de la URL pública de un archivo. */
export const rutaEnBucket = (url) => String(url ?? '').split('/object/public/cuaderno/')[1]
