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
        class="relative mx-auto max-w-300 px-[max(16px,4vw)] py-[clamp(64px,10vw,160px)]"
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

    <!-- GROUP 2: Sticky Reveal Footer -->
    <div
      class="sticky bottom-0 z-0 flex h-[max(1020px,70svh)] flex-col justify-between overflow-hidden bg-black px-[max(12px,1.1vw)] pb-3 pt-4.5 text-white"
    >
      <div class="absolute inset-0">
        <img
          src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg"
          alt="Fabric weave background"
          class="h-full w-full object-cover"
        />
      </div>

      <!-- FIX: Explicitly closed div prevents DOM hierarchy bugs -->
      <div
        class="absolute inset-0 bg-[linear-gradient(0deg,rgb(0_0_0/0.85),rgb(0_0_0/0.55)_55%,rgb(0_0_0/0.75))]"
      ></div>

      <div
        class="relative z-1 grid grid-cols-1 gap-7.5 border-t border-white/25 pt-2.25 sm:grid-cols-2 md:grid-cols-[1.2fr_1.3fr_1fr]"
      >
        <div
          v-for="block in footerBlocks"
          :key="block.label"
          class="flex flex-col items-start gap-1 text-[11px] uppercase leading-normal"
        >
          <span class="mb-1.75 text-[9px] font-semibold tracking-[0.08em] text-white/75">
            {{ block.label }}
          </span>
          <p v-for="line in block.lines" :key="line" class="m-0">{{ line }}</p>
          <a v-if="block.phone" href="tel:+8801319320527">{{ block.phone }}</a>
          <a v-if="block.email" :href="`mailto:${block.email}`">{{ block.email }}</a>
        </div>
      </div>

      <div
        class="relative z-1 mx-auto max-w-150 text-center text-[13px] italic leading-[1.6] text-white/75"
      >
        {{ t("footerMission") }}
      </div>

      <div class="relative z-1 pt-5 text-center">
        <span
          class="mb-2.5 block text-[9px] font-semibold uppercase tracking-widest text-white/75"
        >
          {{ t("footerTrustedBy") }}
        </span>
        <div
          class="flex flex-wrap justify-center gap-x-[clamp(20px,3vw,50px)] gap-y-2 text-xs font-semibold uppercase tracking-[0.06em] text-white/75"
        >
          <span v-for="brand in trustedBrands" :key="brand">{{ brand }}</span>
        </div>
      </div>

      <div
        class="relative z-1 self-center text-[clamp(92px,17.3vw,330px)] font-light uppercase leading-[0.72] tracking-[-0.09em]"
      >
        HCTPAL
      </div>

      <div
        class="relative z-1 grid grid-cols-1 gap-2 border-t border-white/25 pt-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-white/75 sm:grid-cols-[1fr_auto_1fr] sm:gap-0 sm:text-left"
      >
        <span
          >© {{ new Date().getFullYear() }} Ha-Meem Ching Tai Pocketing &amp; Accessories
          Ltd.</span
        >
        <span class="sm:text-center">{{ t("footerRights") }}</span>
        <a href="#top" class="sm:text-right">{{ t("footerBackToTop") }}</a>
      </div>
    </div>
  </footer>
</template>
