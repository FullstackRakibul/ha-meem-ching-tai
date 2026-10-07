/**
 * The Loom OS — shared geometry.
 *
 * Every shape the 3D stage draws is defined here once, as a pure function of
 * t ∈ [0, 1], and the SVG poster frames (reduced motion / no WebGL / mobile)
 * are sampled from the very same functions. A poster is therefore the end
 * state of its scene, not a placeholder that merely resembles it.
 *
 * Coordinates: x and y are normalised to the viewport (±1 = the edge of the
 * visible plane at z = 0); z is in world units. `toWorld` converts.
 */
export type P3 = [number, number, number]

export const TAU = Math.PI * 2

/**
 * The import route — "the long way round". A prolate cycloid: the thread
 * advances across the screen but keeps doubling back on itself. It stands
 * for imported accessories: the same work, a much longer path.
 */
export function longLoop(t: number): P3 {
  const theta = TAU * 3 * t
  return [
    -1.08 + 2.16 * t - 0.19 * Math.sin(theta),
    0.34 * Math.cos(theta) + 0.12 * Math.sin(TAU * t),
    0.9 * Math.sin(theta),
  ]
}

/** Made in Ghorashal — the short thread: one straight stitch between the two words. */
export function shortStitch(t: number): P3 {
  return [-0.24 + 0.48 * t, 0, 0]
}

/** One ply of the joint-venture yarn: separate (twist 0) or plied (twist 1). */
export function plyStrand(strand: 0 | 1, t: number, twisted: boolean): P3 {
  const x = -0.95 + 1.9 * t
  if (!twisted) return [x, strand === 0 ? 0.1 : -0.1, 0]
  const theta = TAU * 9 * t + strand * Math.PI
  return [x, 0.035 * Math.cos(theta), 0.11 * Math.sin(theta)]
}

/**
 * The closed water loop — zero discharge. A tilted ellipse: particles run it
 * forever and never leave. t = 0 is the caustic recovery node.
 */
export function waterLoop(t: number): P3 {
  return [0.5 * Math.cos(TAU * t), 0.13 * Math.sin(TAU * t), 0.8 * Math.sin(TAU * t)]
}

/** The recovery node sits where the loop starts. */
export const RECOVERY_NODE = waterLoop(0)

export function toWorld([x, y, z]: P3, halfW: number, halfH: number): P3 {
  return [x * halfW, y * halfH, z]
}

/**
 * SVG path data for a curve in a 200 × 112 (16:9) viewBox centred on 0,0.
 * Posters use `vector-effect: non-scaling-stroke`, so any stretching from
 * `preserveAspectRatio` never distorts the stroke weight.
 */
export const POSTER_VIEWBOX = '-100 -56 200 112'

export function svgPath(fn: (t: number) => P3, samples = 240, close = false) {
  let d = ''
  for (let i = 0; i <= samples; i++) {
    const [x, y] = fn(i / samples)
    d += `${i === 0 ? 'M' : 'L'}${(x * 100).toFixed(2)} ${(-y * 56).toFixed(2)}`
  }
  return close ? `${d}Z` : d
}
