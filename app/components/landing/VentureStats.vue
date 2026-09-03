<!-- components/landing/VentureStats.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const stats = [
  { value: '৳100cr', label: 'Initial Investment', desc: 'Phase one capital expenditure' },
  { value: '500K', label: 'Monthly Output (yd)', desc: 'Initial phase: sizing & weaving' },
  { value: '2M', label: 'Future Capacity (yd)', desc: 'Per month at full scale' },
  { value: '12,000', label: 'Employment Target', desc: '90% local hiring mandate' },
  { value: '$9M', label: 'Solar Investment', desc: '16.9 MW capacity across Textile Zone' },
  { value: 'Zero', label: 'Water Discharge', desc: 'Goal by 2030 with caustic recovery' },
  { value: '25%', label: 'Ching Tai Stake', desc: 'Chinese JV partner equity' },
]

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  // 1. Scene Setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 2. Particles Setup
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 700
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x60A5FA,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  const particlesMesh = new THREE.Points(particlesGeometry, material)
  scene.add(particlesMesh)

  // 3. Mouse Interaction
  let mouseX = 0
  let mouseY = 0
  const handleMouseMove = (event: MouseEvent) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5
    mouseY = (event.clientY / window.innerHeight) - 0.5
  }
  window.addEventListener('mousemove', handleMouseMove)

  // 4. Animation Loop
  let animationFrameId: number
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    particlesMesh.rotation.y = elapsedTime * 0.05
    particlesMesh.rotation.x = elapsedTime * 0.02

    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
    animationFrameId = requestAnimationFrame(tick)
  }
  tick()

  // 5. Resize Listener
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', handleResize)

  // 6. Memory Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationFrameId)
    particlesGeometry.dispose()
    material.dispose()
    renderer.dispose()
  })
})
</script>

<template>
  <section id="venture"
    class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950" data-reveal>
    <!-- Background Denim Texture -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <!-- Ensure you have a denim texture image in your public directory -->
      <img
        src="https://media.istockphoto.com/id/676302668/photo/jeans-background.jpg?s=612x612&w=0&k=20&c=xTqt7jB_cvus_zH-4XjBNj8QPeZx56FgxsI9kO5KEL8="
        alt="Dark denim weave background" class="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
      <!-- Gradient overlay to ensure text contrast -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90"></div>
    </div>

    <!-- Three.js Particle Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 z-10 pointer-events-none"></canvas>

    <!-- Main Content Layout -->
    <div
      class="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-12 lg:py-0 flex flex-col justify-center h-full">

      <!-- Header: Tight spacing for immediate readability -->
      <header class="mb-8 md:mb-12 text-center lg:text-left max-w-2xl">
        <p class="text-blue-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-2">
          The Venture at a Glance
        </p>
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          A new era in garment<br class="hidden md:block" /> accessories manufacturing.
        </h2>
      </header>

      <!-- Grid: High-density data presentation with minimal padding -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <article v-for="(stat, index) in stats" :key="stat.label"
          class="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 cursor-default transition-all duration-500 ease-out hover:bg-white/10 hover:border-blue-400/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          :class="{ 'col-span-2 md:col-span-1 lg:col-span-2': index === stats.length - 1 }">
          <!-- Hover Sweep Animation Effect -->
          <div
            class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-sweep pointer-events-none">
          </div>

          <div class="relative z-10 flex flex-col h-full justify-between gap-1">
            <h3
              class="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-sm transition-transform duration-300 group-hover:scale-105 origin-left">
              {{ stat.value }}
            </h3>
            <div>
              <p class="text-sm font-semibold text-blue-300 tracking-wide mb-0.5 uppercase">
                {{ stat.label }}
              </p>
              <p class="text-xs text-slate-400 leading-snug">
                {{ stat.desc }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom Tailwind Animation for the card hover effect */
@keyframes sweep {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(200%);
  }
}

.animate-sweep {
  animation: sweep 1.5s ease-in-out infinite;
}
</style>