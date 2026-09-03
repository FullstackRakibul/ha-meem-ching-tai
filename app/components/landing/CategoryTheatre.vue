<!-- components/landing/CategoryTheatre.vue -->
<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  categoryScenes: Array<{
    id: string
    title: string
    description: string
    image: string
    type: string
  }>
  sceneIndex: string
}>()

// State for the full-screen image viewer
const activeImage = ref<string | null>(null)

const openViewer = (imageUrl: string) => {
  activeImage.value = imageUrl
  // Optional: Prevent background scrolling when modal is open
  document.body.style.overflow = 'hidden' 
}

const closeViewer = () => {
  activeImage.value = null
  document.body.style.overflow = '' // Restore scrolling
}
</script>

<template>
  <section id="collections" class="category-theatre" data-horizontal>
    <div class="category-theatre__sticky" data-horizontal-sticky>
      <div class="category-theatre__counter">
        <span>{{ sceneIndex }}</span> / 04
      </div>
      <div class="category-track" data-horizontal-track>
        <div
          v-for="scene in categoryScenes"
          :key="scene.id"
          :class="['category-scene', `category-scene--${scene.type}`]"
        >
          <div 
            class="category-scene__visual hide-native-cursor"
            data-cursor-text="VIEW"
            @click="openViewer(scene.image)"
          >
            <img :src="scene.image" :alt="scene.title" />
          </div>
          <div class="category-scene__copy">
            <span>SCENE {{ scene.id }}</span>
            <h2>{{ scene.title }}</h2>
            <p>{{ scene.description }}</p>
            <a class="tiny-link" href="#contact">
              <span>View Specs</span>
              <i>
                <svg width="12" height="12" viewBox="0 0 20 20">
                  <path d="M3 10h13M11 5l5 5-5 5" />
                </svg>
              </i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="activeImage" class="image-viewer" @click="closeViewer">
          <button class="image-viewer__close" @click.stop="closeViewer">
            ✕
          </button>
          <img :src="activeImage" alt="Full screen view" @click.stop />
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.hide-native-cursor {
  cursor: none !important;
}

/* Full Screen Viewer Styles */
.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background-color: rgba(245, 245, 240, 0.95); /* Light beige background from your design system */
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.image-viewer img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.image-viewer__close {
  position: absolute;
  top: 30px;
  right: 40px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #274257; /* Deep Navy */
}

/* Modal Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
