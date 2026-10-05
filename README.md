<p align="center">
  <img src="public/hctpal.png" alt="HCTPAL logo" height="72" />
</p>

<h1 align="center">Ha-Meem Ching Tai Pocketing &amp; Accessories Ltd.</h1>

<p align="center">
  <strong>Garment accessories, made in Bangladesh.</strong><br />
  Pocketing fabrics · Interlinings · Waistbands · Labels &amp; tapes · Packaging accessories
</p>

---

## About the company

**Ha-Meem Ching Tai Pocketing & Accessories Ltd. (HCTPAL)** is a joint venture between **Ha-Meem Group** (Bangladesh) and **Ching Tai** (China). Ching Tai holds a 25% stake.

HCTPAL manufactures pocketing, interlinings, waistbands and garment trims for global apparel brands. Everything is made locally in Bangladesh, using Ching Tai's manufacturing expertise and modern machinery, and benchmarked against **Japan and China quality standards**. Its clients include **American Eagle**.

> *"Fabrics are mostly made in Bangladesh; accessories were not. We make them here — pocketing, interlinings, labels and tapes."*

### Why it matters

Bangladesh's garment industry makes most of its fabric at home, but accessories have mostly been imported. That adds weeks to every order. HCTPAL makes those accessories where the garments are made, which shortens the supply chain.

| | |
|---|---|
| **Reducing lead time** | Imported accessories delay production and shipment. Making them at home closes the gap. |
| **Saving foreign currency** | Lower import dependency keeps earnings inside Bangladesh and strengthens the national economy. |
| **Backward linkage** | A step toward a fully integrated backward-linkage chain for garment accessories. |
| **Export confidence** | Shorter lead times give buyers more confidence to place export orders with Bangladesh. |

### The venture at a glance

| | |
|---|---|
| Initial investment (phase one) | **Tk 100 crore** |
| Monthly output (sizing & weaving phase) | **500,000 yd** |
| Future capacity | **2M yd per month** |
| Jobs | **12,000**, with a 90% local hiring mandate |
| Solar | **16.9 MW** of capacity, from a $9M solar investment |
| Water | **Zero discharge by 2030**, supported by a caustic recovery plant |
| Site | **52 acres** at the former Fawzia Jute Mill, Ghorashal, Narsingdi |

### Product lines

- **Pocketing fabrics:** high-density cotton, TC-blended (e.g. TC 65/35) and twill pocketings engineered for strength, plus printed cotton pocketing.
- **Interlinings:** fusible, non-fusible, woven and non-woven interlinings for shape retention and garment stability, including non-woven backing and shirt collar stays.
- **Waistbands:** pre-constructed jacket and trouser waistbands, including stretch trouser waistbands with custom rubberized grip tape.
- **Trims:** custom brand labels, seam tapes and packaging accessories.

Every product line is designed to meet the compliance and quality requirements of international apparel buyers.

### Sustainability

The factory runs on **solar-powered manufacturing** (16.9 MW). It targets **zero water discharge by 2030**, supported by a caustic recovery plant.

### Locations

| | |
|---|---|
| **Factory HQ** | Ghorashal, Narsingdi, Bangladesh |
| **Head office** | Times Media Limited Building, 387, Dhaka 1208 |

Custom and bulk orders, sample requests and technical facility tours can all be arranged from the **Contact** section of the website. Send the construction, width and volume, and HCTPAL will reply with a swatch and a price.

---

## About the website

This repository contains the official HCTPAL marketing website. The landing page, **"The Loom OS"**, tells the company's story as one continuous scroll:

**boot → product lines → why it matters → the venture in numbers → the factory at dawn → collections → featured accessories → sustainability at dusk → the partnership → contact**

A single animated thread, rendered in WebGL, weaves through the page and links the chapters. It shows as a woven fabric for output figures, as sun and water for sustainability, and as two plies twisted into one yarn for the Ha-Meem × Ching Tai partnership.

### Highlights

- **Scroll-driven storytelling:** each section has its own animation, driven by GSAP ScrollTrigger and Lenis smooth scrolling.
- **A designed fallback for every device:** the site picks one of three rendering levels (full 3D, lite, or static poster). On low-power devices, browsers without WebGL, and with reduced motion turned on, matching SVG illustrations replace the 3D. Three.js isn't downloaded at all in poster mode.
- **Brand palette:** navy (Ha-Meem), gold (Ching Tai) and beige (fabric). Contrast is checked for readability.
- **Accessibility:** skip-to-content link, reduced-motion support, and semantic sections with chapter navigation.
- **Multilingual-ready:** English, Chinese (中文) and Bangla (বাংলা) locales. The Chinese and Bangla text is still being translated.
- **Branded details:** a ball-of-wool custom cursor, a full-screen menu with a wavy image preview, and a chapter status rail.

### Built with

| Area | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) / Vue 3 |
| UI & styling | [Nuxt UI v4](https://ui.nuxt.com), Tailwind CSS v4 |
| Motion | GSAP + ScrollTrigger, Lenis |
| 3D | Three.js |
| Icons | Heroicons |
| Typography | Manrope, Playfair Display, Hind Siliguri |

---

## Running locally

Requires Node.js 20+.

```bash
npm install        # install dependencies
npm run dev        # start the dev server
npm run build      # production build
npm run generate   # static pre-render
npm run preview    # preview the production build
```

For architecture details and contributor conventions, see [`CLAUDE.md`](CLAUDE.md) and [`.claude/ARCHITECTURE.md`](.claude/ARCHITECTURE.md).

---

<p align="center">© Ha-Meem Ching Tai Pocketing &amp; Accessories Ltd. All rights reserved.</p>
