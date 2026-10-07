<!-- components/landing/CategoryTheatre.vue -->
<script setup lang="ts">
/**
 * Scene 06 — Collections (day). The canvas is off; photographs lead.
 *
 * Base layout is a vertical stack that reads fully with no JavaScript. With
 * full motion at ≥ 840px, GSAP pins the stage and scrubs the track
 * sideways (`.is-horizontal`); the setup's cleanup removes the class again,
 * so reduced motion, small screens and breakpoint changes fall back cleanly.
 *
 * `status` is optional: "live" shows a sewn "In production" label, "soon" a
 * basted "Coming soon" label (and the CTA reads "Register interest"); a
 * scene without it shows no label.
 */
import LoomSeam from "~/components/ui/LoomSeam.vue";
import { SCRUB } from "~/utils/motion";

defineProps<{
  categoryScenes: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    type: string;
    status?: "live" | "soon";
  }>;
}>();

const { t } = useLocale();

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

// Full-screen image viewer (shared: components/ui/ImageViewer.vue)
const activeImage = ref<string | null>(null);
const activeAlt = ref("");

const openViewer = (scene: { image: string; title: string }) => {
  activeImage.value = scene.image;
  activeAlt.value = scene.title;
};
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
            class="category-scene__visual loom-seam"
            :aria-label="`${t('sceneView')}: ${scene.title}`"
            @click="openViewer(scene)"
          >
            <img :src="scene.image" :alt="scene.title" loading="lazy" decoding="async" width="610" height="610" />
            <LoomSeam :radius="0" />
          </button>
          <div class="category-scene__copy">
            <div class="category-scene__meta">
              <span class="loom-label loom-muted">{{ t("sceneLabel") }} {{ scene.id }}</span>
              <span v-if="scene.status" :class="['loom-badge', `loom-badge--${scene.status}`]">
                <svg class="loom-badge__eyelet" viewBox="0 0 20 12" aria-hidden="true" focusable="false">
                  <path d="M0.5 10.5C4 10.5 6.5 5.5 11 6" />
                  <circle cx="14" cy="6" r="2.4" />
                </svg>
                <span v-if="scene.status === 'live'" class="loom-badge__dot" aria-hidden="true" />
                {{ scene.status === "live" ? t("sceneStatusLive") : t("sceneStatusSoon") }}
              </span>
            </div>
            <h2>{{ scene.title }}</h2>
            <p class="loom-body loom-muted">{{ scene.description }}</p>
            <a class="loom-ghost" href="#contact">{{
              scene.status === "soon" ? t("sceneCtaSoon") : t("sceneCta")
            }}</a>
          </div>
        </article>
      </div>
    </div>

    <ImageViewer :src="activeImage" :alt="activeAlt" @close="activeImage = null" />
  </section>
</template>

