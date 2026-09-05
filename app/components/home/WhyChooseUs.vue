<template>
  <section class="py-14 md:py-20 bg-[#f5f5f0]">
    <UContainer>
      <!-- Section Header -->
      <div class="flex flex-col items-center mb-10 md:mb-12 lg:mb-16 text-center">
        <!-- Accent line separator design -->
        <div class="flex items-center gap-3 mb-4 text-navy-600 text-xs font-semibold tracking-widest uppercase">
          <span class="h-4 w-px bg-secondary"></span>
          Why Choose Us
          <span class="h-4 w-px bg-secondary"></span>
        </div>
        <!-- Main Headline -->
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight font-serif tracking-tight text-balance">
          Lead time is the industry's weakness.<br class="hidden md:block" />
          This is the answer.
        </h2>
      </div>

      <!--
        Auto-advancing showcase. Hovering or focusing anything inside pauses
        the rotation, so the card a reader is actually engaging with never
        slides out from under them.
      -->
      <div
        class="flex flex-col lg:flex-row items-stretch justify-center gap-5 md:gap-6 lg:gap-8"
        :style="{ '--why-rotate': `${ROTATE_MS}ms` }"
        @mouseenter="pause"
        @mouseleave="resume"
        @focusin="pause"
        @focusout="resume"
      >
        <!-- Left Column: Cards 01 & 02 -->
        <div class="bg-white rounded-2xl md:rounded-3xl shadow-lg px-5 sm:px-8 py-4 sm:py-6 flex flex-col justify-center divide-y divide-gray-100 w-full lg:max-w-sm">
          <button
            v-for="item in cardsLeft"
            :key="item.index"
            type="button"
            class="why-card py-5 sm:py-6 first:pt-0 last:pb-0 text-left w-full"
            :class="item.index === activeIndex ? 'is-active' : ''"
            :aria-current="item.index === activeIndex ? 'true' : undefined"
            @click="select(item.index)"
          >
            <div class="flex items-start gap-4">
              <UIcon :name="item.icon" class="why-card__icon text-secondary w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h3 class="text-lg sm:text-xl font-bold font-serif text-[#1a1a1a] mb-1 leading-tight">{{ item.title }}</h3>
                <p class="text-sm sm:text-[15px] text-gray-500 leading-relaxed">{{ item.text }}</p>
                <span class="why-card__rule bg-secondary" aria-hidden="true"></span>
              </div>
            </div>
          </button>
        </div>

        <!--
          Center Column: image cross-fades with the active card. The stage is
          capped rather than free-growing — an unbounded 4/5 portrait stretches
          the whole row, leaving dead space in the side columns and pushing the
          caption out of view.
        -->
        <div class="w-full lg:flex-1 lg:max-w-xl flex items-center">
          <div class="why-stage relative w-full rounded-2xl md:rounded-3xl shadow-xl overflow-hidden aspect-4/5 sm:aspect-video lg:aspect-auto lg:h-104 xl:h-120">
            <img
              v-for="(item, i) in cards"
              :key="item.index"
              :src="item.image"
              :alt="item.alt"
              class="why-stage__img absolute inset-0 w-full h-full object-cover"
              :class="i === activeIndex ? 'is-visible' : ''"
              :aria-hidden="i === activeIndex ? undefined : 'true'"
              :loading="i === 0 ? 'eager' : 'lazy'"
              decoding="async"
            />

            <!-- Scrim keeps the caption legible over bright frames -->
            <div class="why-stage__scrim absolute inset-0" aria-hidden="true"></div>

            <!-- Live caption + progress dots -->
            <div class="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex items-end justify-between gap-4">
              <p class="text-white font-serif text-base sm:text-lg leading-tight drop-shadow">
                {{ cards[activeIndex].title }}
              </p>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-for="(item, i) in cards"
                  :key="item.index"
                  type="button"
                  class="why-dot"
                  :class="i === activeIndex ? 'is-active' : ''"
                  :aria-label="`Show ${item.title}`"
                  :aria-current="i === activeIndex ? 'true' : undefined"
                  @click="select(i)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Cards 03 & 04 -->
        <div class="bg-white rounded-2xl md:rounded-3xl shadow-lg px-5 sm:px-8 py-4 sm:py-6 flex flex-col justify-center divide-y divide-gray-100 w-full lg:max-w-sm">
          <button
            v-for="item in cardsRight"
            :key="item.index"
            type="button"
            class="why-card py-5 sm:py-6 first:pt-0 last:pb-0 text-left w-full"
            :class="item.index === activeIndex ? 'is-active' : ''"
            :aria-current="item.index === activeIndex ? 'true' : undefined"
            @click="select(item.index)"
          >
            <div class="flex items-start gap-4">
              <UIcon :name="item.icon" class="why-card__icon text-secondary w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h3 class="text-lg sm:text-xl font-bold font-serif text-[#1a1a1a] mb-1 leading-tight">{{ item.title }}</h3>
                <p class="text-sm sm:text-[15px] text-gray-500 leading-relaxed">{{ item.text }}</p>
                <span class="why-card__rule bg-secondary" aria-hidden="true"></span>
              </div>
            </div>
          </button>
        </div>

      </div>
    </UContainer>
  </section>
</template>

<script setup>
const ROTATE_MS = 5000

// One array is the source of truth so the columns and the stage can never
// drift out of sync; `index` is the position each card holds overall.
const cards = [
  {
    title: '01. Reducing lead time',
    text: 'Fabrics are mostly local, but imported accessories delay production and shipment. Making them at home closes the gap.',
    icon: 'i-heroicons-clock-20-solid',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai07.jpeg',
    alt: 'Weaving floor at the Ha-Meem Ching Tai facility',
  },
  {
    title: '02. Saving foreign currency',
    text: 'Lower import dependency keeps earnings inside Bangladesh and strengthens the trade balance.',
    icon: 'i-heroicons-banknotes-20-solid',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg',
    alt: 'Finished interlining rolls prepared for local supply',
  },
  {
    title: '03. Integrated supply chain',
    text: 'One step toward a fully integrated chain — from raw material production to finished garments.',
    icon: 'i-heroicons-link-20-solid',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai13.jpeg',
    alt: 'Coating and finishing line inside the plant',
  },
  {
    title: '04. Export growth',
    text: 'Faster turnarounds increase buyers\' confidence in placing export orders with Bangladesh.',
    icon: 'i-heroicons-chart-bar-20-solid',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai11.jpeg',
    alt: 'Packaged accessories staged for export',
  },
].map((card, index) => ({ ...card, index }))

const cardsLeft = cards.slice(0, 2)
const cardsRight = cards.slice(2)

const activeIndex = ref(0)

let timer = null
// Hover and reduced-motion are tracked separately: a hover should resume on
// leave, but a reduced-motion preference must never be overridden by it.
let reduced = false

const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const start = () => {
  if (reduced) return
  stop()
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % cards.length
  }, ROTATE_MS)
}

const pause = () => stop()
const resume = () => start()

/** Clicking a card jumps to it and restarts the clock from that card. */
const select = (index) => {
  activeIndex.value = index
  start()
}

// A background tab still fires intervals; pausing avoids the section
// racing through several slides the moment the tab is focused again.
const onVisibility = () => (document.hidden ? stop() : start())

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('visibilitychange', onVisibility)
  start()
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibility)
  stop()
})
</script>

<style scoped>
/* ── Stage cross-fade ── */
.why-stage__img {
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1s ease, transform 6s ease-out;
}

.why-stage__img.is-visible {
  opacity: 1;
  /* Slow drift while shown — gives the still image some life. */
  transform: scale(1);
}

.why-stage__scrim {
  background: linear-gradient(to top, rgb(0 0 0 / 0.6), transparent 45%);
}

/* ── Cards ── */
.why-card {
  cursor: pointer;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Non-active cards recede rather than disappear, so all four stay readable. */
.why-card:not(.is-active) {
  opacity: 0.55;
}

.why-card.is-active {
  opacity: 1;
}

.why-card__icon {
  transition: transform 0.5s ease;
}

.why-card.is-active .why-card__icon {
  transform: scale(1.12);
}

/* Progress rule fills over one rotation, showing time left on this card. */
.why-card__rule {
  display: block;
  height: 2px;
  width: 0;
  margin-top: 12px;
  border-radius: 2px;
  /* Colour comes from the `bg-secondary` utility in the markup — this repo
     has no --ui-* block, so a var() here would silently fall back. */
  opacity: 0;
}

/* Duration comes from --why-rotate (bound to ROTATE_MS on the wrapper) so
   the bar can never drift out of step with the actual timer. */
.why-card.is-active .why-card__rule {
  opacity: 1;
  animation: why-fill var(--why-rotate, 5000ms) linear forwards;
}

@keyframes why-fill {
  from { width: 0; }
  to { width: 100%; }
}

/* ── Dots ── */
.why-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.45);
  cursor: pointer;
  transition: width 0.4s ease, background 0.4s ease;
}

.why-dot.is-active {
  width: 22px;
  background: #fff;
}

/* Honour reduced motion: show the active state, animate nothing. */
@media (prefers-reduced-motion: reduce) {
  .why-stage__img,
  .why-card,
  .why-card__icon,
  .why-dot {
    transition: none;
  }

  .why-card:not(.is-active) {
    opacity: 1;
  }

  .why-card.is-active .why-card__rule {
    animation: none;
    width: 100%;
  }
}
</style>
