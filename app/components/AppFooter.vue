<script setup>
import denimToolBelt from "~/assets/img/hctpal-section-image-00005.jpg";

const { t } = useLocale();

const facilitySpecs = computed(() => [
  { label: t("footerSpecLocationLabel"), value: t("footerSpecLocationValue") },
  { label: t("footerSpecSiteLabel"), value: t("footerSpecSiteValue") },
  { label: t("footerSpecPhaseLabel"), value: t("footerSpecPhaseValue") },
]);

const footerBlocks = computed(() => [
  { label: t("footerFactoryHq"), lines: [t("footerFactoryHqValue")] },
  { label: t("footerHeadOffice"), lines: [t("footerHeadOfficeValue")] },
  {
    label: t("footerContactLabel"),
    lines: [],
    phone: "+880 131 9320527",
    email: "info@hameemchingtai.com",
  },
]);

const trustedBrands = ["H&M", "Zara", "Uniqlo", "C&A", "American Eagle"];

// Same helper as ScrollTracer's button, so both behave the same.
const scrollToTop = useScrollToTop();

/** Finishing-footer nav. Each href must match a section id on the page. */
const footerNav = computed(() => [
  { label: t("go To Top"), href: "#top" },
  { label: t("go To Collections"), href: "#collections" },
  { label: t("go To Factory"), href: "#factory" },
  { label: t("go To Sustainability"), href: "#sustainability" },
  { label: t("go To Milestones"), href: "#milestones" },
  { label: t("goTo Contact"), href: "#contact" },
]);

// Shared by every link on the dark footer ground: a stitched underline on
// hover/focus and a focus ring that stays visible on --ink.
const footerLinkClass =
  "inline-flex min-h-11 items-center underline decoration-transparent decoration-dashed decoration-1 underline-offset-[7px] transition-colors duration-300 hover:decoration-current focus-visible:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--paper) motion-reduce:transition-none";

/**
 * World map: Natural Earth 110m land, Natural Earth projection, simplified
 * and cropped above Antarctica to a 1000 x 436 box. Used only as a clip
 * shape; the visible map is rows of running stitches showing through it.
 */
const WORLD_LAND =
  "M337,430l7,2l-6,3l-7-2l-12-6l10,3l5-4zM876,388l7,0l-5,8l-5,1zM947,389l1,2l-23,16l-6-1l4-4zM960,373l0,4l8,1l-14,12l-2-6zM640,299l0,6l-11,31l-9,1l-1-10l3-7l1-12l10-5l4-9zM900,300l4,4l1,13l5,5l1,6l6,9l-1,10l-7,11l-5,5l-11,14l-12,6l-13-4l0-6l-8-4l-2-7l-6-4l-15,2l-8,6l-11,0l-6,4l-7-3l4-7l0-13l1-12l4-9l20-7l8-10l12-9l3,3l13-12l12,4l-5,8l9,9l5,0l8-22zM805,277l6-1l13,6l-3,2l-17-4l-8-3l2-3zM927,273l-5,3l-5-3zM877,259l4,7l8-5l17,7l11,17l5,4l-8-1l-8-8l-7,5l-6-3l-7,0l3-3l-2-6l-11-6l-9-9zM852,250l-2,4l-12,0l8,18l-8-7l0,8l-3,0l-1-9l6-13zM797,274l-9-5l-11-20l-9-10l6-1l9,10l9,7l6,10zM831,249l-5,19l-16-3l-3-8l1-8l5,0l16-16l6,4l-5,8zM854,228l-2,9l-5-7zM728,235l-2,1l-2-13l5,8zM836,195l4,4l-1,9l-5-2zM300,190l11,4l-10,2zM281,181l14,8l-10,1l-1-5l-11-4zM541,130l-1,6l-7-4zM870,134l1,6l-23,4l4,8l-7-6l5-7l8,0l6-9l-2-9l7,6zM866,111l6,3l-4,4l-5-2l-4-9zM193,97l-5-1l-3-6l6,2zM362,90l6,5l0,5l-16,0l9-12zM852,90l8,12l-2,3l-15-24zM484,85l-8,2l1-7l5-3l4,1zM493,66l2,8l6,9l3,1l-3,6l-15,2l3-3l2-11l-5-7l2-5zM313,45l8,6l-6-1l-7,3zM468,43l2,4l-12,5l-12-6l6-3l3,2zM627,120l2,12l12,2l-4-12l4-1l-10-7l-3-4l6-2l-1-6l-5,0l-10,8zM898,47l-4,1l9,5l-8,4l-2,5l-6-2l-10,2l1,5l4,2l5,8l-3,2l0,10l-14-13l-3-8l3,0l4-10l-3-4l-4,6l-5-3l-5,1l-1,5l3,1l-8,1l-1-2l-20,2l-7,13l19,5l6,14l-4,17l-6,0l-7,11l9,10l2,6l-7,2l-5-11l-8-7l-7,3l-1-7l-8,8l12,6l-3,6l11,11l3,6l-5,17l-6,6l-13,4l-7-1l-6,9l11,12l2,12l-10,10l-1-4l-15-12l-2,12l5,8l8,8l1,12l-6-5l-6-15l-4-3l1-10l-6-18l-8,3l-1-7l-10-15l-3,3l-9,1l-4,7l-12,11l0,18l-6,8l-2-3l-11-23l-4-18l-6,2l-3-5l-10-10l-13,1l-12-2l-3-4l-4,2l-9-5l-5-7l-6,0l3,8l10,12l6-1l5-7l1,5l10,8l-4,11l-7,6l-17,11l-15,4l-3-14l-10-14l-1-5l-12-17l-7-3l13,22l3,11l5,9l12,12l2,6l20-5l-4,17l-8,13l-18,17l-4,13l4,14l0,13l-4,7l-13,10l2,7l-2,8l-6,3l-2,9l-13,15l-7,4l-8,0l-8,3l-4-3l1-8l-8-15l-2-16l-6-13l-1-5l6-15l-1-11l-4-12l-8-12l3-14l-4-5l-7,1l-5-6l-9,1l-9,4l-5-2l-10,3l-15-11l-5-10l-5-5l-3-8l3-4l1-13l-2-3l8-18l13-12l3-10l7-9l10,2l10-4l21-3l3,3l2,10l11,4l10,6l5-8l22,6l3-2l11,1l3-15l-4-3l-5,2l-13-2l-5-9l7-5l15-3l9,3l8-1l-1-4l-13-8l5-7l-8,2l2,4l-6,3l-1-4l-8-3l-6,13l3,5l-15,2l4,7l-6,5l-7-11l0-5l-9-6l-8-7l-1,5l16,12l-6,8l-2-7l-7-4l-10-10l-6,4l-9,1l-6,6l-2,8l-6,6l-8,3l-9-3l-2-6l2-7l-1-7l4-3l15,1l2-8l-8-8l7,0l13-10l2-4l10-3l-1-10l5-1l-2,6l3,5l8,1l8-4l9-1l2-7l4,2l-3-7l11-1l-1-3l-11,2l-4-2l-1-6l8-7l-7-2l-1,4l-8,5l-1,4l4,4l-4,4l-1,8l-7,2l-7-13l-4,4l-7-1l-2-10l12-7l9-10l9-5l10-4l8,0l4,3l15,3l9,3l3,3l-6,2l-10-2l4,7l5,2l-1-4l15-5l-4-5l6,1l2,5l14-7l0,2l11-2l2-2l7,1l13,4l0-2l-8-7l4-5l6,1l0,3l8,9l-2,6l6-5l-9-10l12-2l5,2l-5-6l12,0l-2-3l11-3l14-1l0-2l20,2l9,3l-7,3l11,2l3-1l17,2l-1-2l12,2l3,3l9,3l-1-3l17,1l-3-3l21,1l11,4l13,0l8,4l15-1l6,3l-3-4l20,2l5,1l13,11zM115,36l6,5l6,3l-14,5l-2-3l-6-1l-3,2l13-11zM307,35l3,6l9-7l8,2l-4,5l-10,2l-7,5l-7,2l-14,9l-5,6l3,6l7,0l8,5l6,0l-2,10l3,3l4-5l0-6l10-6l-1-7l4-3l1-7l10,0l8,4l-2,6l3,2l10-6l3,10l-1,2l9,5l2,8l-13,6l-15,0l-15,11l13-8l3,9l11,1l-16,8l-3-4l-9,4l-1,6l-8,2l-10,10l-2,8l-9,6l-10,10l2,12l-4,6l-4-16l-16,0l0,3l-14-1l-9,7l-5,16l4,12l4,2l10-4l2-5l10-2l-8,18l13,1l3,2l-3,12l6,8l5-2l8,3l4-6l11-6l0,4l9,2l18-1l-2,3l9,6l6,7l12,1l4,4l7,15l15,7l10,1l13,9l1,11l-11,16l-1,19l-5,11l-12,4l-5,5l0,10l-13,20l-10-2l6,9l-5,5l-8,1l1,6l-7,1l5,5l-7,12l6,3l-6,11l5,5l-6,5l-11-5l-6-11l2-6l-4-1l1-8l-3-23l1-15l-2-36l-2-10l-17-12l-12-25l-5-8l5-6l-4-2l3-9l8-10l0-10l-5-7l-2,5l-9-3l-7-6l-5-9l-9-3l-9-8l-5,2l-18-8l-5-7l0-8l-12-20l0-8l-5,4l8,22l-6-5l0-4l-5-3l-2-20l-6-4l-3-15l3-12l6-9l3-9l5-2l-7-6l0-12l-1-11l-6,0l-4-4l-13-4l-5,3l-15,3l-20,9l-19,4l14-4l11-5l-8-7l0-5l8-4l11-2l3-3l-11,1l-3-4l11-2l5,1l-2-5l14-7l15-2l7,2l17,1l11,3l22-4l3,3l7-1l15,4l0,2l18-3l2,2l21,0l3-3l-3-3l6-5l4,2zM265,25l5,2l7-2l6,1l-2,5l5,2l-5,4l-7-1l-17,1l-5-4l11-1l-11,0l5-2l-6-1l6-3zM322,25l10-2l0,5l8-2l15,6l2,4l-4,1l12,5l-6,5l-5-4l-4,2l5,4l-2,5l-7-3l4,5l-6-1l-10-6l-7,0l1-3l9,0l5-7l-6-3l-3-3l-6,1l-14-2l0-5l6-3zM295,23l6,0l0,3l-7,4l-6-4zM308,26l-6,2l6-6l7,1zM248,29l-6,2l-4-3l9-5l-1-1l15,0l3,2l-10,2zM791,19l0,1l-10,1l-7-3l8-1zM305,16l-3,4l-5,0l-1-3zM285,17l1,3l-14,1l3-1l-12-1l8-3l10,3zM621,31l-8,0l-5-2l4-9l10-3l12-2l2,2l-12,2l-5,3l-4,5zM314,15l5,0l2,3l17,0l-4,3l-13,1l-8-2zM273,13l-3,2l-9,2l-6,0l12-3zM704,12l-10,1l0-4zM535,8l7,2l-5,1l-3,4l-12-5l-2-1l12-1zM548,7l2,2l-12,0l-5-2zM693,10l-14-1l-6-2l6-2l12,3zM334,9l-7,3l-7,0l1-3l-5-2l11-2zM375,1l11,2l-22,5l-12,1l2,2l-14,6l-17-1l6-4l8-3l-7-5l13-2l4,1l9-2zM451,0l11,2l-4,1l-17,0l13,1l3,1l14-2l6,2l-11,2l-4,4l2,4l-3,2l0,5l-11,4l4,5l-7-2l-3,4l9,0l-13,4l-8,1l-7,4l-13,4l-9,8l-3,8l-10-3l-6-8l-1-10l9-8l-6,2l-2-6l3-3l-4-7l-5-2l-14,0l-5-2l10-1l-8-1l-3-2l16-2l-3-2l13-2l0-1l10-1l8,1l5-2l10,2l-3-2l7-1l16-1z";
// The two ends of the joint venture, in the same 1000 x 436 box.
const FACTORY_PIN = { x: 747.4, y: 177.5 }; // Dhaka region, Bangladesh
const PARTNER_PIN = { x: 813.5, y: 182.3 }; // Hong Kong

const reachLinks = computed(() => [
  { label: "info@hameemchingtai.com", href: "mailto:info@hameemchingtai.com" },
  { label: t("footerWhatsapp"), href: "https://wa.me/8801319320527", external: true },
  { label: "+880 131 9320527", href: "tel:+8801319320527" },
]);

/** Single-line inputs; `wide` spans both columns of the paired row. */
const fields = computed(() => [
  {
    name: "name",
    type: "text",
    autocomplete: "name",
    required: true,
    icon: "i-heroicons-user",
    label: t("footerFormName"),
  },
  {
    name: "company",
    type: "text",
    autocomplete: "organization",
    required: false,
    icon: "i-heroicons-building-office-2",
    label: t("footerFormCompany"),
  },
  {
    name: "email",
    type: "email",
    autocomplete: "email",
    required: true,
    icon: "i-heroicons-envelope",
    label: t("footerFormEmail"),
    wide: true,
  },
]);

// Filled field + floating label, shared by every input and the textarea.
const fieldClass =
  "peer block w-full min-h-13 rounded-[14px] border-b-2 border-transparent bg-(--panel) pt-5.5 pb-1.5 pl-4 pr-12 text-base text-(--ink) autofill:shadow-[inset_0_0_0_100px_var(--panel)] user-invalid:border-dashed user-invalid:border-(--rust)";
const labelClass =
  "pointer-events-none absolute left-4 top-1.5 text-xs text-(--muted) transition-all duration-200 motion-reduce:transition-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs";
const iconClass = "pointer-events-none absolute right-4 top-4 size-5 text-(--muted)";

const form = reactive({ name: "", company: "", email: "", message: "", file: null });
const status = ref("idle"); // idle | sending | sent | error
const fileInput = ref(null);

const onFile = (e) => (form.file = e.target.files?.[0] ?? null);
const clearFile = () => {
  form.file = null;
  fileInput.value.value = "";
};

// TODO: post to the enquiry endpoint once one exists. Until then every
// submit lands in the error state, which offers the mailto fallback.
async function sendEnquiry(payload) {
  throw new Error("sendEnquiry is not wired to an endpoint yet");
}

async function submit(e) {
  status.value = "sending";
  try {
    await sendEnquiry({ ...form });
    e.target.reset(); // also clears :user-invalid
    Object.assign(form, { name: "", company: "", email: "", message: "", file: null });
    status.value = "sent";
  } catch {
    status.value = "error";
  }
}
</script>

<template>
  <footer class="relative flex flex-col">
    <!-- GROUP 1: Contact card -->
    <!--
      Opaque so it masks the sticky footer beneath. `overflow-x-clip` (not
      hidden) trims the tilted sheet without creating a scroll container.
    -->
    <div class="relative z-10 overflow-x-clip bg-(--paper)">
      <!-- Garment-tool line-art texture, tiled behind the contact card -->
      <svg
        class="pointer-events-none absolute inset-0 h-full w-full text-(--brown) opacity-[0.055]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id="hctpalWorkbook"
            width="240"
            height="240"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)"
          >
            <!-- sewing needle + trailing thread -->
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="1.15"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 20 L74 62" />
              <ellipse
                cx="27.5"
                cy="24.5"
                rx="3.6"
                ry="2.1"
                transform="rotate(39 27.5 24.5)"
              />
              <path d="M74 62 q9 5 4 12 t-11 5 q-7 -1 -5 -8" />
            </g>

            <!-- tailor's scissors -->
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="1.15"
              stroke-linecap="round"
              stroke-linejoin="round"
              transform="translate(150 26) rotate(24)"
            >
              <path d="M0 0 L34 30" />
              <path d="M14 0 L-20 30" />
              <circle cx="38.5" cy="33.5" r="5" />
              <circle cx="-24.5" cy="33.5" r="5" />
              <circle cx="7" cy="13" r="1.5" />
            </g>

            <!-- knit / purl stitch rows -->
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="1.15"
              stroke-linecap="round"
            >
              <path d="M12 132 q11 -19 22 0 q11 19 22 0 q11 -19 22 0 q11 19 22 0" />
              <path d="M12 152 q11 -19 22 0 q11 19 22 0 q11 -19 22 0 q11 19 22 0" />
            </g>

            <!-- ball of yarn with loose strand -->
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="1.15"
              stroke-linecap="round"
            >
              <circle cx="176" cy="150" r="22" />
              <path d="M158 138 q18 12 36 24" />
              <path d="M156 152 q20 8 40 -6" />
              <path d="M166 170 q12 -20 26 -30" />
              <path d="M197 158 q16 10 8 26 t-24 10" />
            </g>

            <!-- bobbin of thread -->
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="1.15"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M44 196 h34 M44 232 h34" />
              <path d="M52 196 v36 M70 196 v36" />
              <path d="M52 206 h18 M52 214 h18 M52 222 h18" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hctpalWorkbook)" />
      </svg>

      <!-- Plate edges, in the image's own 0–1 box so they scale with it. -->
      <svg class="absolute size-0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="hctpalPlateCurve" clipPathUnits="objectBoundingBox">
            <path
              d="M0.16,0 C0.02,0.16 0.02,0.34 0.1,0.5 C0.18,0.66 0.18,0.84 0.04,1 L1,1 L1,0 Z"
            />
          </clipPath>
          <clipPath id="hctpalPlateArch" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V0.86 C0.7,1 0.3,1 0,0.86 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        class="relative mx-auto max-w-300 px-[max(16px,4vw)] py-(--section-y)"
      >
        <div class="relative">
          <!-- Tilted sheet underneath, like a pattern page slipped behind the card -->
          <div
            class="absolute inset-0 hidden -rotate-2 rounded-[clamp(20px,2.4vw,32px)] border border-(--line) bg-(--paper-soft) sm:block"
            aria-hidden="true"
          ></div>

          <section
            id="contact"
            aria-labelledby="contact-title"
            class="relative grid overflow-hidden rounded-[clamp(20px,2.4vw,32px)] border border-(--line) bg-(--paper-soft) shadow-[0_1px_2px_var(--line)] lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div
              class="flex flex-col gap-[clamp(20px,2.4vw,28px)] px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,64px)]"
            >
              <p
                class="flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-(--muted)"
              >
                <span class="font-serif text-[13px] tracking-[0.02em] text-(--rust)"
                  >02</span
                >
                {{ t("footerContactEyebrow") }}
              </p>

              <div class="flex flex-col gap-3">
                <h2
                  id="contact-title"
                  class="font-serif text-[clamp(32px,4.2vw,64px)] font-normal leading-[1.02] tracking-[-0.035em] text-(--ink)"
                >
                  {{ t("footerContactTitle")
                  }}<span class="text-(--rust)" aria-hidden="true">.</span>
                </h2>
                <p
                  class="max-w-[46ch] text-[clamp(14px,1.1vw,16px)] leading-[1.65] text-(--brown)"
                >
                  {{ t("footerContactBody") }}
                </p>
              </div>

              <p class="flex flex-wrap items-center gap-x-5 text-sm text-(--brown)">
                <span
                  class="text-[11px] font-semibold uppercase tracking-[0.11em] text-(--muted)"
                >
                  {{ t("footerReachUs") }}
                </span>
                <a
                  v-for="link in reachLinks"
                  :key="link.href"
                  :href="link.href"
                  :target="link.external ? '_blank' : undefined"
                  :rel="link.external ? 'noopener' : undefined"
                  class="inline-flex min-h-11 items-center underline decoration-(--muted) underline-offset-4 transition-colors hover:decoration-(--rust) motion-reduce:transition-none"
                  >{{ link.label }}</a
                >
              </p>

              <!-- Paired row needs the viewport (sm) AND a 28rem-wide form; the 1024px column is narrower. -->
              <form class="@container flex flex-col gap-3" @submit.prevent="submit">
                <div class="grid gap-3 sm:@md:grid-cols-2">
                  <div
                    v-for="f in fields"
                    :key="f.name"
                    class="relative"
                    :class="f.wide && 'sm:@md:col-span-2'"
                  >
                    <input
                      :id="`contact-${f.name}`"
                      v-model="form[f.name]"
                      :name="f.name"
                      :type="f.type"
                      :autocomplete="f.autocomplete"
                      :required="f.required"
                      placeholder=" "
                      :class="fieldClass"
                    />
                    <label :for="`contact-${f.name}`" :class="labelClass">{{
                      f.label
                    }}</label>
                    <UIcon :name="f.icon" :class="iconClass" aria-hidden="true" />
                  </div>

                  <div class="relative sm:@md:col-span-2">
                    <textarea
                      id="contact-message"
                      v-model="form.message"
                      name="message"
                      autocomplete="off"
                      rows="5"
                      required
                      placeholder=" "
                      class="resize-y"
                      :class="fieldClass"
                    ></textarea>
                    <label for="contact-message" :class="labelClass">{{
                      t("footerFormMessage")
                    }}</label>
                    <UIcon
                      name="i-heroicons-chat-bubble-bottom-center-text"
                      :class="iconClass"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <!-- Mobile stacks primary first; from sm the pair reads attach → send. -->
                <div
                  class="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                >
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      id="contact-file"
                      ref="fileInput"
                      type="file"
                      name="attachment"
                      class="peer sr-only"
                      @change="onFile"
                    />
                    <label
                      for="contact-file"
                      class="loom-ghost min-h-12! cursor-pointer justify-center text-(--ink) hover:bg-(--ink) hover:text-(--paper) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-(--ink)"
                    >
                      <UIcon
                        name="i-heroicons-paper-clip"
                        class="size-4"
                        aria-hidden="true"
                      />
                      {{ t("footerFormAttach") }}
                    </label>
                    <p
                      v-if="form.file"
                      class="flex min-w-0 items-center gap-1 text-sm text-(--brown)"
                    >
                      <span class="truncate">{{ form.file.name }}</span>
                      <button
                        type="button"
                        class="grid size-11 shrink-0 place-items-center rounded-full hover:bg-(--panel)"
                        :aria-label="t('footerFormRemoveFile')"
                        @click="clearFile"
                      >
                        <UIcon
                          name="i-heroicons-x-mark"
                          class="size-4"
                          aria-hidden="true"
                        />
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit"
                    class="loom-cta min-h-12! justify-center sm:ml-auto"
                    :class="status === 'sending' && 'cursor-progress'"
                    :disabled="status === 'sending'"
                  >
                    <UIcon
                      name="i-heroicons-paper-airplane"
                      class="size-4"
                      aria-hidden="true"
                    />
                    {{
                      status === "sending" ? t("footerFormSending") : t("footerFormSend")
                    }}
                  </button>
                </div>

                <div aria-live="polite" class="min-h-6 text-sm text-(--brown)">
                  <p
                    v-if="status === 'sent' || status === 'error'"
                    :key="status"
                    class="transition-opacity duration-500 starting:opacity-0 motion-reduce:transition-none"
                  >
                    <template v-if="status === 'sent'">{{
                      t("footerFormSent")
                    }}</template>
                    <template v-else>
                      {{ t("footerFormError") }}
                      <a
                        href="mailto:info@hameemchingtai.com"
                        class="underline underline-offset-4"
                        >info@hameemchingtai.com</a
                      >.
                    </template>
                  </p>
                </div>
              </form>

              <!-- Ruled docket — reads like a tailor's order sheet -->
              <section
                id="visit"
                aria-labelledby="visit-title"
                class="flex flex-col gap-3 border-t border-(--line) pt-[clamp(20px,2.4vw,28px)]"
              >
                <h3
                  id="visit-title"
                  class="text-[11px] font-semibold uppercase tracking-[0.11em] text-(--muted)"
                >
                  {{ t("footerVisitEyebrow") }}
                </h3>
                <dl class="grid max-w-100 border-t border-(--line)">
                  <div
                    v-for="spec in facilitySpecs"
                    :key="spec.label"
                    class="flex justify-between gap-5 border-b border-(--line) py-2.75"
                  >
                    <dt
                      class="text-[10px] font-semibold uppercase tracking-[0.09em] text-(--muted)"
                    >
                      {{ spec.label }}
                    </dt>
                    <dd class="m-0 text-right text-xs text-(--brown)">
                      {{ spec.value }}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <!--
              Plate: on top below lg with an arched bottom; from lg it fills the
              card's right side with an S-curve edge. The stitch is the same
              curve, nudged 24px into the card (into padding, never a field).
            -->
            <figure class="relative order-first m-0 lg:order-0">
              <img
                :src="denimToolBelt"
                alt="Denim tool belt cut from a single jean leg, fitted on a tailor's mannequin"
                loading="lazy"
                decoding="async"
                class="aspect-16/10 w-full bg-(--panel) object-cover [clip-path:url(#hctpalPlateArch)] sm:aspect-21/9 lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:[clip-path:url(#hctpalPlateCurve)]"
              />
              <svg
                class="pointer-events-none absolute inset-0 size-full translate-y-6 overflow-visible text-(--rust) lg:hidden"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M0,0.86 C0.3,1 0.7,1 1,0.86"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-dasharray="7 6"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
              <svg
                class="pointer-events-none absolute inset-0 hidden size-full -translate-x-6 overflow-visible text-(--rust) lg:block"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M0.16,0 C0.02,0.16 0.02,0.34 0.1,0.5 C0.18,0.66 0.18,0.84 0.04,1"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-dasharray="7 6"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </figure>
          </section>
        </div>
      </div>
    </div>

    <!-- GROUP 2: Finishing footer, revealed from under the contact card -->
    <!--
      A sticky element taller than the viewport pins its bottom edge and its
      top can never scroll into view. So the reveal only switches on where the
      whole footer fits (desktop width, 720px+ of height); everywhere else it
      sits in normal flow.
    -->
    <div
      class="relative z-0 overflow-hidden bg-(--ink) text-(--paper) lg:[@media(min-height:720px)]:sticky lg:[@media(min-height:720px)]:bottom-0"
    >
      <div
        class="mx-auto flex max-w-360 flex-col px-[max(16px,4vw)] pb-4 pt-(--section-y)"
      >
        <!-- Brand block and the stitched world map -->
        <div
          class="relative isolate flex flex-col items-center gap-[clamp(16px,1.8vw,24px)] pb-[clamp(44px,5.5vw,80px)] text-center"
        >
          <p
            class="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--paper)/65"
          >
            HCTPAL
          </p>
          <p
            class="font-serif text-[clamp(34px,5.2vw,76px)] font-normal leading-none tracking-[-0.035em]"
          >
            Ha-Meem Ching Tai
          </p>
          <p
            class="max-w-[38ch] text-pretty text-[13px] italic leading-[1.6] text-(--paper)/75 sm:text-sm lg:max-w-[44ch]"
          >
            {{ t("footerMission") }}
          </p>

          <nav :aria-label="t('footerNavLabel')">
            <ul
              class="flex flex-wrap justify-center gap-x-[clamp(18px,2.6vw,40px)] text-xs font-semibold uppercase tracking-widest"
            >
              <li v-for="link in footerNav" :key="link.href">
                <a :href="link.href" :class="footerLinkClass">{{ link.label }}</a>
              </li>
            </ul>
          </nav>

          <!--
            Below lg the map sits in flow under the nav, cropped to the
            Europe-to-Asia half so the stitches and the route stay readable;
            the mask feathers the cropped edges.
            From lg the wrapper dissolves (`contents`) and the full map becomes
            the backdrop, with the pins landing to the right of the copy.
          -->
          <div
            class="relative aspect-video w-full max-w-130 overflow-hidden mask-[radial-gradient(closest-side,black_62%,transparent)] lg:contents"
            aria-hidden="true"
          >
            <svg
              class="pointer-events-none absolute left-[-92%] top-[-12%] w-[192%] max-w-none text-(--paper) lg:left-1/2 lg:top-[45%] lg:-z-10 lg:w-[min(100%,940px)] lg:-translate-x-1/2 lg:-translate-y-1/2"
              viewBox="0 0 1000 436"
              fill="none"
              focusable="false"
            >
              <defs>
                <clipPath id="hctpalWorldLand">
                  <path :d="WORLD_LAND" />
                </clipPath>
                <!-- Two staggered rows of running stitch -->
                <pattern
                  id="hctpalWorldStitch"
                  width="12"
                  height="12"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M1 3h6M7 9h6M-5 9h6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </pattern>
              </defs>

              <rect
                width="1000"
                height="436"
                fill="url(#hctpalWorldStitch)"
                clip-path="url(#hctpalWorldLand)"
                class="opacity-35 lg:opacity-25"
              />

              <!-- Thread from the factory to the partner's head office -->
              <path
                :d="`M${FACTORY_PIN.x} ${FACTORY_PIN.y} Q${
                  (FACTORY_PIN.x + PARTNER_PIN.x) / 2
                } ${FACTORY_PIN.y - 26} ${PARTNER_PIN.x} ${PARTNER_PIN.y}`"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-dasharray="4 4"
                class="opacity-80"
              />
              <circle
                :cx="FACTORY_PIN.x"
                :cy="FACTORY_PIN.y"
                r="5"
                stroke="currentColor"
                stroke-width="1"
                class="origin-center transform-fill motion-safe:animate-ping motion-safe:[animation-duration:2.8s]"
              />
              <circle
                v-for="pin in [FACTORY_PIN, PARTNER_PIN]"
                :key="pin.x"
                :cx="pin.x"
                :cy="pin.y"
                r="4"
                stroke="currentColor"
                stroke-width="1.5"
                class="fill-(--rust)"
              />
            </svg>
          </div>

          <p
            class="text-balance text-[11px] font-semibold uppercase leading-[1.6] tracking-[0.11em] text-(--paper)/65"
          >
            <span
              class="mr-2 inline-block size-2 rounded-full bg-(--rust) align-baseline ring-1 ring-(--paper)"
              aria-hidden="true"
            ></span
            >{{ t("see Us In Google Maps") }}
          </p>
        </div>

        <!-- Addresses, contact, clients -->
        <div
          class="grid grid-cols-1 gap-x-8 gap-y-7 border-t border-dashed border-(--paper)/30 pt-7 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_1.1fr]"
        >
          <div
            v-for="block in footerBlocks"
            :key="block.label"
            class="flex flex-col items-start text-[13px] leading-[1.6] text-(--paper)/85"
          >
            <h3
              class="mb-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-(--paper)/65"
            >
              {{ block.label }}
            </h3>
            <p v-for="line in block.lines" :key="line" class="max-w-[34ch]">{{ line }}</p>
            <a
              v-if="block.phone"
              :href="`tel:${block.phone.replace(/\s/g, '')}`"
              :class="footerLinkClass"
              class="-my-2"
              >{{ block.phone }}</a
            >
            <a
              v-if="block.email"
              :href="`mailto:${block.email}`"
              :class="footerLinkClass"
              class="-my-2"
              >{{ block.email }}</a
            >
          </div>

          <div class="flex flex-col items-start">
            <h3
              class="mb-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-(--paper)/65"
            >
              {{ t("footerTrustedBy") }}
            </h3>
            <ul
              class="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold uppercase leading-[1.6] tracking-[0.06em] text-(--paper)/85"
            >
              <li v-for="brand in trustedBrands" :key="brand">{{ brand }}</li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div
          class="mt-7 grid grid-cols-1 items-center gap-1 border-t border-(--paper)/15 pt-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-(--paper)/65 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:text-left"
        >
          <span
            >© {{ new Date().getFullYear() }} Ha-Meem Ching Tai Pocketing &amp;
            Accessories Ltd.</span
          >
          <span>{{ t("footerRights") }}</span>
          <!-- href is the no-JS fallback; `.stop` keeps Lenis' own anchor
               handler from scrolling a second time. -->
          <a
            href="#top"
            :class="footerLinkClass"
            class="group justify-self-center gap-1.5 md:justify-self-end"
            @click.prevent.stop="scrollToTop"
          >
            {{ t("footerBackToTop") }}
            <UIcon
              name="i-heroicons-arrow-up-20-solid"
              class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
