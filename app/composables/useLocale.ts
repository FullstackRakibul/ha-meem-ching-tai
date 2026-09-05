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
 * linkage, caustic recovery, Oeko-Tex) that are easy to get subtly wrong.
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
  menu: 'Menu',
  close: 'Close',
  language: 'Language',
  contactSupport: 'Contact Support',
  companyName: 'Ha-Meem Ching Tai Pocketing & Accessories Ltd.',
  skipToContent: 'Skip to content',

  // ── Nav ─────────────────────────────────────────────────
  navHome: 'Home',
  navWhyMatters: 'Why It Matters',
  navProducts: 'Products',
  navFactory: 'Factory',
  navContact: 'Contact',

  // ── Hero ────────────────────────────────────────────────
  heroLede:
    'Precision Engineering. Crafting export-quality accessories for the global apparel industry.',
  heroCta: 'Explore Catalog',
  heroStatementLabel: 'Strategic Partnership',
  heroStatementTitle: 'Ha-Meem × Ching Tai',

  // ── Intro ───────────────────────────────────────────────
  introTitle: "Built to Strengthen Bangladesh's Manufacturing Future",
  introBody:
    'Ha-Meem Ching Tai Pocketing & Accessories Ltd. (HCTPAL) supplies global garment brands with high-performance pocketing, interlinings, waistbands, and custom accessory trims — manufactured locally using advanced Chinese technology.',
  introCta: 'Why It Matters',

  // ── Service ticker ──────────────────────────────────────
  service1: 'OEKO-TEX Standard 100 Certified',
  service2: 'High-Speed Air-Jet Looms',
  service3: 'Custom Color Matching & Dyeing',
  service4: 'Strict Tensile & Wash Fastness',
  service5: 'Bulk Supply for Global Brands',
  service6: 'In-House Testing Facility',
  service7: 'Fast Turnaround Times',
  service8: 'American Eagle Partner',

  // ── Why It Matters ──────────────────────────────────────
  whyEyebrow: 'Why It Matters',
  whyHeadline: "Lead time is the industry's weakness. This is the answer.",
  why1Title: 'Reducing Lead Time',
  why1Text:
    'Fabrics are mostly local, but imported accessories delay production. Making them at home closes the gap.',
  why2Title: 'Saving Foreign Currency',
  why2Text:
    'Lower import dependency keeps earnings inside Bangladesh, strengthening the national economy.',
  why3Title: 'Integrated Supply Chain',
  why3Text:
    'One step toward a fully integrated backward linkage chain — from raw fiber to finished garment accessory.',
  why4Title: 'Export Growth',
  why4Text:
    "Faster turnarounds increase buyers' confidence in placing export orders with Bangladesh.",

  // ── Venture stats ───────────────────────────────────────
  ventureEyebrow: 'The Venture at a Glance',
  ventureHeadline: 'A new era in garment accessories manufacturing.',
  stat1Label: 'Initial Investment',
  stat1Desc: 'Phase one capital expenditure',
  stat2Label: 'Monthly Output (yd)',
  stat2Desc: 'Initial phase: sizing & weaving',
  stat3Label: 'Future Capacity (yd)',
  stat3Desc: 'Per month at full scale',
  stat4Label: 'Employment Target',
  stat4Desc: '90% local hiring mandate',
  stat5Label: 'Solar Investment',
  stat5Desc: '16.9 MW capacity across Textile Zone',
  stat6Label: 'Water Discharge',
  stat6Desc: 'Goal by 2030 with caustic recovery',
  stat7Label: 'Ching Tai Stake',
  stat7Desc: 'Chinese JV partner equity',

  // ── Factory ─────────────────────────────────────────────
  factoryEyebrow: 'About the Factory',
  factoryTitle: "Built to strengthen Bangladesh's manufacturing future",
  factory1Title: 'Made Locally',
  factory1Text:
    'Accessories that once had to be imported from China are now produced in Bangladesh — cutting delays and keeping value within the national supply chain.',
  factory2Title: 'Advanced Technology',
  factory2Text:
    'Advanced Chinese technology and modern machinery manufacture accessories at scale, delivering consistent quality that meets international specifications.',
  factory3Title: 'Built for Export',
  factory3Text:
    'Every product line is engineered to satisfy the compliance and quality thresholds of international apparel buyers.',

  // ── Products ────────────────────────────────────────────
  featuredTitle: 'Featured Accessories',
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
  scene1Title: 'Pocketing',
  scene1Desc:
    'Crafted to meet international specifications, competing with markets like Japan and China. High-density cotton, TC blended, and twill pocketings engineered for strength.',
  scene2Title: 'Interlinings',
  scene2Desc:
    'High-quality shape retention for premium manufacturing. Fusible, non-fusible, woven, and non-woven interlinings tailored for garment stability.',
  scene3Title: 'Waistbands',
  scene3Desc:
    'Precision-engineered for long-lasting wear and consistent tension. Pre-constructed jacket and trouser waistbands with custom rubberized grip tape.',
  scene4Title: 'Trims',
  scene4Desc:
    'A comprehensive suite of export-quality trims. Custom brand labels, seam tapes, and accessories meeting international Oeko-Tex standards.',

  // ── Sustainability ──────────────────────────────────────
  sustainEyebrow: 'Solar-Powered Manufacturing',
  sustainHeadline: 'Harnessing the sun to build the future of textiles.',
  sustainStat1Value: '16.9 MW',
  sustainStat1Label: 'Solar Power Capacity',
  sustainStat1Desc: 'Driving our high-speed weaving and automated units.',
  sustainStat2Value: 'Zero',
  sustainStat2Label: 'Water Discharge by 2030',
  sustainStat2Desc: 'Achieved through advanced closed-loop caustic recovery.',
  sustainCta: 'Explore Development Milestones',

  // ── Sustainability section ──────────────────────────────
  visionEyebrow: 'Our Vision',
  visionTitle: 'Sustainability & Environmental Initiatives',
  visionBody:
    'Weaving nature into every thread. We are committed to green manufacturing, integrating advanced technology with holistic environmental stewardship to drive systemic change.',
  pillar1Title: 'Environmental Initiatives',
  pillar1Desc: 'Strategic partnerships driving systemic change and protecting ecosystems.',
  pillar2Title: 'UN SDG Alignment',
  pillar2Desc: 'Global goals addressed through tangible, verifiable, and targeted action.',
  pillar3Title: 'Green Manufacturing',
  pillar3Desc: 'Where technology, circularity, and operational efficiency converge flawlessly.',

  // ── Footer ──────────────────────────────────────────────
  footerVisitEyebrow: 'Factory & Headquarters',
  footerVisitTitle: 'Schedule a Technical Facility Tour',
  footerVisitBody:
    'Explore our high-speed weaving looms, coating units, and automated packaging lines in person.',
  footerVisitCta: 'Book Visit',
  footerSpecLocationLabel: 'Location',
  footerSpecLocationValue: 'Ghorashal, Narsingdi',
  footerSpecLeadLabel: 'Lead time',
  footerSpecLeadValue: 'Two weeks notice',
  footerSpecFloorsLabel: 'Floors',
  footerSpecFloorsValue: 'Weaving · Coating · Packing',
  footerContactEyebrow: 'Custom Orders & Bulk Supply',
  footerContactTitle: 'Work with HCTPAL',
  footerContactBody:
    'Tell us the construction, the width, and the volume. We come back with a swatch, a price, and a date we can actually hold.',
  footerContactCta: 'Get in Touch',
  footerPlateLabel: 'Plate 01',
  footerPlateCaption: 'Tool belt, cut from a single leg — sample room, Ghorashal',
  footerInsetCaption: 'Off-cut denim, re-stitched into shop-floor storage.',
  footerFactoryHq: 'Factory HQ',
  footerFactoryHqValue: 'Ghorashal, Narsingdi, Bangladesh',
  footerHeadOffice: 'Head Office',
  footerHeadOfficeValue: 'Times Media Limited Building, 387, Dhaka 1208',
  footerContactLabel: 'Contact',
  footerMission:
    '"For decades, mills waited on imports. We built the alternative in Bangladesh — pocketing, interlinings, labels, and the care that ships with them."',
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
