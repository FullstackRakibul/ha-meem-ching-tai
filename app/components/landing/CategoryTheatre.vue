<!-- components/landing/CategoryTheatre.vue -->
<script setup lang="ts">
/**
 * Scene 06 — Collections (day). The canvas is off; photographs lead.
 *
 * Base layout is a vertical stack that reads fully with no JavaScript. With
 * full motion at ≥ 840px, GSAP pins the stage and scrubs the track
 * sideways (`.is-horizontal`); the setup's cleanup removes the class again,
 * so reduced motion, small screens and breakpoint changes fall back cleanly.
 */
import { SCRUB } from "~/utils/motion";

defineProps<{
  categoryScenes: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    type: string;
  }>;
}>();

const { t } = useLocale();
const { $lenis } = useNuxtApp();

const section = ref<HTMLElement | null>(null);
const sticky = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const sceneIndex = ref("01");

useScrollScene(section, ({ gsap, mode, root }) => {
  if (mode !== "full" || !sticky.value || !track.value) return;
  const trackEl = track.value;
  root.classList.add("is-horizontal");

  const travel = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
  const scenes = trackEl.children.length;

  gsap.to(trackEl, {
    x: () => -travel(),
    ease: "none",
    scrollTrigger: {
      trigger: sticky.value,
      start: "top top",
      end: () => `+=${travel()}`,
      pin: true,
      scrub: SCRUB,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const active = Math.min(scenes, Math.round(self.progress * (scenes - 1)) + 1);
        sceneIndex.value = String(active).padStart(2, "0");
      },
    },
  });

  return () => root.classList.remove("is-horizontal");
});

// Full-screen image viewer
const activeImage = ref<string | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
let opener: HTMLElement | null = null;

const openViewer = (imageUrl: string, event: Event) => {
  opener = event.currentTarget as HTMLElement;
  activeImage.value = imageUrl;
  $lenis.value?.stop();
  document.body.style.overflow = "hidden";
  nextTick(() => closeButton.value?.focus());
};

const closeViewer = () => {
  activeImage.value = null;
  $lenis.value?.start();
  document.body.style.overflow = "";
  opener?.focus();
};

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && activeImage.value) closeViewer();
};
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <section id="collections" ref="section" class="category-theatre loom-day" data-chapter="collections">
    <div ref="sticky" class="category-theatre__sticky">
      <p class="category-theatre__counter loom-label" aria-hidden="true">
        <span>{{ sceneIndex }}</span> / {{ String(categoryScenes.length).padStart(2, "0") }}
      </p>
      <div ref="track" class="category-track">
        <article
          v-for="scene in categoryScenes"
          :key="scene.id"
          :class="['category-scene', `category-scene--${scene.type}`]"
        >
          <button
            type="button"
            class="category-scene__visual"
            :aria-label="`${t('sceneView')}: ${scene.title}`"
            @click="openViewer(scene.image, $event)"
          >
            <img :src="scene.image" :alt="scene.title" loading="lazy" decoding="async" width="610" height="610" />
          </button>
          <div class="category-scene__copy">
            <span class="loom-label loom-muted">{{ t("sceneLabel") }} {{ scene.id }}</span>
            <h2>{{ scene.title }}</h2>
            <p class="loom-body loom-muted">{{ scene.description }}</p>
            <a class="loom-ghost" href="#contact">{{ t("sceneCta") }}</a>
          </div>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="activeImage"
          class="image-viewer"
          role="dialog"
          aria-modal="true"
          :aria-label="t('sceneView')"
          @click="closeViewer"
        >
          <button ref="closeButton" type="button" class="image-viewer__close" :aria-label="t('close')" @click.stop="closeViewer">
            <UIcon name="i-heroicons-x-mark-20-solid" class="h-6 w-6" />
          </button>
          <img :src="activeImage" alt="" @click.stop />
        </div>
      </Transition>
    </Teleport>
  </section>
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

.image-viewer img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 20px 50px rgb(14 24 34 / 0.12);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
