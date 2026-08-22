# Architecture — Ha-Meem Ching Tai (HCTPAL)

Reference map of how this Nuxt 4 site is put together. `CLAUDE.md` at the repo
root holds the behavioural rules and gotchas; this file holds the layout,
layering, and token contracts that new work must slot into.

---

## 1. Layer map

```
app/
├─ app.vue                  root shell: <AppHeader/> + <NuxtLayout><NuxtPage/></NuxtLayout> + <AppFooter/>
├─ app.config.ts            Nuxt UI colour aliases → palette NAMES only (navy / clay / slate)
├─ assets/css/main.css      @theme ramps, --ui-* bindings, cursor, scrollbar, overflow backstop
├─ layouts/
│  └─ default.vue           width constraint + header offset; opt out via route.meta.fullBleed
├─ pages/
│  └─ index.vue             page = composition root: owns scroll orchestration, renders sections
└─ components/
   ├─ AppHeader.vue         global chrome (fixed glass pill)
   ├─ AppFooter.vue         global chrome
   ├─ SliderCarousel/       reusable interactive widgets (MouseWheelCarousel.vue)
   └─ home/                 page-scoped SECTIONS (one file = one <section>)
```

**The rule that governs placement:**

| Kind | Lives in | Owns |
|---|---|---|
| Global chrome | `components/*.vue` | Rendered by `app.vue`, present on every route |
| Section | `components/<page>/*.vue` | Exactly one `<section>`, its own data, no page-level state |
| Widget | `components/<Domain>/*.vue` | Reusable behaviour; talks to parents via props + emits only |
| Page | `pages/*.vue` | Section order, `definePageMeta`, cross-section scroll logic |

A section never reaches outside itself (no `window.scrollTo`, no sibling refs).
Anything that coordinates *between* sections belongs in the page — that is why
the wheel-arbitration logic sits in `pages/index.vue` and not in
`MouseWheelCarousel.vue`.

---

## 2. Design tokens (single source of truth)

Tailwind v4 is CSS-first. There is **no `tailwind.config.ts`** — it was deleted
deliberately and v4 would ignore it.

- **Ramps** are declared in `@theme` in `app/assets/css/main.css`:
  `--color-navy-50…950` (primary, base `#142e53`) and
  `--color-clay-50…950` (secondary, base `#5D2E24`).
- **Nuxt UI aliases** live in `app/app.config.ts` and take a palette **name**
  (`primary: 'navy'`), never a hex. A hex there is silently dropped.
- **`text-primary` / `bg-secondary` resolve through the `--ui-*` block** in
  `:root` / `.dark` in `main.css`. Deleting that block reverts those utilities
  to Nuxt UI's default blue even though `app.config.ts` looks correct.

So a colour change is a **two-file** edit: the ramp in `@theme`, and — only if
the alias itself changes — the name in `app.config.ts`.

> Note: `CLAUDE.md` still cites `#e8b938` (mustard) as the brand accent. The
> shipped palette is navy `#142e53` + clay `#5D2E24`. Treat the CSS as
> authoritative and use `primary` / `secondary` utilities.

**Surface conventions currently in use:** page bands alternate
`bg-[#f5f5f0]` (warm off-white) and `bg-white`; headings are `text-[#1a1a1a]`;
body copy `text-gray-500`; cards `bg-white rounded-2xl/3xl shadow-lg`.

---

## 3. Layout contract

`layouts/default.vue` wraps every page in `max-w-7xl mx-auto px-4 pt-32 pb-12`.
`pt-32` exists solely to clear the fixed header.

A page that needs the viewport edge declares:

```js
definePageMeta({ fullBleed: true })
```

…and then supplies its own inner width wrapper (`<UContainer>` inside each
section) for normal content. Sections are written to be **width-agnostic**: the
`<section>` element is full-bleed and carries the background, and a
`<UContainer>` inside it constrains the content. That way the same section works
on both constrained and full-bleed pages.

---

## 4. Section anatomy

Every file in `components/home/` follows the same shape:

```vue
<template>
  <section class="py-20 bg-[#f5f5f0]">        <!-- full-bleed band + vertical rhythm -->
    <UContainer>                               <!-- width constraint -->
      <header/>                                <!-- eyebrow + h2 + optional lede -->
      <content/>                               <!-- grid / flex, driven by a local array -->
    </UContainer>
  </section>
</template>

<script setup>
const items = [ /* local, static, typed by shape */ ]
</script>
```

Established header variants (pick one, don't invent a third):

- **Rule eyebrow** — `WhyChooseUs.vue`: centred uppercase label flanked by
  `<span class="h-4 w-px bg-secondary">` hairlines.
- **Badge eyebrow** — `VentureAtAGlance.vue`: `<UBadge>` pill above the `h2`.

Content is always rendered by `v-for` over a local array, never hand-repeated
markup. When two columns share a card shape, they share the card template and
differ only in the array (see `cardsLeft` / `cardsRight`).

State variants (featured vs. hover) are driven by **one flag**, not duplicated
class strings — `VentureAtAGlance.vue` uses `index === 0` to make card 1
permanently show the state the others reach on hover, so the two can't drift.

---

## 5. Scroll orchestration (index.vue)

The carousel is a `sticky top-0 z-0 h-screen` stage; the content layer is a
`relative z-10` sibling that scrolls over it. A non-passive `wheel` listener on
the stage arbitrates per event. Full table and the "don't gate `mouseWheel` on
`isLastSlide`" trap are documented in `CLAUDE.md` — read it before touching
either file.

Key numbers that must stay in sync: `WHEEL_THRESHOLD = 15` in `index.vue`
mirrors `mouseWheel.threshold` in `MouseWheelCarousel.vue`.

---

## 6. Known traps (short list — details in CLAUDE.md)

1. **`100vw` includes the scrollbar.** Use `w-full`, never `w-screen`, for
   full-bleed children.
2. **Icons must exist in `@iconify-json/heroicons`.** No `lightning-bolt-*` in
   v2 — it's `bolt-solid`. Verify before use.
3. **`vue3-carousel@0.15.1` has no `slide-change` event** — bind `v-model` and
   use `slide-start` / `slide-end`.
4. **Scoped styles can't reach `.carousel__*` internals** — those need an
   unscoped `<style>` block.
5. **Stale dev lock**: kill the reported PID with `taskkill /PID <pid> /F`;
   killing the npm wrapper leaves the child alive.
