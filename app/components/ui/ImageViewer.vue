<!-- components/ui/ImageViewer.vue -->
<script setup lang="ts">
/**
 * The one full-screen image viewer (CategoryTheatre, ProductRail).
 *
 * The parent owns the state: pass `src` to open, clear it on `close`. While
 * open: Lenis is stopped, the page behind (#__nuxt) is inert, focus sits on
 * the close button, and Escape / backdrop / button all emit `close`. On
 * close, focus returns to whatever held it when the viewer opened.
 */
const props = defineProps<{
  src: string | null;
  alt: string;
  caption?: string;
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const { t } = useLocale();
const { $lenis } = useNuxtApp();

const closeButton = ref<HTMLButtonElement | null>(null);
let opener: HTMLElement | null = null;

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};

const setPageInert = (inert: boolean) => {
  const app = document.getElementById("__nuxt");
  if (app) app.inert = inert;
};

const release = () => {
  document.removeEventListener("keydown", onKey);
  setPageInert(false);
  $lenis.value?.start();
  document.body.style.overflow = "";
};

watch(
  () => !!props.src,
  (open, was) => {
    if (open && !was) {
      opener = document.activeElement as HTMLElement | null;
      $lenis.value?.stop();
      document.body.style.overflow = "hidden";
      setPageInert(true);
      document.addEventListener("keydown", onKey);
      nextTick(() => closeButton.value?.focus());
    } else if (!open && was) {
      release();
      opener?.focus({ preventScroll: true });
      opener = null;
    }
  }
);

onBeforeUnmount(() => {
  if (props.src) release();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="image-viewer-fade">
      <div
        v-if="src"
        class="image-viewer"
        role="dialog"
        aria-modal="true"
        :aria-label="caption || t('sceneView')"
        @click="emit('close')"
      >
        <button
          ref="closeButton"
          type="button"
          class="image-viewer__close"
          :aria-label="t('close')"
          @click.stop="emit('close')"
        >
          <UIcon name="i-heroicons-x-mark-20-solid" class="h-6 w-6" />
        </button>
        <figure class="image-viewer__figure">
          <img :src="src" :alt="alt" @click.stop />
          <figcaption v-if="caption" class="image-viewer__caption" @click.stop>{{ caption }}</figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(245 245 240 / 0.97);
}

.image-viewer__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.image-viewer img {
  max-width: 90vw;
  max-height: 90svh;
  object-fit: contain;
  box-shadow: 0 20px 50px rgb(14 24 34 / 0.12);
}

/* With a caption the image gives up a line of height so both fit in 90svh. */
.image-viewer__figure:has(figcaption) img {
  max-height: calc(90svh - 40px);
}

.image-viewer__caption {
  max-width: 90vw;
  color: var(--navy);
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

.image-viewer__close {
  position: absolute;
  top: 24px;
  right: 24px;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: var(--white);
  color: var(--navy);
}

.image-viewer__close:focus-visible {
  outline: 2px solid var(--navy);
  outline-offset: 2px;
}

.image-viewer-fade-enter-active,
.image-viewer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.image-viewer-fade-enter-from,
.image-viewer-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .image-viewer-fade-enter-active,
  .image-viewer-fade-leave-active {
    transition: none;
  }
}
</style>
