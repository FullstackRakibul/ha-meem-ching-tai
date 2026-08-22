---
description: Build a new marketing section component and wire it into a page
argument-hint: <what the section shows> [on <page>] [after <SectionName>]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

Build a new section for the HCTPAL site: **$ARGUMENTS**

Follow the `hctpal-sections` skill — load it first, then:

1. Confirm the target page (default `app/pages/index.vue`) and the insertion
   point. If the request didn't say where, put it at the end of the content
   layer and say so.
2. Read the two closest existing siblings in `app/components/home/` and match
   their structure, comment density, and spacing.
3. Check the band background of the section directly above and alternate
   (`bg-white` ↔ `bg-[#f5f5f0]`).
4. Write the component as `app/components/<page-dir>/<Name>.vue` — one
   `<section>`, `<UContainer>` inside, `v-for` over a local array, tokens only
   (no new hexes), `w-full` never `w-screen`.
5. Verify every `i-heroicons-*` name exists in
   `node_modules/@iconify-json/heroicons/icons.json` before shipping.
6. Insert the tag into the page (auto-imported — no import line).

Copy: write real, specific marketing copy for Ha-Meem Ching Tai (garment
accessories — pocketing fabric, interlinings, labels/tapes, packaging) rather
than lorem ipsum, and flag it as placeholder wording for the user to approve.

Report the file created, background chosen, icons verified, and the exact
insertion line.
