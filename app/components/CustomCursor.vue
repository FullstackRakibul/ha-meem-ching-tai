<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const isVisible = ref(false)
const cursorText = ref('')

const updateCursor = (e: MouseEvent) => {
  x.value = e.clientX
  y.value = e.clientY

  const target = e.target as HTMLElement
  // Check if the hovered element or any of its parents have the data attribute
  const cursorElement = target.closest('[data-cursor-text]') as HTMLElement

  if (cursorElement) {
    cursorText.value = cursorElement.dataset.cursorText || ''
    isVisible.value = true
  } else {
    isVisible.value = false
    cursorText.value = ''
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateCursor)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursor)
})
</script>

<template>
  <div
    class="custom-cursor"
    :class="{ 'is-active': isVisible }"
    :style="{ transform: `translate3d(${x}px, ${y}px, 0)` }"
  >
    <span class="custom-cursor__text">{{ cursorText }}</span>
  </div>
</template>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 80px; 
  height: 80px;
  margin-left: -40px; /* Centers the cursor on the mouse X */
  margin-top: -40px;  /* Centers the cursor on the mouse Y */
  border-radius: 50%;
  background-color: #3e2e26; /* Adjust to match your exact dark brown/black */
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* Prevents the cursor from blocking clicks */
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
}

.custom-cursor.is-active {
  opacity: 1;
}
</style>
