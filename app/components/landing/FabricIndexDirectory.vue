<!-- components/landing/FabricIndexDirectory.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";

// Define the weight categories based on the original catalog
const categories = [
  { id: "thin", label: "Thin Type", badge: "< 70G" },
  { id: "middle", label: "Middle Type", badge: "80G - 120G" },
  { id: "thick", label: "Thick Type", badge: "> 120G" },
];

const activeCategory = ref("middle");

// Transcribed sample data from the provided image catalog
const catalogData = [
  // Thin Type
  {
    serial: "1",
    type: "thin",
    weaving: "Plain",
    weight: "70",
    yarn: "60*60",
    density: "90*88",
    content: "100%C",
    width: '55/56"',
    art: "CP-PC186",
  },

  // Middle Type
  {
    serial: "2",
    type: "middle",
    weaving: "Plain",
    weight: "180",
    yarn: "45*45",
    density: "88*64",
    content: "T/C 80/20",
    width: '57/58"',
    art: "CP-PT152C",
  },
  {
    serial: "3",
    type: "middle",
    weaving: "Plain",
    weight: "90",
    yarn: "45*45",
    density: "96*72",
    content: "T/C 80/20",
    width: '57/58"',
    art: "CP-PT168C",
  },
  {
    serial: "5",
    type: "middle",
    weaving: "Plain",
    weight: "100",
    yarn: "45*45",
    density: "110*76",
    content: "T/C 90/10",
    width: '57/58"',
    art: "CP-PT186E",
  },
  {
    serial: "9",
    type: "middle",
    weaving: "Plain",
    weight: "110",
    yarn: "150D*30",
    density: "110*52",
    content: "T/C 80/20",
    width: '57/58"',
    art: "CP-PTL162C",
  },
  {
    serial: "17",
    type: "middle",
    weaving: "Herringbone",
    weight: "85",
    yarn: "100D*100D",
    density: "110*80",
    content: "100%P",
    width: '57/58"',
    art: "CP-HP190",
  },
  {
    serial: "20",
    type: "middle",
    weaving: "Big Herringbone",
    weight: "110",
    yarn: "45*45",
    density: "133*72",
    content: "T/C 65/35",
    width: '57/58"',
    art: "CP-HT205BN",
  },
  {
    serial: "23",
    type: "middle",
    weaving: "Twill",
    weight: "95",
    yarn: "75D*150D",
    density: "130*70",
    content: "100%P",
    width: '57/58"',
    art: "CP-TP200",
  },

  // Thick Type
  {
    serial: "26",
    type: "thick",
    weaving: "Plain",
    weight: "140",
    yarn: "20*20",
    density: "60*60",
    content: "100%C",
    width: '55/56"',
    art: "CP-PC120",
  },
  {
    serial: "29",
    type: "thick",
    weaving: "Better Twill",
    weight: "135",
    yarn: "23*23",
    density: "72*56",
    content: "T/C 65/35",
    width: '57/58"',
    art: "CP-TT511B",
  },
  {
    serial: "32",
    type: "thick",
    weaving: "Fine Twill",
    weight: "190",
    yarn: "21*21",
    density: "108*58",
    content: "T/C 65/35",
    width: '57/58"',
    art: "CP-TT166B",
  },
  {
    serial: "34",
    type: "thick",
    weaving: "Herringbone",
    weight: "130",
    yarn: "30*30",
    density: "100*70",
    content: "100%C",
    width: '55/56"',
    art: "CP-HC170",
  },
];

const displayedFabrics = computed(() => {
  return catalogData.filter((item) => item.type === activeCategory.value);
});

const activeIndex = computed(() =>
  categories.findIndex((c) => c.id === activeCategory.value)
);

// Weight bars are scaled against the heaviest article in the whole catalog,
// so bars stay comparable when switching weight class.
const maxWeight = Math.max(...catalogData.map((f) => Number(f.weight)));
const weightPct = (w: string) => `${(Number(w) / maxWeight) * 100}%`;

const weightRange = computed(() => {
  const weights = displayedFabrics.value.map((f) => Number(f.weight));
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  return min === max ? `${min}` : `${min}–${max}`;
});

// Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
const tabRefs = ref<HTMLButtonElement[]>([]);
const onTabKey = (e: KeyboardEvent) => {
  const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
  if (!step) return;
  e.preventDefault();
  const next = (activeIndex.value + step + categories.length) % categories.length;
  activeCategory.value = categories[next]!.id;
  tabRefs.value[next]?.focus();
};

const columns = [
  { label: "Art #" },
  { label: "Weaving" },
  { label: "Weight", unit: "g/m²" },
  { label: "Yarn Count" },
  { label: "Density" },
  { label: "Content" },
  { label: "Width" },
];
</script>

<template>
  <section class="loom-day overflow-hidden py-[clamp(20px,1vw,150px)]" data-reveal>
    <!-- Faint dot grid, fading out downward: texture without competing with the table. -->
    <!-- <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(20_83_45/0.1)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_60%)]"
    /> -->

    <div aria-hidden="true" class="pointer-events-none absolute inset-0" />

    <div class="page-gutter relative mx-auto max-w-350">
      <!-- Section Header -->
      <div class="mb-10 grid gap-6 md:mb-14 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-7">
          <p class="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--navy)">
            <span class="h-px w-8 bg-(--navy)" aria-hidden="true" />
            Technical Specifications
          </p>
          <h2
            class="font-serif text-[clamp(32px,4.4vw,64px)] font-normal leading-[1.02] tracking-[-0.03em] text-(--navy)">
            Fabric Index <span class="loom-serif text-(--gold)">Directory</span>
          </h2>
        </div>

        <div class="lg:col-span-5 lg:justify-self-end">
          <p class="max-w-md text-sm leading-relaxed text-(--muted)">
            Engineered to precise tolerances. Explore our export-quality pocketing and
            lining configurations sorted by weight class.
          </p>
        </div>
      </div>

      <!-- One panel: toolbar (tabs + summary) over the spec table -->
      <div
        class="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgb(20_83_45/0.25)] ring-1 ring-(--line)">
        <div
          class="flex flex-col gap-4 border-b border-(--line) p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
          <!-- Weight-class tabs: one sliding indicator under three equal columns -->
          <div role="tablist" aria-label="Weight class"
            class="relative grid w-full grid-cols-3 rounded-full bg-(--paper-soft) p-1 ring-1 ring-(--line) md:w-auto md:min-w-150"
            @keydown="onTabKey">
            <span aria-hidden="true"
              class="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-(--navy) shadow-[0_6px_16px_-6px_rgb(20_83_45/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              :style="{ transform: `translateX(${activeIndex * 100}%)` }" />
            <!--
              The global `button` reset in main.css is unlayered, so it beats
              Tailwind utilities for color / padding / background on <button>.
              All of those live on the inner span instead.
            -->
            <button v-for="(cat, i) in categories" :key="cat.id"
              :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }" type="button" role="tab"
              :aria-selected="activeCategory === cat.id" aria-controls="fabric-index-panel"
              :tabindex="activeCategory === cat.id ? 0 : -1" class="fabric-tab relative z-1 rounded-full"
              @click="activeCategory = cat.id">
              <span
                class="flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-full px-2 py-2 transition-colors duration-300 sm:flex-row sm:gap-2.5 sm:px-5"
                :class="activeCategory === cat.id
                    ? 'text-white'
                    : 'text-(--navy) hover:bg-white/80'
                  ">
                <span class="text-[11px] font-bold uppercase tracking-[0.06em] sm:text-xs">
                  {{ cat.label }}
                </span>
                <span
                  class="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold transition-colors duration-300"
                  :class="activeCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-(--muted) ring-1 ring-(--line)'
                    ">
                  {{ cat.badge }}
                </span>
              </span>
            </button>
          </div>

          <p class="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--muted)" aria-live="polite">
            <span class="text-(--navy) tabular-nums">{{ displayedFabrics.length }}</span>
            {{ displayedFabrics.length === 1 ? "article" : "articles" }}
            <span class="mx-2 text-(--navy-tint)" aria-hidden="true">/</span>
            <span class="text-(--navy) tabular-nums">{{ weightRange }}</span>
            <span class="normal-case tracking-normal"> g/m²</span>
          </p>
        </div>

        <div id="fabric-index-panel" role="tabpanel">
          <!-- Desktop / tablet: spec table -->
          <div class="hide-native-cursor hidden overflow-x-auto md:block" data-cursor-text="DRAG">
            <table class="w-full min-w-190 border-collapse text-left">
              <thead>
                <tr class="border-b border-(--line) bg-(--paper-soft)/60">
                  <th v-for="col in columns" :key="col.label" scope="col"
                    class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-(--muted)">
                    {{ col.label }}
                    <span v-if="col.unit" class="text-[9px] normal-case tracking-normal">
                      ({{ col.unit }})
                    </span>
                  </th>
                </tr>
              </thead>

              <!-- Keyed by category: switching remounts the rows, replaying the stagger. -->
              <tbody :key="activeCategory">
                <tr v-for="(fabric, index) in displayedFabrics" :key="fabric.serial"
                  class="fabric-row group border-b border-(--line) transition-colors duration-300 last:border-b-0 hover:bg-(--paper-soft)/70"
                  :style="{ '--i': index }">
                  <td class="relative px-6 py-5">
                    <span aria-hidden="true"
                      class="absolute inset-y-3 left-0 w-0.5 origin-center scale-y-0 rounded-full bg-(--navy) transition-transform duration-300 group-hover:scale-y-100" />
                    <span class="font-bold tracking-wide text-(--navy)">{{
                      fabric.art
                    }}</span>
                  </td>
                  <td class="px-6 py-5 text-[13px] text-(--brown)">
                    {{ fabric.weaving }}
                  </td>
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <span class="w-8 font-mono text-[13px] tabular-nums text-(--brown)">
                        {{ fabric.weight }}
                      </span>
                      <span class="h-1 w-16 overflow-hidden rounded-full bg-(--line)" aria-hidden="true">
                        <span class="fabric-bar block h-full origin-left rounded-full bg-(--navy)"
                          :style="{ width: weightPct(fabric.weight) }" />
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-5 font-mono text-[13px] tabular-nums text-(--muted)">
                    {{ fabric.yarn }}
                  </td>
                  <td class="px-6 py-5 font-mono text-[13px] tabular-nums text-(--muted)">
                    {{ fabric.density }}
                  </td>
                  <td class="px-6 py-5">
                    <span
                      class="inline-block rounded-full bg-(--paper-soft) px-3 py-1 text-[11px] font-semibold text-(--navy) ring-1 ring-(--line) transition-colors duration-300 group-hover:bg-white">
                      {{ fabric.content }}
                    </span>
                  </td>
                  <td class="px-6 py-5 font-mono text-[13px] tabular-nums text-(--brown)">
                    {{ fabric.width }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile: one card per article instead of a sideways-scrolling table -->
          <ul :key="activeCategory" class="grid gap-3 p-3 md:hidden">
            <li v-for="(fabric, index) in displayedFabrics" :key="fabric.serial"
              class="fabric-row rounded-2xl bg-(--paper-soft)/60 p-5 ring-1 ring-(--line)" :style="{ '--i': index }">
              <div class="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold tracking-wide text-(--navy)">{{ fabric.art }}</p>
                  <p class="mt-0.5 text-[13px] text-(--muted)">{{ fabric.weaving }}</p>
                </div>
                <span
                  class="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-(--navy) ring-1 ring-(--line)">
                  {{ fabric.content }}
                </span>
              </div>

              <div class="mb-4 flex items-center gap-3">
                <span class="h-1 flex-1 overflow-hidden rounded-full bg-(--line)" aria-hidden="true">
                  <span class="fabric-bar block h-full origin-left rounded-full bg-(--navy)"
                    :style="{ width: weightPct(fabric.weight) }" />
                </span>
                <span class="font-mono text-[13px] tabular-nums text-(--brown)">
                  {{ fabric.weight }} <span class="text-[10px] text-(--muted)">g/m²</span>
                </span>
              </div>

              <dl class="grid grid-cols-3 gap-3 border-t border-(--line) pt-4">
                <div>
                  <dt class="text-[10px] font-bold uppercase tracking-widest text-(--muted)">
                    Yarn
                  </dt>
                  <dd class="mt-1 font-mono text-[13px] tabular-nums text-(--brown)">
                    {{ fabric.yarn }}
                  </dd>
                </div>
                <div>
                  <dt class="text-[10px] font-bold uppercase tracking-widest text-(--muted)">
                    Density
                  </dt>
                  <dd class="mt-1 font-mono text-[13px] tabular-nums text-(--brown)">
                    {{ fabric.density }}
                  </dd>
                </div>
                <div>
                  <dt class="text-[10px] font-bold uppercase tracking-widest text-(--muted)">
                    Width
                  </dt>
                  <dd class="mt-1 font-mono text-[13px] tabular-nums text-(--brown)">
                    {{ fabric.width }}
                  </dd>
                </div>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<!--
  Keyframes only. Unscoped (and prefixed) because Vue renames scoped
  keyframes, which would break the names the rows reference.
-->
<style>
@keyframes fabric-row-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fabric-bar-in {
  from {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .fabric-row {
    animation: fabric-row-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 55ms);
  }

  .fabric-row .fabric-bar {
    animation: fabric-bar-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 55ms + 150ms);
  }
}

/* The global :focus-visible ring is offset 4px outward, which spills past the
   tab track. Pull it inside the pill; white on the active (green) tab. */
.fabric-tab:focus-visible {
  outline-offset: -4px;
}

.fabric-tab[aria-selected="true"]:focus-visible {
  outline-color: #fff;
}

.hide-native-cursor {
  cursor: none;
}
</style>