export default defineAppConfig({
  ui: {
    // These are palette NAMES, matching the ramps declared in `@theme` in
    // app/assets/css/main.css — a raw hex ('#142e53') is silently ignored
    // and leaves the utility falling back to Nuxt UI's default blue.
    // The actual colour binding lives in the `--ui-*` block in main.css.
    colors: {
      primary: 'navy',
      secondary: 'clay',
      neutral: 'slate',
    },
  },
})
