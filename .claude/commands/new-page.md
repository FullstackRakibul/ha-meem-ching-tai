---
description: Scaffold a new route with its section directory and header nav entry
argument-hint: <route-name> [fullBleed] [sections: a, b, c]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

Scaffold a new page for the HCTPAL site: **$ARGUMENTS**

Load the `hctpal-sections` skill and read `.claude/ARCHITECTURE.md` first, then:

1. Create `app/pages/<route>.vue`. It owns section order and `definePageMeta`
   only — no presentation of its own beyond the content wrapper.
2. Decide the layout contract:
   - Normal page → nothing to declare; `layouts/default.vue` applies
     `max-w-7xl px-4 pt-32`, and sections still carry their own `<UContainer>`.
   - Needs the viewport edge → `definePageMeta({ fullBleed: true })`, and every
     section supplies its own inner container.
3. Create `app/components/<route>/` for its sections and build the ones named
   in the request (one file each, alternating band backgrounds starting with
   `bg-[#f5f5f0]`).
4. Add the route to the nav in `app/components/AppHeader.vue` — match the
   existing `UPopover mode="hover"` dropdown pattern and both the desktop
   (`lg:flex`) and mobile (`lg:hidden`) menus. Don't add it to only one.
5. Set the page title via `useHead` if the site does that per-page; otherwise
   leave `app.vue`'s title alone and say so.

Ask before inventing more than ~3 sections' worth of content. Report the files
created and both nav locations touched.
