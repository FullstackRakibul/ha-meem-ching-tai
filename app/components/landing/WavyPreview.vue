<!-- components/landing/WavyPreview.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  src: string | null
  isVisible: boolean
}>()

const mountRef = ref<HTMLDivElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let mesh: THREE.Mesh | null = null
let material: THREE.ShaderMaterial | null = null
let animationFrameId = 0

let time = 0
let opacity = 0
let hover = 0
const textureCache = new Map<string, THREE.Texture>()

const vertexShader = `
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
    pos.y += sin(uTime * 0.45 + uv.x * 2.0) * 0.015 * intensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uOpacity;

  void main() {
    vec2 uv = vUv;
    uv.x += sin(uv.y * 8.0 + uHover * 2.0) * 0.005 * uHover;
    uv.y += cos(uv.x * 6.0 + uHover * 1.5) * 0.005 * uHover;
    vec4 tex = texture2D(uTexture, uv);
    float vignette = 1.0 - length(uv - 0.5) * 0.18;
    tex.rgb *= vignette;
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  }
`

const updateTextureCover = (tex: THREE.Texture, container: HTMLDivElement) => {
  if (!tex.image) return
  const image = tex.image as { width: number; height: number }
  const imgAspect = image.width / image.height
  const containerAspect = container.clientWidth / container.clientHeight
  if (imgAspect > containerAspect) {
    const scale = containerAspect / imgAspect
    tex.repeat.set(scale, 1)
    tex.offset.set((1 - scale) / 2, 0)
  } else {
    const scale = imgAspect / containerAspect
    tex.repeat.set(1, scale)
    tex.offset.set(0, (1 - scale) / 2)
  }
  tex.needsUpdate = true
}

const loadTexture = (url: string) => {
  if (!url || !material || !mountRef.value) return
  if (textureCache.has(url)) {
    const cached = textureCache.get(url)!
    if (material.uniforms.uTexture) material.uniforms.uTexture.value = cached
    updateTextureCover(cached, mountRef.value)
    return
  }
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setCrossOrigin('anonymous')
  textureLoader.load(url, (tex: THREE.Texture) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    textureCache.set(url, tex)
    if (props.src === url && material && mountRef.value) {
      if (material.uniforms.uTexture) material.uniforms.uTexture.value = tex
      updateTextureCover(tex, mountRef.value)
    }
  })
}

watch(() => props.src, (newSrc) => {
  if (newSrc) loadTexture(newSrc)
})

onMounted(() => {
  const container = mountRef.value
  if (!container) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(28, 1, 0.1, 10)
  camera.position.z = 1.75

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const geometry = new THREE.PlaneGeometry(1.15, 1.55, 32, 32)
  const placeholder = new THREE.Texture()
  placeholder.colorSpace = THREE.SRGBColorSpace

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: placeholder },
      uHover: { value: 0 },
      uOpacity: { value: 0 },
    },
    transparent: true,
    side: THREE.DoubleSide,
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const handleResize = () => {
    if (!container || !renderer || !camera || !mesh) return
    const { clientWidth, clientHeight } = container
    if (clientWidth === 0 || clientHeight === 0) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    const containerAspect = clientWidth / clientHeight
    const planeAspect = 1.15 / 1.55
    let scaleX = 1
    let scaleY = 1
    if (containerAspect > planeAspect) scaleY = planeAspect / containerAspect
    else scaleX = containerAspect / planeAspect
    mesh.scale.set(1 / scaleX, 1 / scaleY, 1)
  }

  handleResize()
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

  if (props.src) loadTexture(props.src)

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    time += 0.016

    const targetOpacity = props.isVisible ? 1 : 0
    const targetHover = props.isVisible ? 1 : 0
    opacity += (targetOpacity - opacity) * 0.07
    hover += (targetHover - hover) * 0.06

    if (material) {
      if (material.uniforms.uTime) material.uniforms.uTime.value = time
      if (material.uniforms.uOpacity) material.uniforms.uOpacity.value = opacity
      if (material.uniforms.uHover) material.uniforms.uHover.value = hover
    }

    if (mesh) {
      mesh.position.y = Math.sin(time * 0.32) * 0.035
      mesh.rotation.z = Math.sin(time * 0.22) * 0.018
      mesh.rotation.x = Math.sin(time * 0.18) * 0.012
      mesh.rotation.y = Math.sin(time * 0.15) * 0.02
    }

    if (opacity > 0.01 && renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId)
    resizeObserver.disconnect()
    geometry.dispose()
    material?.dispose()
    renderer?.dispose()
    if (renderer?.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
    textureCache.forEach((t) => t.dispose())
  })
})
</script>

<template>
  <div ref="mountRef" class="wavy-preview" aria-hidden="true" />
</template>