<!-- AppFooter.vue -->
<template>
  <footer class="footer-root relative w-full  overflow-hidden">
    <!-- ================= Background Art Layer ================= -->
    <!-- Bottom-anchored garment line-art with gradient fade overlay -->
    <div class="footer-bg" aria-hidden="true" />
    <div class="footer-gradient" aria-hidden="true" />

    <!-- ================= Content Layer ================= -->
    <div class="relative z-10 ">
      <UContainer>
        <!-- 3-Column Grid -->
        <div class="h-screen grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 pt-16 pb-24 md:pt-20 md:pb-32">

          <!-- Column 1 — Brand -->
          <div class="col-brand">
            <h3 class="footer-brand-name">
              HA-MEEM<br />CHING TAI
            </h3>
            <div class="footer-brand-rule" />
            <p class="footer-brand-mission">
              For decades, mills waited on imports. We built the alternative
              in Bangladesh — pocketing, interlinings, labels, and the care
              that ships with them.
            </p>
          </div>

          <!-- Column 2 — Find Us -->
          <div class="col-findus">
            <h4 class="footer-heading">Find Us</h4>

            <ul class="footer-contact-list">
              <!-- Ghorashal HQ -->
              <li>
                <UIcon name="heroicons:map-pin" class="footer-icon" />
                <div>
                  <span class="footer-contact-label">Factory HQ</span>
                  <span class="footer-contact-text">Ghorashal, Narsingdi, Bangladesh</span>
                </div>
              </li>
              <!-- Dhaka Head Office -->
              <li>
                <UIcon name="heroicons:building-office-2" class="footer-icon" />
                <div>
                  <span class="footer-contact-label">Head Office</span>
                  <span class="footer-contact-text">Times Media Building, 387 Tejgaon, Dhaka 1208</span>
                </div>
              </li>
              <!-- Phone -->
              <li>
                <UIcon name="heroicons:phone" class="footer-icon" />
                <a href="tel:+8801319320527" class="footer-contact-text footer-link">
                  +880 131 9320527
                </a>
              </li>
              <!-- Email -->
              <li>
                <UIcon name="heroicons:envelope" class="footer-icon" />
                <a href="mailto:info@hameemchingtai.com" class="footer-contact-text footer-link">
                  info@hameemchingtai.com
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3 — Connect -->
          <div class="col-connect">
            <h4 class="footer-heading">Connect</h4>

            <!-- Social Icons -->
            <div class="footer-social-row">
              <a v-for="social in socials" :key="social.label" :href="social.href" :aria-label="social.label"
                target="_blank" rel="noopener noreferrer" class="footer-social-icon">
                <UIcon :name="social.icon" class="size-[18px]" />
              </a>
            </div>

            <!-- Newsletter -->
            <div class="footer-newsletter">
              <p class="footer-newsletter-label">Stay in the loop</p>
              <form class="footer-newsletter-form" @submit.prevent="handleSubscribe">
                <input v-model="email" type="email" placeholder="your@email.com" required
                  class="footer-newsletter-input" />
                <button type="submit" class="footer-newsletter-btn" aria-label="Subscribe">
                  <UIcon name="heroicons:arrow-right-20-solid" class="size-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </UContainer>

      <!-- ================= Bottom Bar ================= -->
      <div class="footer-bottom-bar">
        <UContainer>
          <div class="footer-bottom-inner">
            <p class="footer-copyright">
              &copy; {{ new Date().getFullYear() }} Ha-Meem Ching Tai Pocketing &amp; Accessories Ltd.
            </p>
            <div class="footer-legal-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </UContainer>
      </div>
    </div>
  </footer>
</template>

<script setup>
const email = ref("");

const socials = [
  { label: "LinkedIn", icon: "heroicons:link", href: "https://linkedin.com" },
  { label: "Facebook", icon: "heroicons:globe-alt", href: "https://facebook.com" },
  { label: "Email Us", icon: "heroicons:envelope", href: "mailto:info@hameemchingtai.com" },
];

const handleSubscribe = () => {
  console.log("Subscribe:", email.value);
  email.value = "";
};
</script>

<style scoped>
/* ─── Root Container ─── */
.footer-root {
  background-color: #f5f5f0;
  min-height: 480px;
}

/* ─── Background Art (bottom-anchored) ─── */
.footer-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: url('~/assets/img/HCTPAL.svg');
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-width: 768px) {
  .footer-bg {
    background-size: contain;
    background-position: bottom center;
  }
}

/* ─── Gradient Overlay (solid top → transparent bottom) ─── */
.footer-gradient {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(to bottom,
      #f5f5f0 0%,
      #f5f5f0 25%,
      rgba(245, 245, 240, 0.92) 40%,
      rgba(245, 245, 240, 0.6) 60%,
      rgba(245, 245, 240, 0.25) 78%,
      rgba(245, 245, 240, 0) 100%);
}

/* ─── Brand Column ─── */
.footer-brand-name {
  font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--brown, #242c2c);
}

.footer-brand-rule {
  width: 36px;
  height: 2px;
  margin: 16px 0 18px;
  background: var(--brass, #b88d4c);
  border-radius: 1px;
}

.footer-brand-mission {
  font-size: 0.875rem;
  line-height: 1.65;
  color: color-mix(in srgb, var(--brown, #242c2c) 62%, transparent);
  max-width: 320px;
}

/* ─── Section Headings ─── */
.footer-heading {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--brown, #242c2c) 55%, transparent);
  margin-bottom: 20px;
}

/* ─── Contact List ─── */
.footer-contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.footer-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  color: var(--brass, #b88d4c);
}

.footer-contact-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--brown, #242c2c);
  margin-bottom: 2px;
}

.footer-contact-text {
  display: block;
  font-size: 0.825rem;
  line-height: 1.5;
  color: color-mix(in srgb, var(--brown, #242c2c) 60%, transparent);
}

.footer-link {
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--brown, #242c2c);
}

/* ─── Social Icons ─── */
.footer-social-row {
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
}

.footer-social-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--brown, #242c2c) 18%, transparent);
  color: var(--brown, #242c2c);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-social-icon:hover {
  background: var(--brown, #242c2c);
  color: var(--paper, #f5f2eb);
  border-color: var(--brown, #242c2c);
  transform: translateY(-2px);
}

/* ─── Newsletter ─── */
.footer-newsletter-label {
  font-size: 0.775rem;
  font-weight: 500;
  color: color-mix(in srgb, var(--brown, #242c2c) 55%, transparent);
  margin-bottom: 10px;
}

.footer-newsletter-form {
  display: flex;
  gap: 0;
  max-width: 280px;
}

.footer-newsletter-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 0.825rem;
  font-family: inherit;
  color: var(--brown, #242c2c);
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid color-mix(in srgb, var(--brown, #242c2c) 14%, transparent);
  border-right: none;
  border-radius: 6px 0 0 6px;
  outline: none;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.footer-newsletter-input::placeholder {
  color: color-mix(in srgb, var(--brown, #242c2c) 38%, transparent);
}

.footer-newsletter-input:focus {
  border-color: var(--brass, #b88d4c);
  background: rgba(0, 0, 0, 0.06);
}

.footer-newsletter-btn {
  display: grid;
  place-items: center;
  padding: 0 14px;
  background: var(--brown, #242c2c);
  color: var(--paper, #f5f2eb);
  border: 1px solid var(--brown, #242c2c);
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.15s ease;
}

.footer-newsletter-btn:hover {
  background: color-mix(in srgb, var(--brown, #242c2c) 82%, transparent);
}

.footer-newsletter-btn:active {
  transform: scale(0.96);
}

/* ─── Bottom Bar ─── */
.footer-bottom-bar {
  border-top: 1px solid color-mix(in srgb, var(--brown, #242c2c) 10%, transparent);
}

.footer-bottom-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  text-align: center;
}

@media (min-width: 640px) {
  .footer-bottom-inner {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-copyright {
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--brown, #242c2c) 50%, transparent);
}

.footer-legal-links {
  display: flex;
  gap: 20px;
}

.footer-legal-links a {
  font-size: 0.7rem;
  color: color-mix(in srgb, var(--brown, #242c2c) 50%, transparent);
  transition: color 0.3s ease;
}

.footer-legal-links a:hover {
  color: var(--brown, #242c2c);
}
</style>