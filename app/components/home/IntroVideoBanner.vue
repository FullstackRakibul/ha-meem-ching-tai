<template>
  <section class="parallax-banner relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center group">
    <div class="parallax-viewport">
      <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai10.jpeg"
        alt="Colorful thread spools in textile manufacturing"
        class="w-full h-full object-cover brightness-90 transition-transform duration-700 ease-in-out group-hover:scale-105" />
    </div>

    <!-- Subtle dark gradient overlay to ensure the button remains the hero -->
    <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/20"></div>

    <!-- Floating Play Button -->
    <button type="button" aria-label="Play intro video"
      class="group/btn relative z-10 flex flex-col items-center gap-3 cursor-pointer">
      <span class="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
        <!-- Outer glass ring -->
        <span
          class="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 ease-out group-hover/btn:bg-[#e8b938] group-hover/btn:border-[#e8b938] group-hover/btn:scale-110">
        </span>
        <!-- Pulsing ping ring -->
        <span
          class="absolute inset-0 rounded-full border border-white/60 animate-ping-slow motion-reduce:hidden">
        </span>
        <!-- Play triangle -->
        <UIcon name="i-heroicons-play-solid"
          class="relative w-7 h-7 md:w-8 md:h-8 text-white translate-x-0.5 transition-transform duration-300 ease-out group-hover/btn:scale-110 group-hover/btn:text-[#152F53]" />
      </span>

      <span
        class="text-white text-xs md:text-sm font-semibold uppercase tracking-[0.25em] drop-shadow-md transition-colors duration-300 group-hover/btn:text-[#e8b938]">
        Intro Video
      </span>
    </button>

  </section>
</template>

<style scoped>
/* Ambient pulse on the play button's ring — Tailwind's built-in animate-ping
   is too fast/twitchy for a slow ambient cue, so a dedicated slower keyframe
   is used instead. */
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  75%, 100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* ============================================
   FIXED / PARALLAX BACKGROUND
   ============================================
   `background-attachment: fixed` (Tailwind's `bg-fixed`) is the obvious
   route but is broken on iOS Safari and Android Chrome — both ignore it
   and paint a static, mis-scaled background. Instead: clip the section,
   then position the image `fixed` inside it. `clip-path` establishes a
   containing block for fixed descendants, so the image is pinned to the
   viewport yet visible only through the section — a true parallax window
   with no JS and no scroll listener. */
.parallax-banner {
  /* inset(0) is a no-op visually; it exists to create the clip context. */
  clip-path: inset(0);
}

.parallax-viewport {
  position: fixed;
  /* Width 100% (not 100vw) — 100vw includes the scrollbar and would push
     the image off-centre, the same trap documented for the carousel. */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  /* z-index 0, not -1: a negative index would drop the image behind the
     section's own background. The overlay and play button sit above via
     their own stacking (auto / z-10). */
  z-index: 0;
}

/* Safari < 15.4 lacks clip-path containing-block behaviour; there the
   fixed child would escape and cover the page. Fall back to a normally
   positioned image — no parallax, but correct layout. */
@supports not (clip-path: inset(0)) {
  .parallax-viewport {
    position: absolute;
    height: 100%;
    z-index: 0;
  }
}

/* Parallax couples motion to scroll, which can trigger vestibular
   discomfort — pin the image to the section for those users. */
@media (prefers-reduced-motion: reduce) {
  .parallax-viewport {
    position: absolute;
    height: 100%;
    z-index: 0;
  }
}
</style>