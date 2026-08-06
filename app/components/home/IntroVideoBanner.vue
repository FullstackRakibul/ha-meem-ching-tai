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
    <div class="relative z-10 cursor-pointer hover:scale-110 transition-transform duration-300 ease-out">
      <svg viewBox="0 0 120 120" class="w-28 h-28 md:w-36 md:h-36 drop-shadow-xl">
        <defs>
          <!-- Path used to bend the text -->
          <path id="circlePath" d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" fill="none" />
        </defs>

        <!-- Gold Background Circle -->
        <circle cx="60" cy="60" r="50" fill="#e8b938"
          class="transition-colors duration-300 group-hover:fill-[#d4a52f]" />

        <!-- Curved Text (INTRO VIDEO) -->
        <text class="fill-[#1a1a1a] font-bold text-[10px] md:text-[12px] uppercase tracking-[0.2em]">
          <textPath href="#circlePath" startOffset="8%">INTRO VIDEO</textPath>
        </text>

        <!-- Play Arrow (Pointing to the right) -->
        <polygon points="48,40 48,80 84,60" fill="#1a1a1a"
          class="transition-colors duration-300 group-hover:fill-black" />
      </svg>
    </div>

  </section>
</template>

<style scoped>
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