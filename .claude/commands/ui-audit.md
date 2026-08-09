---
description: Audit components for token, layout, and icon convention drift
argument-hint: [file or directory — defaults to app/]
allowed-tools: Read, Glob, Grep, Bash
---

Audit **${ARGUMENTS:-app/}** against the conventions in
`.claude/ARCHITECTURE.md`, the `hctpal-sections` skill, and `CLAUDE.md`.

Report only real findings, most severe first. Check for:

**Tokens**
- Hard-coded hexes outside the sanctioned three (`#1a1a1a` headings,
  `#f5f5f0` warm band, and the ramps in `@theme`)
- Tailwind default purple (legacy starter colour)
- Any `--ui-primary` / `--ui-secondary` binding removed from `main.css`, or a
  raw hex in `app.config.ts` where a palette name belongs
- A recreated `tailwind.config.ts` (Tailwind v4 ignores it — it was deleted
  deliberately)

**Layout**
- `w-screen` or `100vw` on any element (includes the scrollbar → horizontal
  overflow)
- `max-w-*` on a `<section>` element instead of on an inner `<UContainer>`
- Sections reaching outside themselves: `window.scrollTo`, sibling refs,
  route reads
- Band backgrounds repeating without alternation in a page's section order

**Icons**
- Every `i-heroicons-*` name in the scanned files, checked against
  `node_modules/@iconify-json/heroicons/icons.json`. Report any that don't
  exist — they render nothing, silently.

**Carousel** (if in scope)
- A `slide-change` listener (doesn't exist in `vue3-carousel@0.15.1`)
- `mouseWheel` gated on `isLastSlide` (strands the user — must gate only on
  `isDrifting`)
- Scoped styles targeting `.carousel__*` internals

**Consistency**
- Hand-repeated card markup that should be a `v-for`
- Duplicated class strings for a featured state and its hover equivalent that
  should share one flag
- Leftover "ZEUS UI" or other starter-template branding

Report findings as a list with `file:line`, what's wrong, and the concrete
consequence. Don't fix anything unless asked — this is a read-only audit.
