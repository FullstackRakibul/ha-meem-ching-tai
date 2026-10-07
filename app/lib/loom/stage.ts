/**
 * The Loom OS — the page's one and only WebGL context.
 *
 * Scene graph (only the active chapter's groups are visible, ≤ 4 draw calls):
 *   Stage
 *    ├─ Rig        hemisphere + key (the "sun") + rim
 *    ├─ Fibres     Points     boot   — loose cotton fibre spun into yarn (full tier only)
 *    ├─ Thread     Mesh       boot→why — the yarn; its length is lead time
 *    ├─ Shadow     Mesh       boot→why — the yarn flattened behind itself (depth cue)
 *    ├─ Weave      Instanced  stats  — woven share = 500,000 yd of 2M yd capacity
 *    ├─ Sun        Mesh+Sprite dusk  — the 16.9 MW solar plant
 *    ├─ Water      Points     dusk   — closed loop: zero discharge by 2030
 *    └─ Ply        Mesh ×2    ply    — Ha-Meem (sage) + Ching Tai (mint) plied into one
 *   MenuScene      the site menu's wavy image preview, scissored into its box
 *
 * Rendering is on demand: `frame()` returns without drawing unless loomState
 * is dirty, or a looping element (water, menu preview, and on the full tier
 * the drifting yarn / ply) is on screen.
 */
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Fog,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  LinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { loomState, WOVEN_SHARE, type Tier } from '~/composables/useLoomStage'
import {
  longLoop,
  plyStrand,
  RECOVERY_NODE,
  shortStitch,
  toWorld,
  waterLoop,
  type P3,
} from './paths'

// ── Palette: light greens on a light ground ───────────────────────────────
// The yarn is pale so it never fights the copy it passes behind; its shading
// and a cast shadow (PINE, low opacity) give it the depth a dark line had.
const GROUND = 0xf4f7f2 // the page — fog fades toward it
const MINT_PALE = 0xc4e4cf
const MINT = 0x9fd0b0
const SAGE = 0x86c09c
const SAGE_DEEP = 0x6fae88
const PINE = 0x14532d // shadow only
const WATER_TINT = 0xb3d7c0
const WHITE = 0xffffff

const FOV = 35
const CAMERA_Z = 10
const WEAVE_COLS = 64
const WEAVE_ROWS = 32

export type Stage = {
  frame: (time: number, deltaTime: number) => void
  resize: () => void
  dispose: () => void
}

type MorphMaterial = MeshStandardMaterial & { userData: { uMorph: { value: number } } }

/**
 * Shared animation uniforms. Materials can share one object (same clock) or
 * mix in their own `uWave` / `uPulse` to opt out of either effect.
 *   uWave   idle drift of the loose yarn (fades out as it morphs to the stitch)
 *   uPulse  a band of light that travels along the yarn's length
 */
type Flow = {
  uTime: { value: number }
  uWave: { value: number }
  uPulse: { value: number }
}

/**
 * Standard material whose vertices blend between `position` and `positionB`,
 * coloured along the tube's length from `color` to `colorB`.
 */
function morphMaterial(
  params: ConstructorParameters<typeof MeshStandardMaterial>[0],
  flow: Flow,
  colorB?: number,
) {
  const mat = new MeshStandardMaterial({ ...params, transparent: true }) as MorphMaterial
  const uMorph = { value: 0 }
  const uColorA = { value: new Color(params?.color ?? WHITE) }
  const uColorB = { value: new Color(colorB ?? params?.color ?? WHITE) }
  mat.userData.uMorph = uMorph
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, flow, { uMorph, uColorA, uColorB })
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        attribute vec3 positionB;
        attribute vec3 normalB;
        attribute float aAlong;
        uniform float uMorph;
        uniform float uTime;
        uniform float uWave;
        varying float vAlong;`,
      )
      .replace(
        '#include <beginnormal_vertex>',
        'vec3 objectNormal = normalize(mix(normal, normalB, uMorph));',
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `vec3 transformed = mix(position, positionB, uMorph);
        vAlong = aAlong;
        // Slow travelling swell, pinned at both ends, gone once it's a stitch.
        float env = sin(aAlong * 3.14159265) * (1.0 - uMorph) * uWave;
        transformed.y += sin(aAlong * 14.0 - uTime * 0.9) * 0.06 * env;
        transformed.z += cos(aAlong * 10.0 - uTime * 0.7) * 0.16 * env;`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        uniform float uPulse;
        varying float vAlong;`,
      )
      .replace(
        '#include <color_fragment>',
        '#include <color_fragment>\ndiffuseColor.rgb = mix(uColorA, uColorB, vAlong);',
      )
      .replace(
        '#include <emissivemap_fragment>',
        /* glsl */ `#include <emissivemap_fragment>
        float head = fract(uTime * 0.08) * 1.6 - 0.3;
        float pulse = smoothstep(0.1, 0.0, abs(vAlong - head));
        totalEmissiveRadiance += vec3(0.55) * pulse * uPulse;`,
      )
  }
  mat.customProgramCacheKey = () => 'loom-morph-flow'
  return mat
}

function curveFrom(fn: (t: number) => P3, halfW: number, halfH: number, scale = 1) {
  const pts: Vector3[] = []
  for (let i = 0; i < 200; i++) {
    const [x, y, z] = toWorld(fn(i / 199), halfW * scale, halfH * scale)
    pts.push(new Vector3(x, y, z))
  }
  return new CatmullRomCurve3(pts)
}

/** Two tubes with identical topology; B's vertices ride along as morph targets. */
function morphTube(
  a: (t: number) => P3,
  b: (t: number) => P3,
  halfW: number,
  halfH: number,
  segments: number,
  radius: number,
) {
  const geoA = new TubeGeometry(curveFrom(a, halfW, halfH), segments, radius, 6, false)
  const geoB = new TubeGeometry(curveFrom(b, halfW, halfH), segments, radius, 6, false)
  geoA.setAttribute('positionB', geoB.getAttribute('position'))
  geoA.setAttribute('normalB', geoB.getAttribute('normal'))
  geoB.dispose()
  // 0 → 1 along the tube (the uv's u), for the colour ramp, swell and pulse.
  const uv = geoA.getAttribute('uv') as BufferAttribute
  const along = new Float32Array(uv.count)
  for (let i = 0; i < uv.count; i++) along[i] = uv.getX(i)
  geoA.setAttribute('aAlong', new BufferAttribute(along, 1))
  return geoA
}

/** Sun colours come from the CSS tokens in main.css, so poster and stage match. */
const sunToken = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

function glowTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, sunToken('--sun-halo'))
  // Same hue at zero alpha (8-digit hex) — fading to `transparent` greys the edge.
  grad.addColorStop(1, `${sunToken('--sun-core')}00`)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  return tex
}

// ── Menu preview shaders (ported from the former WavyPreview.vue) ─────────
const MENU_VERT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float waveX = sin(uv.y * 6.0 + uTime * 1.1) * 0.06;
    float waveY = sin(uv.x * 5.0 + uTime * 0.9) * 0.05;
    float waveZ = sin((uv.x + uv.y) * 4.0 + uTime * 1.3) * 0.04;
    float intensity = 0.35 + uHover * 0.65;
    pos.z += (waveX + waveY) * intensity;
    pos.x += waveZ * 0.5 * intensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`
const MENU_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uRepeat;
  uniform vec2 uOffset;
  uniform float uHover;
  uniform float uOpacity;
  void main() {
    vec2 uv = vUv;
    uv.x += sin(uv.y * 8.0 + uHover * 2.0) * 0.005 * uHover;
    uv.y += cos(uv.x * 6.0 + uHover * 1.5) * 0.005 * uHover;
    vec4 tex = texture2D(uTexture, uv * uRepeat + uOffset);
    tex.rgb *= 1.0 - length(vUv - 0.5) * 0.18;
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  }
`

export function createStage(
  canvas: HTMLCanvasElement,
  tier: Exclude<Tier, 'poster'>,
  onContextLost: () => void,
): Stage {
  const full = tier === 'full'
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: full,
    powerPreference: full ? 'high-performance' : 'default',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, full ? 2 : 1.5))
  renderer.autoClear = false

  const scene = new Scene()
  // Tighter fog than before: loops that swing away from the camera fade
  // toward the page, so depth reads even on a pale yarn.
  scene.fog = new Fog(GROUND, 8.6, 17)
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50)
  camera.position.z = CAMERA_Z

  // Rig: soft white sky over a mint bounce, a warm-white key that doubles as
  // the sun, and a cool rim that edges the far side of each loop.
  scene.add(new HemisphereLight(WHITE, MINT_PALE, 1.5))
  const key = new DirectionalLight(0xfff8ea, 1.7)
  key.position.set(4, 5, 6)
  const rim = new DirectionalLight(MINT, 0.9)
  rim.position.set(-5, -2, -4)
  scene.add(key, rim)

  let halfW = 1
  let halfH = 1
  let wide = true

  // Idle motion (drift + travelling light) only on the full tier; `lite`
  // stays render-on-demand.
  const flow: Flow = {
    uTime: { value: 0 },
    uWave: { value: full ? 1 : 0 },
    uPulse: { value: full ? 1 : 0 },
  }

  // Pointer parallax target/current, -1..1 (full tier only).
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  if (full) window.addEventListener('pointermove', onPointer, { passive: true })

  // ── Thread ──────────────────────────────────────────────────────────────
  // The yarn and its fibres sit in one rig that tilts toward the pointer.
  const threadRig = new Group()
  scene.add(threadRig)
  const THREAD_SEGMENTS = full ? 420 : 300
  const threadMat = morphMaterial(
    {
      color: MINT_PALE,
      emissive: MINT_PALE,
      emissiveIntensity: 0.22,
      roughness: 0.38,
      metalness: 0.05,
    },
    flow,
    SAGE,
  )
  const thread = new Mesh(new BufferGeometry(), threadMat)
  thread.frustumCulled = false
  threadRig.add(thread)

  // Cast shadow: the same (morphing, swelling) yarn flattened onto a plane
  // behind it, offset away from the key light. A pale thread over a pale page
  // reads as floating above it instead of disappearing into it.
  const shadowMat = morphMaterial(
    { color: 0x000000, emissive: PINE, emissiveIntensity: 1, roughness: 1, depthWrite: false },
    { uTime: flow.uTime, uWave: flow.uWave, uPulse: { value: 0 } },
  )
  const shadow = new Mesh(thread.geometry, shadowMat)
  shadow.frustumCulled = false
  shadow.renderOrder = -1
  shadow.scale.z = 0.001
  scene.add(shadow)

  // ── Fibres (full tier only) ─────────────────────────────────────────────
  const FIBRES = full ? 1200 : 0
  const fibreMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uSpin: { value: 0 },
      uAlpha: { value: 0 },
      uSize: { value: 2.2 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uColor: { value: new Color(SAGE) },
      uTime: flow.uTime,
    },
    vertexShader: /* glsl */ `
      attribute vec3 aStart;
      attribute float aOrder;
      uniform float uSpin;
      uniform float uSize;
      uniform float uPixelRatio;
      uniform float uTime;
      varying float vK;
      void main() {
        float k = smoothstep(aOrder - 0.04, aOrder + 0.1, uSpin * 1.14);
        vK = k;
        // Loose fibres drift on slow eddies until they're spun in.
        vec3 eddy = vec3(
          sin(uTime * 0.45 + aOrder * 40.0),
          cos(uTime * 0.35 + aOrder * 31.0),
          sin(uTime * 0.25 + aOrder * 23.0)
        ) * 0.18;
        vec4 mv = modelViewMatrix * vec4(mix(aStart + eddy, position, k), 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPixelRatio * (10.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      uniform vec3 uColor;
      varying float vK;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = uAlpha * (0.25 + 0.45 * (1.0 - vK)) * smoothstep(0.5, 0.1, d);
        gl_FragColor = vec4(uColor, a);
      }
    `,
  })
  const fibres = new Points(new BufferGeometry(), fibreMat)
  fibres.frustumCulled = false
  if (FIBRES) threadRig.add(fibres)

  // ── Weave ───────────────────────────────────────────────────────────────
  const weave = new Group()
  const cellGeo = new BoxGeometry(1, 1, 1)
  const wovenMat = new MeshStandardMaterial({
    color: SAGE,
    emissive: MINT_PALE,
    emissiveIntensity: 0.15,
    roughness: 0.8,
    transparent: true,
  })
  const ghostMat = new MeshBasicMaterial({
    color: SAGE,
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  })
  const woven = new InstancedMesh(cellGeo, wovenMat, WEAVE_COLS * WEAVE_ROWS)
  const ghost = new InstancedMesh(cellGeo, ghostMat, WEAVE_COLS * WEAVE_ROWS)
  weave.add(ghost, woven)
  scene.add(weave)

  // ── Sun + water ─────────────────────────────────────────────────────────
  const dusk = new Group()
  const glowTex = glowTexture()
  // fog: false — the ground-coloured fog would otherwise tint the sun green.
  const sunMat = new MeshBasicMaterial({ color: sunToken('--sun-core'), transparent: true, fog: false })
  const sun = new Mesh(new IcosahedronGeometry(0.62, 8), sunMat)
  const glowMat = new SpriteMaterial({
    map: glowTex,
    transparent: true,
    depthWrite: false,
    fog: false,
  })
  const glow = new Sprite(glowMat)
  glow.scale.setScalar(4.2)
  sun.add(glow)
  dusk.add(sun)

  const WATER = full ? 800 : 400
  const WATER_SAMPLES = 512
  const waterSamples = new Float32Array(WATER_SAMPLES * 3)
  const waterPhase = new Float32Array(WATER)
  const waterJitter = new Float32Array(WATER * 3)
  for (let i = 0; i < WATER; i++) {
    waterPhase[i] = Math.random()
    waterJitter[i * 3] = (Math.random() - 0.5) * 0.18
    waterJitter[i * 3 + 1] = (Math.random() - 0.5) * 0.12
    waterJitter[i * 3 + 2] = (Math.random() - 0.5) * 0.18
  }
  const waterGeo = new BufferGeometry()
  waterGeo.setAttribute('position', new BufferAttribute(new Float32Array(WATER * 3), 3))
  const waterMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uAlpha: { value: 0 },
      uNode: { value: new Vector3() },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uWater: { value: new Color(WATER_TINT) },
      uGold: { value: new Color(SAGE_DEEP) },
    },
    vertexShader: /* glsl */ `
      uniform vec3 uNode;
      uniform float uPixelRatio;
      varying float vNear;
      void main() {
        vNear = smoothstep(0.9, 0.0, distance(position, uNode));
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (2.0 + vNear * 1.5) * uPixelRatio * (10.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      uniform vec3 uWater;
      uniform vec3 uGold;
      varying float vNear;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(mix(uWater, uGold, vNear), uAlpha * 0.8 * smoothstep(0.5, 0.15, d));
      }
    `,
  })
  const water = new Points(waterGeo, waterMat)
  water.frustumCulled = false
  const recoveryMat = new MeshBasicMaterial({ color: SAGE_DEEP, transparent: true })
  const recovery = new Mesh(new TorusGeometry(0.2, 0.018, 8, 48), recoveryMat)
  // Water and its recovery node share one local space, so the shader's
  // node-proximity test (uNode) compares like with like.
  const loop = new Group()
  loop.add(water, recovery)
  dusk.add(loop)
  scene.add(dusk)

  // ── Ply ─────────────────────────────────────────────────────────────────
  const ply = new Group()
  // Ha-Meem (deep sage) + Ching Tai (pale mint). The light pulse runs along
  // both plies; the idle swell doesn't, so the twist stays crisp.
  const plyFlow: Flow = { uTime: flow.uTime, uWave: { value: 0 }, uPulse: flow.uPulse }
  const plyMats = [
    morphMaterial({ color: SAGE_DEEP, roughness: 0.45 }, plyFlow),
    morphMaterial(
      { color: MINT, emissive: MINT_PALE, emissiveIntensity: 0.2, roughness: 0.4 },
      plyFlow,
    ),
  ]
  const plyMeshes = plyMats.map((m) => {
    const mesh = new Mesh(new BufferGeometry(), m)
    mesh.frustumCulled = false
    ply.add(mesh)
    return mesh
  })
  scene.add(ply)

  // ── Menu preview scene ──────────────────────────────────────────────────
  const menuScene = new Scene()
  const menuCamera = new PerspectiveCamera(28, 1, 0.1, 10)
  menuCamera.position.z = 1.75
  const blank = new Texture()
  const menuMat = new ShaderMaterial({
    vertexShader: MENU_VERT,
    fragmentShader: MENU_FRAG,
    transparent: true,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: blank },
      uRepeat: { value: [1, 1] },
      uOffset: { value: [0, 0] },
      uHover: { value: 0 },
      uOpacity: { value: 0 },
    },
  })
  const menuPlane = new Mesh(new PlaneGeometry(1.15, 1.55, 32, 32), menuMat)
  menuScene.add(menuPlane)
  const textures = new Map<string, Texture>()
  const loader = new TextureLoader()
  loader.setCrossOrigin('anonymous')
  let menuSrc: string | null = null
  let menuOpacity = 0
  let menuTime = 0

  function useMenuTexture(url: string, rect: DOMRect) {
    const apply = (tex: Texture) => {
      if (url !== loomState.menuImage) return
      menuMat.uniforms.uTexture!.value = tex
      const img = tex.image as { width: number; height: number }
      const imgAspect = img.width / img.height
      const boxAspect = rect.width / rect.height
      if (imgAspect > boxAspect) {
        const s = boxAspect / imgAspect
        menuMat.uniforms.uRepeat!.value = [s, 1]
        menuMat.uniforms.uOffset!.value = [(1 - s) / 2, 0]
      } else {
        const s = imgAspect / boxAspect
        menuMat.uniforms.uRepeat!.value = [1, s]
        menuMat.uniforms.uOffset!.value = [0, (1 - s) / 2]
      }
    }
    const cached = textures.get(url)
    if (cached) return apply(cached)
    // A distinct URL keeps this CORS request from being served the page's
    // cached non-CORS copy of the same image (which the browser would block).
    loader.load(`${url}${url.includes('?') ? '&' : '?'}gl=1`, (tex) => {
      tex.colorSpace = SRGBColorSpace
      tex.minFilter = LinearFilter
      tex.generateMipmaps = false
      textures.set(url, tex)
      apply(tex)
      loomState.dirty = true
    })
  }

  // ── Anchors ─────────────────────────────────────────────────────────────
  // Weave, sun/water and ply are drawn exactly where their SVG posters sit
  // in the DOM, and follow them as the page scrolls. The fallback and the
  // 3D scene therefore occupy the same slot in the layout.
  const anchors: Record<'weave' | 'dusk' | 'ply', HTMLElement | null> = {
    weave: null,
    dusk: null,
    ply: null,
  }
  const findAnchors = () => {
    for (const key of Object.keys(anchors) as Array<keyof typeof anchors>) {
      anchors[key] = document.querySelector<HTMLElement>(`[data-loom-anchor="${key}"]`)
    }
  }

  /** Size of a DOM element in world units on the z = 0 plane. */
  const worldSize = (el: HTMLElement | null) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return null
    return { w: (r.width / canvas.clientWidth) * 2 * halfW, h: (r.height / canvas.clientHeight) * 2 * halfH }
  }

  /** Move an object to the centre of its anchor. Returns false if there is none. */
  const place = (obj: Object3D, el: HTMLElement | null) => {
    if (!el) return false
    const r = el.getBoundingClientRect()
    obj.position.x = ((r.left + r.width / 2) / canvas.clientWidth * 2 - 1) * halfW
    obj.position.y = -((r.top + r.height / 2) / canvas.clientHeight * 2 - 1) * halfH
    return true
  }

  // Sun/water proportions, taken from the dusk poster's viewBox (-60 -70 120 100).
  const duskDims = { loopY: 0, sunTop: 0, sunStart: 0 }

  // ── Layout (rebuilt on resize) ──────────────────────────────────────────
  const dummy = new Object3D()

  function layout() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    halfH = Math.tan((FOV / 2) * (Math.PI / 180)) * CAMERA_Z
    halfW = halfH * camera.aspect
    wide = camera.aspect >= 1
    findAnchors()

    thread.geometry.dispose()
    // Thicker than the old dark line: a pale yarn needs body to read.
    thread.geometry = morphTube(longLoop, shortStitch, halfW, halfH, THREAD_SEGMENTS, full ? 0.036 : 0.04)
    shadow.geometry = thread.geometry

    if (FIBRES) {
      const start = new Float32Array(FIBRES * 3)
      const target = new Float32Array(FIBRES * 3)
      const order = new Float32Array(FIBRES)
      for (let i = 0; i < FIBRES; i++) {
        const t = Math.random()
        const [x, y, z] = toWorld(longLoop(t), halfW, halfH)
        target.set([x + (Math.random() - 0.5) * 0.08, y + (Math.random() - 0.5) * 0.08, z], i * 3)
        start.set(
          [(Math.random() * 2.4 - 1.2) * halfW, (Math.random() * 2 - 1) * halfH, Math.random() * 5 - 3],
          i * 3,
        )
        order[i] = t
      }
      fibres.geometry.dispose()
      const g = new BufferGeometry()
      g.setAttribute('position', new BufferAttribute(target, 3))
      g.setAttribute('aStart', new BufferAttribute(start, 3))
      g.setAttribute('aOrder', new BufferAttribute(order, 1))
      fibres.geometry = g
    }

    // Weave: one box per cell, plain-weave alternation, rows filled top-down
    // like picks on a loom — so `mesh.count` IS the woven share.
    const gridW = worldSize(anchors.weave)?.w ?? (wide ? 0.78 : 1.5) * halfW
    const gridH = gridW / 2
    const cw = gridW / WEAVE_COLS
    const ch = gridH / WEAVE_ROWS
    for (let j = 0; j < WEAVE_ROWS; j++) {
      for (let i = 0; i < WEAVE_COLS; i++) {
        const weftOver = (i + j) % 2 === 0
        dummy.position.set(-gridW / 2 + (i + 0.5) * cw, gridH / 2 - (j + 0.5) * ch, weftOver ? 0.012 : -0.012)
        dummy.scale.set(weftOver ? cw * 0.94 : cw * 0.42, weftOver ? ch * 0.42 : ch * 0.94, 0.03)
        dummy.updateMatrix()
        const idx = j * WEAVE_COLS + i
        woven.setMatrixAt(idx, dummy.matrix)
        ghost.setMatrixAt(idx, dummy.matrix)
      }
    }
    woven.instanceMatrix.needsUpdate = true
    ghost.instanceMatrix.needsUpdate = true
    weave.position.set(wide ? 0.44 * halfW : 0, wide ? -0.02 * halfH : -0.52 * halfH, 0)
    weave.rotation.set(-0.2, wide ? -0.14 : 0, 0.02)

    // Water loop samples in the loop group's local space, scaled to the
    // poster: the loop spans 100 of its 120 viewBox units horizontally.
    const box = worldSize(anchors.dusk) ?? { w: halfW, h: (halfW * 5) / 6 }
    const loopScaleX = (100 / 120) * box.w
    const loopScaleY = (56 / 100) * box.h
    for (let i = 0; i < WATER_SAMPLES; i++) {
      const [x, y, z] = waterLoop(i / WATER_SAMPLES)
      waterSamples.set([x * loopScaleX, y * loopScaleY, z], i * 3)
    }
    recovery.position.set(RECOVERY_NODE[0] * loopScaleX, RECOVERY_NODE[1] * loopScaleY, RECOVERY_NODE[2])
    ;(waterMat.uniforms.uNode!.value as Vector3).copy(recovery.position)
    duskDims.loopY = -0.2 * box.h
    duskDims.sunTop = 0.14 * box.h
    duskDims.sunStart = -0.62 * box.h
    loop.position.y = duskDims.loopY
    sun.scale.setScalar(box.w / 12 / 0.62)
    dusk.position.set(wide ? 0.42 * halfW : 0, wide ? -0.42 * halfH : -0.6 * halfH, 0)

    const plySpan = worldSize(anchors.ply)?.w ?? 1.9 * halfW
    plyMeshes.forEach((mesh, k) => {
      const strand = k as 0 | 1
      mesh.geometry.dispose()
      mesh.geometry = morphTube(
        (t) => plyStrand(strand, t, false),
        (t) => plyStrand(strand, t, true),
        plySpan / 1.9,
        halfH,
        full ? 360 : 240,
        0.03,
      )
    })
    ply.position.set(0, (wide ? -0.6 : -0.7) * halfH, 0)

    loomState.dirty = true
  }

  let waterClock = 0
  let cleared = false
  const pos = waterGeo.getAttribute('position') as BufferAttribute

  function stepWater(dt: number) {
    waterClock += dt * 0.035
    const arr = pos.array as Float32Array
    for (let i = 0; i < WATER; i++) {
      const f = ((waterPhase[i]! + waterClock) % 1) * WATER_SAMPLES
      const a = Math.floor(f)
      const b = (a + 1) % WATER_SAMPLES
      const k = f - a
      for (let c = 0; c < 3; c++) {
        arr[i * 3 + c] =
          waterSamples[a * 3 + c]! * (1 - k) + waterSamples[b * 3 + c]! * k + waterJitter[i * 3 + c]!
      }
    }
    pos.needsUpdate = true
  }

  const setOpacity = (obj: Object3D, mats: Material[], value: number) => {
    obj.visible = value > 0.002
    mats.forEach((m) => (m.opacity = value))
  }

  function frame(_time: number, deltaTime: number) {
    if (document.hidden) return
    const s = loomState
    const dt = Math.min(deltaTime, 50) / 1000
    const p = s.presence

    // Menu preview eases toward its target; it keeps the loop alive while it fades.
    const menuTarget = s.menuOpen && s.menuImage ? 1 : 0
    menuOpacity += (menuTarget - menuOpacity) * Math.min(1, dt * 4.2)
    const menuActive = menuOpacity > 0.01 || menuTarget > 0
    const watering = p.dusk > 0 && !s.menuOpen
    // The yarn drifts and the ply's light pulse runs while either is on screen.
    const flowing = full && !s.menuOpen && Math.max(p.boot, p.index, p.why, p.ply) > 0

    if (!s.dirty && !menuActive && !watering && !flowing) return
    s.dirty = false

    // Day chapters: nothing to draw. Clear once, then stay idle while scrolling.
    const anyStage = p.boot + p.index + p.why + p.stats + p.dusk + p.ply > 0
    if (!anyStage && !menuActive) {
      if (!cleared) {
        renderer.setScissorTest(false)
        renderer.clear()
      }
      cleared = true
      return
    }
    cleared = false

    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    renderer.clear()

    if (!s.menuOpen) {
      const threadPresence = Math.max(p.boot, p.index, p.why)
      const morph = s.u.morph
      threadMat.userData.uMorph.value = morph
      shadowMat.userData.uMorph.value = morph
      setOpacity(thread, [threadMat], threadPresence)
      setOpacity(shadow, [shadowMat], 0.09 * threadPresence)
      const segs = (thread.geometry.index?.count ?? 0) / THREAD_SEGMENTS
      const spin = tier === 'full' ? s.u.spin : 1
      thread.geometry.setDrawRange(0, Math.floor(THREAD_SEGMENTS * spin) * segs)

      if (flowing) {
        flow.uTime.value += dt
        const ease = Math.min(1, dt * 2.5)
        pointer.x += (pointer.tx - pointer.x) * ease
        pointer.y += (pointer.ty - pointer.y) * ease
      }
      // Tilt toward the pointer; none once it's the stitch, which must stay
      // registered between its two words.
      const tilt = 1 - morph
      threadRig.rotation.set(pointer.y * 0.1 * tilt, pointer.x * 0.16 * tilt, 0)
      // The shadow falls down-left of the yarn (key light is up-right) and
      // slides against the pointer, like a light source fixed in the room.
      shadow.rotation.copy(threadRig.rotation)
      shadow.position.set(-0.12 - pointer.x * 0.1 * tilt, -0.22 + pointer.y * 0.08 * tilt, -1.4)

      if (FIBRES) {
        fibreMat.uniforms.uSpin!.value = s.u.spin
        fibreMat.uniforms.uAlpha!.value = p.boot * (1 - morph)
        fibres.visible = p.boot > 0.002 && morph < 0.999
      }

      woven.count = Math.round(WEAVE_COLS * WEAVE_ROWS * Math.min(s.u.woven, WOVEN_SHARE))
      setOpacity(weave, [wovenMat], p.stats)
      if (weave.visible) place(weave, anchors.weave)
      ghostMat.opacity = 0.08 * p.stats

      // The sun is the key light: it brightens the rig as it rises.
      sun.position.y = duskDims.sunStart + (duskDims.sunTop - duskDims.sunStart) * s.u.sun
      key.intensity = 1.6 + 0.9 * s.u.sun * p.dusk
      setOpacity(dusk, [sunMat, recoveryMat], p.dusk)
      if (dusk.visible) place(dusk, anchors.dusk)
      // Peak alpha is the --sun-halo token itself, same as the poster's halo.
      glowMat.opacity = p.dusk * s.u.sun
      waterMat.uniforms.uAlpha!.value = p.dusk
      if (watering) stepWater(dt)

      plyMats.forEach((m) => (m.userData.uMorph.value = s.u.twist))
      setOpacity(ply, plyMats, p.ply)
      if (ply.visible) place(ply, anchors.ply)

      renderer.render(scene, camera)
    }

    if (menuActive) {
      const box = document.querySelector<HTMLElement>('[data-menu-preview]')
      const rect = box?.getBoundingClientRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        if (s.menuImage && s.menuImage !== menuSrc) {
          menuSrc = s.menuImage
          useMenuTexture(s.menuImage, rect)
        }
        menuTime += dt
        menuMat.uniforms.uTime!.value = menuTime
        menuMat.uniforms.uOpacity!.value = menuOpacity
        menuMat.uniforms.uHover!.value = menuOpacity
        menuCamera.aspect = rect.width / rect.height
        menuCamera.updateProjectionMatrix()
        const planeAspect = 1.15 / 1.55
        const sx = menuCamera.aspect > planeAspect ? 1 : menuCamera.aspect / planeAspect
        const sy = menuCamera.aspect > planeAspect ? planeAspect / menuCamera.aspect : 1
        menuPlane.scale.set(1 / sx, 1 / sy, 1)
        const y = canvas.clientHeight - rect.bottom
        renderer.setScissorTest(true)
        renderer.setScissor(rect.left, y, rect.width, rect.height)
        renderer.setViewport(rect.left, y, rect.width, rect.height)
        renderer.render(menuScene, menuCamera)
      }
    }
  }

  let resizeTimer = 0
  function resize() {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(layout, 150)
  }

  const lost = (e: Event) => {
    e.preventDefault()
    onContextLost()
  }
  canvas.addEventListener('webglcontextlost', lost)

  layout()

  function dispose() {
    window.clearTimeout(resizeTimer)
    window.removeEventListener('pointermove', onPointer)
    canvas.removeEventListener('webglcontextlost', lost)
    for (const root of [scene, menuScene]) {
      root.traverse((obj) => {
        const mesh = obj as Mesh
        mesh.geometry?.dispose()
        const mat = mesh.material as Material | Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
    }
    cellGeo.dispose()
    glowTex.dispose()
    blank.dispose()
    textures.forEach((t) => t.dispose())
    textures.clear()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { frame, resize, dispose }
}
