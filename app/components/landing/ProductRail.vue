<!-- components/landing/ProductRail.vue -->
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  items: Array<[string, string, string]>
  tone?: string
  variant?: string
}>()

const trackRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
let startX = 0
let startOffset = 0

const beginDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  const track = trackRef.value
  if (!track) return

  const offset = Number(track.dataset.dragOffset || 0)
  startX = event.clientX
  startOffset = offset
  isDragging.value = true
  track.style.animationPlayState = 'paused'
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

const drag = (event: PointerEvent) => {
  if (!isDragging.value || !trackRef.value) return
  event.preventDefault()
  const offset = startOffset + event.clientX - startX
  trackRef.value.dataset.dragOffset = String(offset)
  trackRef.value.style.translate = `${offset}px`
}

const endDrag = (event: PointerEvent) => {
  if (!isDragging.value) return
  isDragging.value = false
  if (trackRef.value) {
    trackRef.value.style.removeProperty('animation-play-state')
  }
  const el = event.currentTarget as HTMLElement
  if (el.hasPointerCapture?.(event.pointerId)) {
    el.releasePointerCapture(event.pointerId)
  }
}
</script>

<template>
  <section
    :class="['product-strip', `product-strip--${tone || 'cream'}`, `product-strip--${variant || 'product'}`]"
    data-reveal
  >
    <div class="product-strip__heading page-gutter">
      <h2>{{ title }}</h2>
      <p>Drag to explore <span>→</span></p>
    </div>

    <div
      :class="['product-rail', { 'is-dragging': isDragging }, 'hide-native-cursor']"
      aria-label="Product rail"
      data-cursor-text="DRAG"
      @pointerdown="beginDrag"
      @pointermove="drag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <div ref="trackRef" class="product-rail__track">
        <div v-for="copy in 3" :key="copy" class="product-rail__group" :aria-hidden="copy !== 1">
          <article v-for="([name, meta, image], idx) in items" :key="`${name}-${idx}`" class="product-tile">
            <div class="product-tile__image">
              <img :src="image" :alt="name" draggable="false" />
              <span>{{ String(idx + 1).padStart(2, '0') }}</span>
            </div>
            <div class="product-tile__meta">
              <p>{{ name }}</p>
              <p>{{ meta }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hides the default mouse cursor so only your custom one shows */
.hide-native-cursor {
  cursor: none !important;
}
.hide-native-cursor * {
  cursor: none !important; 
}
</style>
