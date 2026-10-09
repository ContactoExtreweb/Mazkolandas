// Botella 3D realista: la de la home, la vista previa del panel y la demo.
// Se carga solo cuando hace falta (ver Botella.astro), así three.js no pesa en la
// carga de la página.
//
// - Forma: el perfil medido en una foto de estudio (scripts/botella-desde-foto.mjs) o,
//   sin foto, uno estándar (bordelesa / borgoñona). Se gira con LatheGeometry.
// - Etiqueta y cápsula: los píxeles de la propia foto, desenrollados del cilindro.
// - Luz: un HDRI de estudio real (public/3d/estudio.hdr, Poly Haven, CC0).
// - Vidrio: transmisivo, con grosor real; deja ver el vino.
// - Vino: torno interior recortado por un plano que conserva el volumen
//   (src/lib/nivel-vino.js) y sigue a la gravedad aparente: al frenar la botella el
//   vino se va hacia delante y oscila hasta calmarse. Brilla en rubí a contraluz.
// - Entrada: llega desde el fondo, muy inclinada hacia el espectador, y se endereza.
import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { crearNivel } from './nivel-vino.js'

// Perfiles estándar (radio, altura), del centro del fondo picado a la boca, en
// unidades de 10 cm (botella de 75 cl = 3).
const PERFILES = {
  bordelesa: [
    [0, 0.2], [0.1, 0.17], [0.2, 0.09], [0.27, 0.03], [0.31, 0], [0.355, 0.006],
    [0.373, 0.035], [0.375, 0.08], [0.375, 1.95], [0.37, 2.01], [0.35, 2.07], [0.3, 2.13],
    [0.22, 2.19], [0.165, 2.25], [0.148, 2.32], [0.145, 2.86], [0.158, 2.875],
    [0.162, 2.95], [0.152, 3], [0, 3],
  ],
  borgonona: [
    [0, 0.2], [0.1, 0.17], [0.2, 0.09], [0.29, 0.03], [0.34, 0], [0.385, 0.006],
    [0.403, 0.035], [0.405, 0.08], [0.405, 1.45], [0.395, 1.62], [0.36, 1.8], [0.3, 1.98],
    [0.23, 2.15], [0.17, 2.3], [0.15, 2.42], [0.147, 2.86], [0.16, 2.875],
    [0.164, 2.95], [0.152, 3], [0, 3],
  ],
}
const PARED = 0.03 // grosor del vidrio (3 mm)
const TECHO_VINO = 2.9
const HDRI = '/3d/estudio.hdr'

const v2 = (pts) => pts.map(([r, y]) => new THREE.Vector2(r, y))

/** Perfil exterior completo: el de la foto (cerrado con un fondo picado) o uno estándar. */
function perfilExterior(cfg) {
  if (!Array.isArray(cfg.perfil)) return PERFILES[cfg.forma] ?? PERFILES.bordelesa
  const foto = cfg.perfil.filter(([r, y]) => r > 0.02 && y < 2.995)
  const r0 = foto[0][0]
  return [
    [0, 0.18], [r0 * 0.3, 0.15], [r0 * 0.62, 0.07], [r0 * 0.86, 0.012], [r0 * 0.94, 0],
    ...foto.slice(1),
    [0, 3],
  ]
}

/** Radio exterior a una altura: interpola el lado de la botella (sin el fondo picado). */
function crearRadio(perfil) {
  const iBase = perfil.findIndex(([, y]) => y === 0)
  const lado = perfil.slice(iBase, -1)
  return (y) => {
    if (y <= lado[0][1]) return lado[0][0]
    for (let i = 1; i < lado.length; i++) {
      const [r0, y0] = lado[i - 1]
      const [r1, y1] = lado[i]
      if (y <= y1) return y1 > y0 ? r0 + ((y - y0) / (y1 - y0)) * (r1 - r0) : r1
    }
    return lado[lado.length - 1][0]
  }
}

/** Torno cerrado del vino: el interior del vidrio, del fondo al techo. */
function perfilInterior(radio, techo) {
  const pts = [[0, 0.2], [0.12, 0.17], [radio(0.06) - PARED, 0.06]]
  for (let y = 0.1; y < techo; y += 0.025) pts.push([Math.max(radio(y) - PARED, 0.02), y])
  pts.push([Math.max(radio(techo) - PARED, 0.02), techo], [0, techo])
  return pts
}

/** Etiqueta provisional (sin foto ni arte del cliente). */
async function etiquetaDeMuestra(textos) {
  await Promise.all([
    document.fonts.load('bold 60px "Courier Prime"'),
    document.fonts.load('60px "Libre Caslon Display"'),
    document.fonts.load('italic 40px "Libre Caslon Text"'),
  ]).catch(() => {})
  const c = document.createElement('canvas')
  c.width = 1320
  c.height = 1200
  const g = c.getContext('2d')
  g.fillStyle = '#e8e0cb'
  g.fillRect(0, 0, c.width, c.height)
  g.strokeStyle = '#a8894a'
  g.lineWidth = 10
  g.strokeRect(60, 60, c.width - 120, c.height - 120)
  g.lineWidth = 3
  g.strokeRect(84, 84, c.width - 168, c.height - 168)
  const cx = c.width / 2
  g.strokeStyle = '#1d211b'
  g.lineWidth = 9
  g.beginPath()
  g.arc(cx, 440, 285, 0, Math.PI * 2)
  g.stroke()
  g.fillStyle = '#1d211b'
  g.textAlign = 'center'
  g.font = 'bold 96px "Courier Prime", monospace'
  g.letterSpacing = '14px'
  g.fillText('MAZKO', cx + 7, 425)
  g.fillText('LANDAS', cx + 7, 528)
  g.font = 'bold 44px "Courier Prime", monospace'
  g.letterSpacing = '8px'
  g.fillText('Viñedos', cx + 4, 610)
  g.letterSpacing = '0px'
  g.font = '92px "Libre Caslon Display", Georgia, serif'
  g.fillText(textos.lugar, cx, 900)
  g.fillStyle = '#6b1f3a'
  g.font = 'italic 54px "Libre Caslon Text", Georgia, serif'
  g.fillText(textos.provisional, cx, 1040)
  return c
}

function textura(fuente, renderer) {
  const t = fuente instanceof HTMLCanvasElement ? new THREE.CanvasTexture(fuente) : fuente
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}

/** Papel impreso: la foto ya trae su luz de estudio; algo de emisión evita que se apague de lado. */
const materialPapel = (map) =>
  new THREE.MeshStandardMaterial({ map, roughness: 0.62, metalness: 0.05, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.22, envMapIntensity: 0.7 })

/** Mancha de luz o sombra suave (canvas radial). */
function mancha(color, alfa, tam) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 6, 128, 128, 128)
  grad.addColorStop(0, `rgba(${color},${alfa})`)
  grad.addColorStop(0.5, `rgba(${color},${alfa * 0.3})`)
  grad.addColorStop(1, `rgba(${color},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(tam, tam),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
  )
  m.rotation.x = -Math.PI / 2
  return m
}

async function construirBotella(cfg, textos, renderer, plano) {
  const perfil = perfilExterior(cfg)
  const radio = crearRadio(perfil)
  const grupo = new THREE.Group()
  const cargador = new THREE.TextureLoader()

  // Vidrio: transmisivo real con grosor, atenuacion de color y clearcoat de estudio
  grupo.add(
    new THREE.Mesh(
      new THREE.LatheGeometry(v2(perfil), 180),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.02,
        transmission: 1,
        thickness: 0.11,
        ior: 1.525,
        attenuationColor: new THREE.Color(cfg.vidrio ?? '#3f6234'),
        attenuationDistance: cfg.transparencia ?? 0.32, // vidrio algo claro: deja ver el vino
        clearcoat: 1,
        clearcoatRoughness: 0.01,
        specularIntensity: 1.1,
        specularColor: new THREE.Color(0xfaf5e8),
        envMapIntensity: 1.5,
        side: THREE.FrontSide,
      }),
    ),
  )

  // Vino: recortado por el plano de la superficie. Brilla en rubí en los bordes (luz
  // que lo atraviesa por detrás) y la superficie, vista por las caras de dentro, es
  // más clara.
  const llenado = Math.min(cfg.llenado ?? 1.95, TECHO_VINO - 0.1)
  const tinto = new THREE.Color(cfg.liquido ?? '#4a0b17')
  const rubi = tinto.clone().offsetHSL(0.02, 0.18, 0.26)
  const vino = new THREE.MeshStandardMaterial({
    color: tinto,
    roughness: 0.06,
    metalness: 0,
    side: THREE.DoubleSide,
    clippingPlanes: [plano],
  })
  vino.onBeforeCompile = (sh) => {
    sh.uniforms.rubi = { value: rubi }
    sh.fragmentShader =
      'uniform vec3 rubi;\n' +
      sh.fragmentShader
        .replace(
          '#include <color_fragment>',
          '#include <color_fragment>\n  if (!gl_FrontFacing) diffuseColor.rgb = mix(diffuseColor.rgb, rubi, 0.65);',
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
  float borde = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.0);
  totalEmissiveRadiance += rubi * (borde * 1.1 + (gl_FrontFacing ? 0.0 : 0.22));`,
        )
  }
  grupo.add(new THREE.Mesh(new THREE.LatheGeometry(v2(perfilInterior(radio, TECHO_VINO)), 128), vino))
  const nivel = crearNivel((y) => radio(y) - PARED, 0.2, TECHO_VINO, llenado)

  // Etiqueta: la de la foto (con su altura real) o el arte del cliente / la provisional
  const etq =
    cfg.etiqueta && typeof cfg.etiqueta === 'object'
      ? cfg.etiqueta
      : { imagen: cfg.etiqueta || null, vuelta: cfg.etiquetaVuelta ?? 0.42 }
  const arte = etq.imagen ? await cargador.loadAsync(etq.imagen) : await etiquetaDeMuestra(textos)
  const img = arte.image ?? arte
  const vuelta = Math.PI * 2 * etq.vuelta
  let desde = etq.desde
  let hasta = etq.hasta
  if (desde == null) {
    const alto = (radio(1) * vuelta * img.height) / img.width
    desde = 0.95 - alto / 2
    hasta = 0.95 + alto / 2
  }
  const etiqueta = new THREE.Mesh(
    new THREE.CylinderGeometry(radio(hasta) + 0.003, radio(desde) + 0.003, hasta - desde, 128, 1, true, -vuelta / 2, vuelta),
    materialPapel(textura(arte, renderer)),
  )
  etiqueta.position.y = (desde + hasta) / 2
  grupo.add(etiqueta)

  if (cfg.contraetiqueta) {
    const dorso = await cargador.loadAsync(cfg.contraetiqueta)
    const v = vuelta * 0.75
    const alto = (radio(1) * v * dorso.image.height) / dorso.image.width
    const contra = new THREE.Mesh(
      new THREE.CylinderGeometry(radio(1) + 0.003, radio(1) + 0.003, alto, 96, 1, true, Math.PI - v / 2, v),
      materialPapel(textura(dorso, renderer)),
    )
    contra.position.y = Math.min(desde + alto / 2 + 0.05, hasta)
    grupo.add(contra)
  }

  // Cápsula: torno que sigue el cuello (color de base) y, delante, la de la foto
  const cap = cfg.capsula && typeof cfg.capsula === 'object' ? cfg.capsula : { color: cfg.capsula ?? '#6b1f3a' }
  const capDesde = cap.desde ?? 2.56
  const ptsCap = []
  for (let y = capDesde; y < 2.995; y += 0.02) ptsCap.push([radio(y) + 0.004, y])
  ptsCap.push([radio(2.995) * 0.75, 3.003], [0, 3.004])
  const colorCap = Array.isArray(cap.color) ? new THREE.Color(`rgb(${cap.color.join(',')})`) : new THREE.Color(cap.color)
  grupo.add(
    new THREE.Mesh(
      new THREE.LatheGeometry(v2(ptsCap), 96),
      new THREE.MeshPhysicalMaterial({ color: colorCap, metalness: 0.4, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
    ),
  )
  if (cap.imagen) {
    const vc = Math.PI * 2 * (cap.vuelta ?? 0.4)
    const frente = ptsCap.slice(0, -2).map(([r, y]) => [r + 0.0015, y])
    const capFoto = new THREE.Mesh(
      new THREE.LatheGeometry(v2(frente), 96, -vc / 2, vc),
      new THREE.MeshPhysicalMaterial({
        map: textura(await cargador.loadAsync(cap.imagen), renderer),
        metalness: 0.15,
        roughness: 0.35,
        clearcoat: 0.6,
      }),
    )
    grupo.add(capFoto)
  }

  return { grupo, nivel }
}

async function botellaDeModelo(url) {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
  const modelo = (await new GLTFLoader().loadAsync(url)).scene
  const tam = new THREE.Box3().setFromObject(modelo).getSize(new THREE.Vector3())
  modelo.scale.setScalar(3 / tam.y)
  const caja = new THREE.Box3().setFromObject(modelo)
  const centro = caja.getCenter(new THREE.Vector3())
  modelo.position.set(-centro.x, -caja.min.y, -centro.z)
  const grupo = new THREE.Group()
  grupo.add(modelo)
  return { grupo, nivel: null }
}

// Curvas de movimiento
const salida = (t) => 1 - Math.pow(1 - t, 4)
const rebote = (t) => {
  const c = 1.9
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}
const suave = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b)
const mezcla = THREE.MathUtils.lerp

// Pose de llegada (de frente, apenas inclinada hacia el espectador) y de salida
// (al fondo, muy inclinada hacia delante y girada).
const LLEGADA = { x: 0, y: 0, z: 0, pitch: 0.08, roll: 0.04, giro: 0 }
const SALIDA = { x: -2.6, y: 3.4, z: -24, pitch: 0.95, roll: 0.75, giro: -2.3 }
const DURACION = 3.4 // segundos de la entrada en modo "intro"

/**
 * Monta la botella en `el`. Devuelve { destruir, repetir } o null sin WebGL.
 * @param {HTMLElement} el
 * @param {object} opciones
 * @param {object} opciones.botella configuración (de Supabase, de una foto o por defecto)
 * @param {{ lugar: string, provisional: string }} opciones.textos
 * @param {'scroll'|'intro'|'fijo'} [opciones.modo] scroll: la entrada sigue al scroll (home);
 *   intro: se reproduce sola al verse (demo); fijo: ya colocada (vista previa del panel)
 * @param {'claro'|'estudio'} [opciones.escenario] claro: fondo de paspartú; estudio: plató oscuro
 * @param {number} [opciones.desplazar] en escritorio, cuánto se corre el encuadre a la derecha
 *   (fracción del ancho) para dejar sitio al texto a la izquierda
 */
export async function montar(el, { botella: cfg, textos, modo = 'scroll', escenario = 'claro', progreso = null, soloVino = false, desplazar = 0 }) {
  if (progreso != null) modo = 'fijo'
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
  renderer.toneMapping = THREE.NeutralToneMapping // respeta los colores de la etiqueta
  renderer.toneMappingExposure = escenario === 'estudio' ? 1.0 : 1.08
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.localClippingEnabled = true
  renderer.domElement.setAttribute('aria-hidden', 'true')

  const escena = new THREE.Scene()
  const oscuro = escenario === 'estudio'
  escena.background = new THREE.Color(oscuro ? '#0a0f09' : '#f4f3ee')

  // Luz de estudio real (HDRI); si no carga, la escena sigue con las luces directas
  const pmrem = new THREE.PMREMGenerator(renderer)
  try {
    const hdr = await new HDRLoader().loadAsync(HDRI)
    escena.environment = pmrem.fromEquirectangular(hdr).texture
    escena.environmentRotation.y = 0.6
    hdr.dispose()
  } catch (e) {
    console.warn('Botella 3D: sin HDRI', e)
  }
  const clave = new THREE.DirectionalLight(0xfff1dd, oscuro ? 1.2 : 0.9)
  clave.position.set(3, 5, 4)
  escena.add(clave)
  const contra = new THREE.DirectionalLight(0xffe6d0, oscuro ? 2.2 : 1.2) // contraluz: perfila el vidrio
  contra.position.set(-2, 3, -5)
  escena.add(contra)

  let fondoPlato = null
  let sueloBase = null
  let sombra = null

  if (oscuro) {
    // Fondo: un halo de luz verde oliva suave detras de la botella
    fondoPlato = mancha('64, 78, 52', 0.55, 22)
    fondoPlato.rotation.x = 0 // de cara a la cámara (mancha() la tumba)
    fondoPlato.position.set(0, 2.2, -12)
    escena.add(fondoPlato)
    
    // Suelo iluminado: foco de luz suave debajo de la botella
    sueloBase = mancha('90, 110, 80', 0.35, 14)
    sueloBase.rotation.x = -Math.PI / 2 // Tumbado en el suelo
    sueloBase.position.y = 0.001
    escena.add(sueloBase)
    // Sin suelo sólido: uno iluminado dejaba una mancha parda delante, a la izquierda,
    // justo detrás del texto de la home. Fondo continuo, como un fotógrafo de estudio.

    escena.fog = new THREE.Fog('#0a0f09', 15, 60) // Fundido a negro perfecto
  }

  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 80)
  // Cámara algo alta, mirando un poco hacia abajo: deja ver la superficie del vino
  camara.position.set(0, 2.5, 8.2)
  camara.lookAt(0, 1.35, 0)

  // pose (traslación + inclinación) > gira (sobre su eje) > botella; el pivote está en
  // el centro de la botella para que vuele y se incline como un objeto real
  const plano = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2)
  const { grupo: botella, nivel } = cfg.modelo
    ? await botellaDeModelo(cfg.modelo)
    : await construirBotella(cfg, textos, renderer, plano)
  // Depuración: soloVino oculta todo menos el vino para ajustar su movimiento
  if (soloVino) botella.children.forEach((m, i) => (m.visible = i === 1))
  const pose = new THREE.Group()
  const gira = new THREE.Group()
  const manual = new THREE.Group()
  botella.position.y = -1.5
  manual.add(botella)
  gira.add(manual)
  pose.add(gira)
  escena.add(pose)
  sombra = mancha('8,10,6', oscuro ? 0.85 : 0.5, 1.9)
  sombra.position.y = 0.002
  escena.add(sombra)

  el.append(renderer.domElement)
  el.dataset.montada = ''

  const ajustar = () => {
    const { width, height } = el.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camara.aspect = width / height
    // Encuadre: en vertical se aleja un poco para que quepa la botella entera
    camara.position.z = camara.aspect < 0.85 ? 8.2 / Math.max(camara.aspect / 0.85, 0.72) : 8.2
    // Se corre el encuadre, no la botella: así sigue llegando de frente a la cámara
    const dx = innerWidth >= 900 ? desplazar : 0
    if (dx) camara.setViewOffset(width, height, -dx * width, 0, width, height)
    else camara.clearViewOffset()
    camara.updateProjectionMatrix()
  }
  ajustar()
  // Base de camara recogida despues de ajustar() para incluir el z correcto segun viewport
  let camaraBase = { x: camara.position.x, y: camara.position.y, z: camara.position.z }
  const ro = new ResizeObserver(() => {
    ajustar()
    pintar(0)
  })
  ro.observe(el)

  // Arrastrar para girarla en todas las direcciones (trackball)
  let inerciaX = 0
  let inerciaY = 0
  let x0 = null
  let y0 = null
  const abajo = (e) => {
    x0 = e.clientX
    y0 = e.clientY
    el.setPointerCapture(e.pointerId)
  }
  const rotarManual = (dx, dy) => {
    // Eje vertical del mundo (gira a los lados)
    manual.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), dx)
    // Eje horizontal de la camara (gira arriba/abajo)
    const camX = new THREE.Vector3(1, 0, 0).applyQuaternion(camara.quaternion)
    manual.rotateOnWorldAxis(camX, dy)
  }
  const mueve = (e) => {
    if (x0 === null) return
    const dx = e.clientX - x0
    const dy = e.clientY - y0
    x0 = e.clientX
    y0 = e.clientY
    
    inerciaX = dx * 0.012
    inerciaY = dy * 0.012
    rotarManual(inerciaX, inerciaY)
    
    if (quieto) pintar(1 / 60)
  }
  const soltar = () => {
    x0 = null
    y0 = null
  }
  el.addEventListener('pointerdown', abajo)
  el.addEventListener('pointermove', mueve)
  el.addEventListener('pointerup', soltar)
  el.addEventListener('pointercancel', soltar)

  const seccion = el.closest('section') ?? el
  const avance = () => {
    const r = seccion.getBoundingClientRect()
    return THREE.MathUtils.clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1)
  }

  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
  const reloj = new THREE.Timer()
  let tiempo = 0
  let inicioIntro = 0

  // Física del vino: la superficie sigue a la gravedad aparente (gravedad menos la
  // aceleración de la botella) con un muelle amortiguado, y el plano se coloca a la
  // altura que conserva el volumen.
  const G = new THREE.Vector3(0, -98, 0) // 9,8 m/s² en unidades de 10 cm
  const arriba = new THREE.Vector3(0, 1, 0)
  const velArriba = new THREE.Vector3()
  const posAnt = new THREE.Vector3()
  const velAnt = new THREE.Vector3()
  const acel = new THREE.Vector3()
  const ejeAnt = new THREE.Vector3(0, 1, 0)
  const tmp = new THREE.Vector3()
  const objetivo = new THREE.Vector3()
  const ejeY = new THREE.Vector3()
  const qInv = new THREE.Quaternion()
  let primera = true

  function colocar(t) {
    const tp = salida(t) // traslación: frena al llegar
    // Inclinación: se mantiene casi todo el vuelo y se endereza al llegar, pasándose un
    // poco y volviendo (como al posarla): ese gesto es lo que agita el vino
    const tr = rebote(THREE.MathUtils.clamp((t - 0.42) / 0.58, 0, 1))
    const tg = suave(t, 0.05, 0.95) // giro sobre su eje: enseña la etiqueta al llegar
    pose.position.set(
      mezcla(SALIDA.x, LLEGADA.x, tp),
      mezcla(SALIDA.y, LLEGADA.y, tp) + 1.5,
      mezcla(SALIDA.z, LLEGADA.z, tp),
    )
    pose.rotation.set(mezcla(SALIDA.pitch, LLEGADA.pitch, tr), 0, mezcla(SALIDA.roll, LLEGADA.roll, tr))
    sombra.material.opacity = suave(t, 0.7, 1)
    return mezcla(SALIDA.giro, LLEGADA.giro, tg)
  }

  function pintar(dt) {
    let t
    if (quieto || modo === 'fijo') t = 1
    else if (modo === 'intro') t = Math.min((tiempo - inicioIntro) / DURACION, 1)
    else t = suave(avance(), 0.16, 0.55) // empieza con la sección ya bastante a la vista
    const giroBase = colocar(t)
    // En reposo: flota un poco y se balancea suavemente
    const reposo = quieto ? 0 : suave(t, 0.95, 1)
    pose.position.y += Math.sin(tiempo * 1.08) * 0.022 * reposo
    pose.rotation.z += Math.sin(tiempo * 0.68) * 0.028 * reposo
    gira.rotation.y = giroBase + Math.sin(tiempo * 0.44) * 0.26 * reposo
    // Respiracion sutil de camara en modo estudio
    if (oscuro && !quieto) {
      const r = suave(t, 0.92, 1)
      camara.position.x = camaraBase.x + Math.sin(tiempo * 0.31) * 0.04 * r
      camara.position.y = camaraBase.y + Math.sin(tiempo * 0.19) * 0.02 * r
      camara.lookAt(0, 1.35, 0)
    }

    if (nivel) {
      pose.updateMatrixWorld(true)
      if (dt > 0) {
        // Aceleración de la botella (suavizada) → gravedad aparente
        pose.getWorldPosition(tmp)
        if (primera) {
          posAnt.copy(tmp)
          primera = false
        }
        const vel = tmp.clone().sub(posAnt).divideScalar(dt)
        acel.lerp(vel.clone().sub(velAnt).divideScalar(dt), 0.25)
        acel.clampLength(0, 120)
        posAnt.copy(tmp)
        velAnt.copy(vel)
        objetivo.copy(G).addScaledVector(acel, -1).negate().normalize()

        // Al inclinarse la botella, el vino se queda atrás un instante
        ejeY.set(0, 1, 0).applyQuaternion(manual.getWorldQuaternion(qInv))
        velArriba.addScaledVector(ejeY.clone().sub(ejeAnt), -1.6) // al girar la botella, el vino se queda atrás
        ejeAnt.copy(ejeY)

        // Muelle amortiguado: oleaje de ≈ 2 Hz que se apaga en un par de segundos
        velArriba.addScaledVector(objetivo.clone().sub(arriba), 150 * dt)
        velArriba.multiplyScalar(Math.exp(-1.4 * dt))
        arriba.addScaledVector(velArriba, dt).normalize()
      }
      // Normal en el espacio de la botella → altura que conserva el volumen
      manual.getWorldQuaternion(qInv).invert()
      const nLocal = arriba.clone().applyQuaternion(qInv).normalize()
      const d = nivel.offset(nLocal.x, nLocal.y, nLocal.z)
      // El torno del vino está desplazado -1.5 dentro del grupo manual; d se mide desde su base
      const pLocal = nLocal.clone().multiplyScalar(d)
      pLocal.y -= 1.5
      const pMundo = pLocal.applyMatrix4(manual.matrixWorld)
      plano.setFromNormalAndCoplanarPoint(arriba.clone().negate(), pMundo)
    }
    renderer.render(escena, camara)
  }

  // Solo se anima mientras se ve
  let visible = false
  let vivo = true
  function bucle() {
    if (!visible || !vivo) return
    reloj.update()
    const dt = Math.min(reloj.getDelta(), 1 / 30)
    tiempo += dt
    if (x0 === null && (Math.abs(inerciaX) > 0.0005 || Math.abs(inerciaY) > 0.0005)) {
      rotarManual(inerciaX, inerciaY)
      inerciaX *= 0.94
      inerciaY *= 0.94
    }
    pintar(dt)
    requestAnimationFrame(bucle)
  }
  const io = new IntersectionObserver(([e]) => {
    const antes = visible
    visible = e.isIntersecting && !quieto
    if (visible && !antes) {
      reloj.update() // no contar el tiempo que estuvo fuera de pantalla
      bucle()
    } else if (!visible) pintar(0)
  })
  io.observe(el)

  pintar(0)
  return {
    /** Vuelve a reproducir la entrada (modo intro). */
    repetir() {
      inicioIntro = tiempo
      primera = true
      arriba.set(0, 1, 0)
      velArriba.set(0, 0, 0)
      manual.quaternion.identity() // reset trackball rotation
    },
    destruir() {
      vivo = false
      io.disconnect()
      ro.disconnect()
      el.removeEventListener('pointerdown', abajo)
      el.removeEventListener('pointermove', mueve)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
      escena.traverse((o) => {
        o.geometry?.dispose()
        for (const m of [o.material].flat().filter(Boolean)) {
          m.map?.dispose()
          m.emissiveMap?.dispose()
          m.dispose()
        }
      })
      escena.environment?.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      delete el.dataset.montada
    },
    setFondoTransparente(esTransparente) {
      if (!oscuro) return
      escena.background = esTransparente ? null : new THREE.Color('#0a0f09')
      escena.fog = esTransparente ? null : new THREE.Fog('#0a0f09', 15, 60)
      if (fondoPlato) fondoPlato.visible = !esTransparente
      if (sueloBase) sueloBase.visible = !esTransparente
      // La sombra debajo de la botella la dejamos pero un poco mas suave
      if (sombra) sombra.material.opacity = esTransparente ? 0.4 : 0.85
      pintar(0)
    },
  }
}
