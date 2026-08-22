---
name: hctpal-sections
description: The component and section building system for the Ha-Meem Ching Tai (HCTPAL) Nuxt 4 site. Load BEFORE creating or editing any file under app/components/ or app/pages/, or before choosing colours, spacing, backgrounds, or icons for this site. Covers where a component lives, the section skeleton, the two approved header variants, the token ladder (navy/clay), band alternation, the v-for data rule, and the traps (100vw, heroicons names, carousel events). Triggers on: "add a section", "new component", "new band", "hero", "CTA strip", "card grid", "brand colour", "make it match the rest of the site".
---

# HCTPAL component & section building system

Companion docs: `.claude/ARCHITECTURE.md` (layer map + token contract) and
`CLAUDE.md` (traps). Read the closest existing sibling in
`app/components/home/` before writing — matching the shipped code beats
matching this file.

---

## Step 1 — Decide what you're building

| It is… | Put it in | Constraints |
|---|---|---|
| A full-width band on one page | `app/components/<page>/Name.vue` | Exactly one `<section>`; no page state |
| Reusable interactive behaviour | `app/components/<Domain>/Name.vue` | props in, emits out, nothing else |
| Site-wide chrome | `app/components/AppX.vue` | Rendered by `app.vue` |
| A route | `app/pages/name.vue` | Owns section order + `definePageMeta` |

If it needs to know about a sibling section, it isn't a section — the logic
belongs in the page.

---

## Step 2 — The skeleton

```vue
<template>
  <section class="py-20 bg-white">
    <UContainer>

      <!-- Section Header -->
      <div class="text-center mb-12 lg:mb-16">
        …eyebrow…
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
          Headline
        </h2>
        <p class="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
          Optional lede.
        </p>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="(item, index) in items" :key="index">…</div>
      </div>

    </UContainer>
  </section>
</template>

<script setup>
const items = [
  { title: '…', text: '…', icon: 'i-heroicons-clock-20-solid' },
]
</script>
```

Non-negotiables:

- The `<section>` is **full-bleed and owns the background**; `<UContainer>` owns
  the width. Never `max-w-*` on the `<section>` — sections must survive being
  dropped on a `fullBleed` page.
- **Never `w-screen` or `100vw`.** It includes the scrollbar width and produces
  a horizontal scrollbar. Use `w-full` / `width: 100%`.
- `<script setup>` in plain JS. No `lang="ts"`, no manual imports — Nuxt
  auto-imports Vue APIs, `~/components`, and Nuxt UI (`UContainer`, `UIcon`,
  `UBadge`, `UButton`).

---

## Step 3 — Pick a header variant (only two exist)

**Rule eyebrow** — `WhyChooseUs.vue`:

```html
<div class="flex items-center gap-3 mb-4 text-navy-600 text-xs font-semibold tracking-widest uppercase">
  <span class="h-4 w-px bg-secondary"></span>
  Why Choose Us
  <span class="h-4 w-px bg-secondary"></span>
</div>
```

**Badge eyebrow** — `VentureAtAGlance.vue`:

```html
<UBadge label="THE VENTURE AT A GLANCE" color="neutral" variant="soft"
  class="border border-gray-200 bg-transparent px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4" />
```

Don't invent a third. Pick whichever the neighbouring sections use less
recently so the page doesn't repeat itself twice running.

---

## Step 4 — Colour: use the ladder, add no hexes

Palette: **navy** `#142e53` (primary) and **clay** `#5D2E24` (secondary), both
full 50–950 ramps declared in `@theme` in `app/assets/css/main.css`.

Use utilities, in this order of preference:

1. `text-primary`, `bg-secondary`, `ring-primary/20` — semantic aliases
2. `text-navy-600`, `bg-clay-500` — explicit ramp steps
3. `text-[#1a1a1a]` (headings), `bg-[#f5f5f0]` (warm band), `text-gray-500`
   (body) — the three sanctioned literals already in use

Never introduce a new hex. Never use Tailwind's default purple (legacy starter
colour, being phased out). If a colour genuinely doesn't exist yet, that's a
token change — three files, see `.claude/ARCHITECTURE.md` §2 — not an inline hex.

> `CLAUDE.md` still names `#e8b938` mustard as the accent; the shipped palette
> is navy + clay. Follow the CSS.

**Band alternation:** check `app/pages/index.vue` for the section above yours
and alternate `bg-white` ↔ `bg-[#f5f5f0]`.

---

## Step 5 — Data and variants

- Repeated markup is **always** a `v-for` over a local array in
  `<script setup>`. Never hand-repeat three cards.
- Paired columns share one card template, differ only by array (`cardsLeft` /
  `cardsRight` in `WhyChooseUs.vue`).
- A "featured" item and a hover state that look identical must be driven by
  **one flag**, so they can't drift:

```html
:class="index === 0
  ? 'opacity-100 scale-100 group-hover:scale-105'
  : 'opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100'"
```

- Card shell in use: `rounded-2xl`/`rounded-3xl`, `shadow-lg`/`shadow-xl`,
  `p-6 lg:p-8`, `transition-all duration-500 ease-in-out`.

---

## Step 6 — Icons (verify, don't guess)

`@nuxt/ui` bundles icons locally from `@iconify-json/heroicons`. A wrong name
renders **nothing**, silently.

```bash
node -e "console.log(Object.keys(require('./node_modules/@iconify-json/heroicons/icons.json').icons).includes('bolt-solid'))"
```

Heroicons v2 has no `lightning-bolt-*` → use `bolt-solid` / `bolt-16-solid`.
Existing sections use the `-20-solid` family; stay consistent.

---

## Step 7 — Wire it into the page

Add the tag to the content layer of `app/pages/index.vue` (or the target page)
in the requested position, respecting band alternation. Auto-import means no
`import` line is needed — match what the surrounding lines already do.

---

## Step 8 — Verify

- Dev server already running → `curl` the page, confirm the new copy is in the
  SSR HTML.
- Not running → say so; don't start one unprompted, and mind the Nuxt dev lock
  (kill the **reported PID** with `taskkill /PID <pid> /F`; killing the npm
  wrapper leaves the child alive).
- `failed to load icon` warnings in SSR logs are cosmetic if
  `/api/_nuxt_icon/heroicons.json?icons=<name>` returns real SVG body data.

---

## If the section is interactive

Carousels use `vue3-carousel@0.15.1`: **no `slide-change` event** — bind
`v-model`, or listen to `slide-start` / `slide-end`. Its `.carousel__*`
internals need an **unscoped** `<style>` block; scoped styles can't reach them.
Scroll handover between a sticky stage and the content layer is the page's job
and is documented in `CLAUDE.md` — read it before touching `index.vue` or
`MouseWheelCarousel.vue`.
