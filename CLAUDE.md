# Ha-Meem Ching Tai (HCTPAL) Website

## Project Overview
Marketing site for **Ha-Meem Ching Tai**, a global garment accessories manufacturing brand (pocketing fabric, interlinings, labels/tapes, packaging accessories). The site uses a glassmorphism design language: a floating pill-shaped sticky header, a custom SVG cursor, and smooth scrolling throughout.

Role to assume when working here: senior Nuxt 3 & Tailwind UI architect.

## Stack
- **Framework**: Nuxt 4 (`app/` source directory, `<script setup>`, auto-imports)
- **Styling**: Tailwind CSS v4 (`@nuxtjs/tailwindcss` + `@nuxt/ui` v4)
- **Icons**: Heroicons via `@nuxt/ui`'s `<UIcon>` (`i-heroicons-*` names)
- **Composables**: `@vueuse/core` for scroll tracking (`useWindowScroll`) and debouncing (`useDebounceFn`) — resolved transitively via `@nuxt/ui`

## Structure
- `app/app.vue` — root shell: `<AppHeader>` + `<NuxtLayout><NuxtPage/></NuxtLayout>` + `<AppFooter>`, sets page title via `useHead`
- `app/layouts/default.vue` — content wrapper (`max-w-7xl`, `pt-32` to clear the fixed header)
- `app/components/AppHeader.vue` — the glassmorphism sticky header (see below)
- `app/components/SliderCarousel/MouseWheelCarousel.vue` — full-screen hero carousel
- `app/components/AppFooter.vue` — site footer
- `app/pages/index.vue` — landing page (sticky carousel stage + content layer)
- `app/assets/css/main.css` — global cursor + smooth-scroll rules
- `public/ball-of-wool-ha-meem-ching-tai.svg` — custom cursor icon

## Full-screen hero carousel
Uses `vue3-carousel` **0.15.1** (via the `vue3-carousel-nuxt` module).

- **Slide tracking**: bind `v-model` on `<Carousel>`. This version emits `slide-start`/`slide-end` — there is **no `slide-change` event**, so don't rely on one.
- **Full-bleed**: the default layout constrains content to `max-w-7xl px-4 pt-32`, which is what causes white borders around a "full-screen" slider. Pages that need the viewport edge set `definePageMeta({ fullBleed: true })`; `default.vue` then drops the constraint and top padding, and the page supplies its own inner `max-w-7xl` wrapper for normal content.
- **Sizing**: set carousel config `height: '100vh'` and `gap: 0`; the internal `.carousel__viewport`, `.carousel__track`, and `.carousel__slide` also need `height: 100vh` with zero padding/margin via an **unscoped** `<style>` block (scoped styles can't reach the library's internals).
- **Header legibility**: each slide has a top-down dark scrim gradient so the glass header's dark text stays readable over bright photos.

## Scroll handover (index.vue)
The carousel sits in a `sticky top-0 z-0 h-screen` stage; site content is a `relative z-10` sibling that scrolls up over it.

**Wheel arbitration** — a non-passive `wheel` listener (`useEventListener`, `{ passive: false }`) on the stage decides per-event:

| Condition | Behaviour |
|---|---|
| down + last slide | `preventDefault()`, debounced smooth `scrollTo` into content |
| up + last slide | fall through — carousel steps **backwards** |
| any other slide | fall through — carousel navigates natively, both directions |
| already scrolled past stage (`y > 90vh`) | return early; page owns the wheel |
| mid-drift | swallow input so it can't fight the animation |

**Do not gate the carousel's own `mouseWheel` on `!isLastSlide`.** That disables wheel handling entirely on the last slide, which also kills backward/up navigation — the carousel gets stuck with no way back. `wheelEnabled` should only be `false` while `isDrifting`. The parent's listener is what implements the handover.

## The `100vw` overflow trap
`100vw` **includes the vertical scrollbar's width**, so any full-screen element sized with it (or Tailwind's `w-screen`) overflows the viewport and produces a spurious horizontal scrollbar. Use `width: 100%` / `w-full` for full-bleed children instead. `html, body { overflow-x: hidden; width: 100%; max-width: 100% }` in `main.css` is a backstop, not a substitute.

## Icons
`@nuxt/ui` runs Nuxt Icon in `local` bundle mode, so icon collections must be installed: `@iconify-json/heroicons` is a devDependency. Without it every `<UIcon>` silently fails to render.

Heroicons v2 has **no `lightning-bolt-*` icons** — use `bolt-solid` / `bolt-16-solid`. Verify a name exists before using it:
```bash
node -e "console.log(Object.keys(require('./node_modules/@iconify-json/heroicons/icons.json').icons).includes('bolt-solid'))"
```
`failed to load icon` warnings during SSR are cosmetic if `/api/_nuxt_icon/heroicons.json?icons=<name>` returns real SVG body data — the client resolves them fine.

## Dev server
Nuxt holds a dev lock; a stale server causes `Another Nuxt dev is already running (PID …)`. `kill`ing the npm wrapper does not stop the child — kill the reported PID (`taskkill /PID <pid> /F`), or find the listener with `Get-NetTCPConnection -LocalPort 3001`.

## Header behavior (`AppHeader.vue`)
Fixed, centered pill header (`fixed top-4 left-1/2 -translate-x-1/2 z-50`) with `bg-white/80 backdrop-blur-md rounded-full shadow-lg`.

- Tracks scroll via `useWindowScroll` (`@vueuse/core`), debounced with `useDebounceFn` (50ms) before flipping a `scrolled` boolean — avoids re-triggering the Tailwind transition on every scroll tick.
- `scrolled` toggles Tailwind classes only (no inline styles) so `transition-all duration-500 ease-in-out` animates width/padding/font-size smoothly:
  - Not scrolled: `max-w-325` (1300px), `px-10 py-6`, `text-xl`/`text-sm` nav
  - Scrolled (`y > 50`): `max-w-225` (900px), `px-6 py-3`, `text-lg`/`text-xs` nav
  - Use Tailwind's canonical `max-w-*`/spacing scale instead of arbitrary `[Npx]` values where a scale value matches (the IDE linter flags these).
- Layout: logo left, nav center (`UPopover mode="hover"` dropdowns for Services/Projects/Pages), search + "Contact Us" CTA (`#e8b938` mustard/gold) + mobile hamburger right.
- Mobile: nav collapses under `lg:hidden`/`lg:flex` breakpoints into a toggled stacked menu.

## Global CSS conventions
- Custom cursor and `scroll-behavior: smooth` are applied globally in `app/assets/css/main.css` — do not scope these per-component.
- Brand accent color is `#e8b938` (mustard/gold) — use it for CTAs and hover accents, not Tailwind's default purple (legacy starter-template color, being phased out of remaining sections).

## Branding conventions
- Full name: "Ha-Meem Ching Tai". Short/logo mark: "HCTPAL".
- `package.json` `name` field stays `hg-ching-tai` (matches repo/folder name) — this is distinct from the on-page display branding.
- Avoid leftover placeholder branding from the original Nuxt starter template (e.g. "ZEUS UI") when touching a file — replace with Ha-Meem Ching Tai branding.
