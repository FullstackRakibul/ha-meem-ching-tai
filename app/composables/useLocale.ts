/**
 * Locale store for the whole site.
 *
 * The project has no i18n module, so this is a deliberately small stand-in:
 * one shared reactive locale plus every user-visible string on the landing
 * page. Swapping to `@nuxtjs/i18n` later means moving `messages` into its
 * locale files — `locale`, `setLocale`, `t` and `LOCALES` keep their shape.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TRANSLATION STATUS
 *
 * `en` is the real copy. `zh` and `bn` are STRUCTURALLY COMPLETE but hold
 * English text as placeholders — every key exists, so switching language can
 * never produce a blank or a missing-key crash, but the words are not yet
 * translated.
 *
 * This is intentional. The copy is customer-facing marketing for a real
 * manufacturer and carries domain terms (pocketing, interlinings, backward
 * linkage, caustic recovery) that are easy to get subtly wrong.
 * A native speaker should replace the values below; no code changes are
 * needed when they do — only this file is edited.
 *
 * Progress is measurable: `translationProgress('bn')` returns the share of
 * keys that differ from English.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const LOCALES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'bn', label: 'Bangla', native: 'বাংলা' },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

/** Shape of one locale's messages. `en` below is the source of truth. */
export type Messages = typeof en

const en = {
  // ── Chrome ──────────────────────────────────────────────
  inquire: 'Inquire',
  contactCta: 'Contact us',
  menu: 'Menu',
  close: 'Close',
  language: 'Language',
  contactSupport: 'Contact',
  companyName: 'Ha-Meem Ching Tai Pocketing & Accessories Ltd.',
  skipToContent: 'Skip to content',
  whatsappLabel: 'Chat with HCTPAL on WhatsApp',
  railLabel: 'Chapters',
  railOpen: 'Show all chapters',

  // ── Nav / chapters (the status rail and the menu share these) ─
  navHome: 'Home',
  navWhyMatters: 'Why It Matters',
  navMilestones: 'Milestones',
  navFactory: 'Factory',
  navProducts: 'Products',
  navSustainability: 'Sustainability',
  navPartnership: 'Partnership',
  navContact: 'Contact',
  navIndex: 'Product lines',

  // ── Hero (boot) ─────────────────────────────────────────
  heroEyebrow: 'Ha-Meem . Ching Tai · Pocketing & Accessories',
  heroTitleA: 'Garment accessories,',
  heroTitleB: 'made in Bangladesh.',
  heroLede:
    'Pocketing fabrics, interlinings, waistbands, labels, tapes and packaging accessories — built to Japan and China quality benchmarks in Ghorashal, Narsingdi.',
  heroCta: 'Explore collections',
  heroSecondaryCta: 'Why it matters',
  heroLocation: 'Ghorashal, Narsingdi · Bangladesh',
  heroDivision: 'Pocketing & Accessories',

  // ── Intro (index) ───────────────────────────────────────
  introTitle: "Built to strengthen Bangladesh's manufacturing future",
  introBody:
    'Ha-Meem Ching Tai Pocketing & Accessories Ltd. (HCTPAL) manufactures pocketing, interlinings, waistbands and garment trims for global apparel brands — locally, with technology from joint-venture partner Ching Tai.',
  introCta: 'Why it matters',
  introTableLabel: 'Product lines',
  introImageAlt: 'A pocket pattern being marked out on denim',
  service1: 'Pocketing fabrics',
  service2: 'Interlinings',
  service3: 'Waistbands',
  service4: 'Garment trims',
  service5: 'Labels & tapes',
  service6: 'Packaging accessories',
  service7: 'Quality benchmark: Japan & China standards',
  service8: 'Clients include American Eagle',

  // ── Why It Matters (the Short Thread) ───────────────────
  whyEyebrow: 'Why It Matters',
  whyHeadline: "Lead time is the industry's weakness. This is the answer.",
  whyLongLabel: 'Imported',
  whyLongNote: 'Accessories shipped in from abroad — the long way round.',
  whyShortLabel: 'Made in Ghorashal',
  whyShortNote: 'Made where the garments are made — the short thread.',
  why1Title: 'Reducing Lead Time',
  why1Text:
    'Fabrics are mostly local, but imported accessories delay production and shipment. Making them at home closes the gap.',
  why2Title: 'Saving Foreign Currency',
  why2Text:
    'Lower import dependency keeps earnings inside Bangladesh, strengthening the national economy.',
  why3Title: 'Backward Linkage',
  why3Text:
    "One step toward a fully integrated backward-linkage chain — strengthening Bangladesh's own supply of garment accessories.",
  why4Title: 'Export Confidence',
  why4Text:
    "Shorter lead times increase buyers' confidence in placing export orders with Bangladesh.",

  // ── Venture stats (telemetry) ───────────────────────────
  ventureEyebrow: 'The Venture at a Glance',
  ventureHeadline: 'A new era in garment accessories manufacturing.',
  stat1Label: 'Initial Investment',
  stat1Desc: 'Phase one',
  stat2Label: 'Monthly Output (yd)',
  stat2Desc: 'Sizing & weaving phase',
  stat3Label: 'Future Capacity (yd)',
  stat3Desc: 'Per month',
  stat4Label: 'Jobs',
  stat4Desc: '90% local hiring mandate',
  stat5Label: 'Solar Investment',
  stat5Desc: '16.9 MW of solar capacity',
  stat6Label: 'Water Discharge',
  stat6Desc: 'Target by 2030, with a caustic recovery plant',
  stat7Label: 'Ching Tai Stake',
  stat7Desc: 'Joint-venture partner equity',
  weaveCaption:
    "Woven area: today's 500,000 yd monthly output as a share of the 2M yd future capacity — 25%.",
  milestonesTitle: 'Development milestones',
  milestone1Label: 'Phase one',
  milestone1Text: 'Tk 100 crore investment · sizing & weaving · 500,000 yd a month',
  milestone2Label: 'Future capacity',
  milestone2Text: '2M yd a month',
  milestone3Label: '2030',
  milestone3Text: 'Zero water discharge, with a caustic recovery plant',

  // ── Factory (dawn) ──────────────────────────────────────
  factoryEyebrow: 'About the Factory',
  factoryTitle: '52 acres in Ghorashal.',
  factorySite: 'On the former Fawzia Jute Mill site, Ghorashal, Narsingdi.',
  factory1Title: 'Made Locally',
  factory1Text:
    'Accessories that once had to be imported are now produced in Bangladesh — cutting delays and keeping value within the national supply chain.',
  factory2Title: 'Joint-Venture Technology',
  factory2Text:
    "Ching Tai's manufacturing expertise and modern machinery, run to Japan and China quality benchmarks.",
  factory3Title: 'Built for Export',
  factory3Text:
    'Every product line is engineered to satisfy the compliance and quality thresholds of international apparel buyers.',
  factoryPointLabel: 'No.',
  factoryImageAlt: 'Invitation to the Ha-Meem Group inauguration ceremony',

  // ── Products ────────────────────────────────────────────
  featuredTitle: 'Featured Accessories',
  catalogueHint: 'Scroll sideways',
  catalogueDrag: 'Drag to browse',
  carouselPause: 'Pause carousel',
  carouselPlay: 'Play carousel',
  catPocketing: 'Pocketing Fabrics',
  catInterlinings: 'Interlinings',
  catWaistbands: 'Waistbands',
  product1: 'TC 65/35 Pocketing',
  product2: 'Woven Fusible Interlining',
  product3: 'Non-Woven Backing',
  product4: 'Shirt Collar Stay',
  product5: 'Printed Cotton Pocketing',
  product6: 'Stretch Trouser Waistband',

  // ── Category theatre ────────────────────────────────────
  sceneLabel: 'Scene',
  sceneCta: 'Request specs',
  sceneView: 'View image',
  scene1Title: 'Pocketing',
  scene1Desc:
    'Crafted to meet international specifications, benchmarked against Japan and China. High-density cotton, TC blended, and twill pocketings engineered for strength.',
  scene2Title: 'Interlinings',
  scene2Desc:
    'High-quality shape retention for premium manufacturing. Fusible, non-fusible, woven, and non-woven interlinings tailored for garment stability.',
  scene3Title: 'Waistbands',
  scene3Desc:
    'Precision-engineered for long-lasting wear and consistent tension. Pre-constructed jacket and trouser waistbands with custom rubberized grip tape.',
  scene4Title: 'Trims',
  scene4Desc:
    'Export-quality trims: custom brand labels, seam tapes and packaging accessories, built to Japan and China quality benchmarks.',

  // ── Sustainability (dusk) ───────────────────────────────
  sustainEyebrow: 'Solar-Powered Manufacturing',
  sustainHeadline: 'Powered by the sun. Closing the water loop.',
  sustainStat1Value: '16.9 MW',
  sustainStat1Label: 'Solar capacity',
  sustainStat1Desc: 'From a $9M solar investment.',
  sustainStat2Value: 'Zero',
  sustainStat2Label: 'Water discharge by 2030',
  sustainStat2Desc: 'The target, supported by a caustic recovery plant.',
  sustainCta: 'Development milestones',

  // ── Partnership (ply) ───────────────────────────────────
  originEyebrow: 'The Partnership',
  originLineA: 'A manufacturing partner,',
  originLineB: 'not a supplier.',
  originJv:
    'A joint venture of Ha-Meem Group (Bangladesh) and Ching Tai (China), which holds a 25% stake.',
  originJobs: '12,000 jobs, with a 90% local hiring mandate.',
  originStandards: 'Quality benchmarked to Japan and China standards.',
  originPlyCaption: 'Two plies, one yarn: Ha-Meem Group in navy, Ching Tai in gold.',
  originCta: 'Request samples',

  // ── Footer (contact) ────────────────────────────────────
  footerVisitEyebrow: 'Factory & Headquarters',
  footerVisitTitle: 'Schedule a Technical Facility Tour',
  footerVisitBody: 'See the sizing and weaving floor in person, on the 52-acre Ghorashal site.',
  footerVisitCta: 'Book Visit',
  footerSpecLocationLabel: 'Location',
  footerSpecLocationValue: 'Ghorashal, Narsingdi',
  footerSpecSiteLabel: 'Site',
  footerSpecSiteValue: '52 acres · former Fawzia Jute Mill',
  footerSpecPhaseLabel: 'Phase one',
  footerSpecPhaseValue: 'Sizing & weaving',
  footerContactEyebrow: 'Custom & Bulk Orders',
  footerContactTitle: 'Work with HCTPAL',
  footerContactBody:
    'Tell us the construction, the width, and the volume. We come back with a swatch and a price.',
  footerContactCta: 'Email us',
  footerWhatsapp: 'WhatsApp',
  footerCall: 'Call',
  footerPlateLabel: 'Plate 01',
  footerPlateCaption: 'Tool belt, cut from a single leg — sample room, Ghorashal',
  footerInsetCaption: 'Off-cut denim, re-stitched into shop-floor storage.',
  footerFactoryHq: 'Factory HQ',
  footerFactoryHqValue: 'Ghorashal, Narsingdi, Bangladesh',
  footerHeadOffice: 'Head Office',
  footerHeadOfficeValue: 'Times Media Limited Building, 387, Dhaka 1208',
  footerContactLabel: 'Contact',
  footerMission:
    '"Fabrics are mostly made in Bangladesh; accessories were not. We make them here — pocketing, interlinings, labels and tapes."',
  footerTrustedBy: 'Trusted By',
  footerRights: 'All rights reserved',
  footerBackToTop: 'Back to top ↑',
} as const

/**
 * zh / bn intentionally mirror `en` for now — see TRANSLATION STATUS above.
 * Replace values in place; keys must stay identical to `en`.
 */
const zh: Messages = { ...en }
const bn: Messages = { ...en }

const messages: Record<LocaleCode, Messages> = { en, zh, bn }

/** Share of keys actually translated (differ from English), 0–1. */
export function translationProgress(code: LocaleCode) {
  if (code === 'en') return 1
  const keys = Object.keys(en) as Array<keyof Messages>
  const done = keys.filter((k) => messages[code][k] !== en[k]).length
  return done / keys.length
}

export function useLocale() {
  const locale = useState<LocaleCode>('locale', () => 'en')

  const setLocale = (code: LocaleCode) => {
    locale.value = code
    if (import.meta.client) {
      document.documentElement.lang = code
      try {
        localStorage.setItem('hctpal-locale', code)
      } catch {
        // Private mode / blocked storage — the choice just won't persist.
      }
    }
  }

  /** Falls back to English so a missing key renders copy, never a blank. */
  const t = (key: keyof Messages): string =>
    messages[locale.value][key] ?? en[key] ?? (key as string)

  return { locale, setLocale, t, locales: LOCALES }
}
