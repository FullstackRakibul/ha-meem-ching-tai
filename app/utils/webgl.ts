// app/utils/webgl.ts
// Hardware acceleration can be switched off in the browser (chrome://gpu reports
// GL_VENDOR = Disabled), in which case constructing a THREE.WebGLRenderer throws.
// Every Three.js scene on this site is decorative, so callers probe first and
// simply render nothing when there is no context to be had.

let cached: boolean | null = null

export const isWebGLAvailable = (): boolean => {
  if (cached !== null) return cached
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')

    if (gl) {
      // Free the probe context immediately — browsers cap concurrent contexts.
      const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }

    cached = Boolean(gl)
  } catch {
    cached = false
  }

  return cached
}
