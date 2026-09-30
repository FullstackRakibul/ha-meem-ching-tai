<!-- components/landing/WhatsAppButton.vue -->
<script setup lang="ts">
/** Always-visible WhatsApp path. Gold fill, navy icon (5.7:1), 56px target. */
const { t } = useLocale();
</script>

<template>
  <a
    class="loom-whatsapp"
    href="https://wa.me/8801319320527"
    target="_blank"
    rel="noopener"
    :aria-label="t('whatsappLabel')"
  >
    <UIcon name="i-heroicons-chat-bubble-left-right-solid" class="h-6 w-6" />
  </a>
</template>
