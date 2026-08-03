<script setup>
import { Carousel, Pagination, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'

const props = defineProps({
  // The parent intercepts the wheel itself (to hand scrolling over to the page
  // on the last slide), so the carousel's own wheel handling stays ON at all
  // times — disabling it would also kill backward/up navigation.
  wheelEnabled: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['slide-change', 'total-slides'])

const images = [
  {id: 1, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai09.jpeg'},
  {id: 2, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai08.jpeg'},
  {id: 3, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai03.jpeg'},
  {id: 4, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai02.jpeg'},
  {id: 5, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai04.jpeg'},
  {id: 6, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg'},
  {id: 7, url: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai06.jpeg'},
]


const currentSlide = ref(0)

onMounted(() => {
  emit('total-slides', images.length)
  emit('slide-change', currentSlide.value)
})

// v-model is the reliable source of truth in vue3-carousel v0.15 —
// the emitted events (slide-start/slide-end) differ in payload shape.
watch(currentSlide, (index) => emit('slide-change', index))

const config = computed(() => ({
  height: '100vh',
  itemsToShow: 1,
  gap: 0,
  mouseWheel: props.wheelEnabled,
  wrapAround: false,
  transition: 600,
}))
</script>

<template>
  <Carousel v-model="currentSlide" v-bind="config" class="hct-carousel">
    <Slide v-for="image in images" :key="image.id">
      <div class="carousel__item">
        <img :src="image.url" alt="" class="slide-image" />
        <!-- Scrim keeps the glass header readable over bright images -->
        <div class="slide-scrim"></div>
      </div>
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
.hct-carousel {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.carousel__item {
  position: relative;
  width: 100%;
  height: 100vh;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
}

/* Top-down gradient so nav text stays legible on light photos */
.slide-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0.05) 22%,
    rgba(0, 0, 0, 0) 45%
  );
}
</style>

<style>
/* Unscoped: vue3-carousel renders these internals outside our scope id */
.hct-carousel {
  --vc-pgn-background-color: rgba(255, 255, 255, 0.55);
  --vc-pgn-active-color: rgba(255, 255, 255, 1);
  --vc-nav-background: rgba(255, 255, 255, 0.75);
  --vc-nav-border-radius: 100%;
}

.hct-carousel .carousel__viewport {
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.hct-carousel .carousel__track {
  height: 100vh;
  padding: 0;
  margin: 0;
}

/* width:100% (not 100vw) — 100vw includes the vertical scrollbar's width and
   is what pushes slides off-screen, producing a horizontal scrollbar. */
.hct-carousel .carousel__slide {
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  flex-shrink: 0;
}

.hct-carousel .carousel__pagination {
  position: absolute;
  bottom: 2rem;
  width: 100%;
  margin: 0;
  z-index: 20;
}
</style>
