<!-- components/landing/CategoryTheatre.vue -->
<script setup lang="ts">
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
          <div class="category-scene__visual">
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
  </section>
</template>
