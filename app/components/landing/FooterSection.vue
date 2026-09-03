<template>
  <footer class="hctpal-footer">

    <!-- GROUP 1: Standard Document Flow -->
    <!-- This wrapper uses a solid background to mask the sticky footer underneath -->
    <div class="footer-flow-content">
      <section id="visit" class="showroom-visit" data-reveal>
        <div class="showroom-visit__image">
          <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai34.jpeg"
            alt="HCTPAL manufacturing plant exterior" class="object-cover object-center" />
        </div>
        <div class="showroom-visit__copy">
          <p>Factory & Headquarters</p>
          <h2>Schedule a Technical Facility Tour</h2>
          <p>Explore our high-speed weaving looms, coating units, and automated packaging lines in person.</p>
          <a class="tiny-link" href="#contact">
            <span>Book Visit</span>
            <i>
              <svg width="12" height="12" viewBox="0 0 20 20">
                <path d="M3 10h13M11 5l5 5-5 5" />
              </svg>
            </i>
          </a>
        </div>
      </section>

      <section id="contact" class="consultation-cta" data-reveal>
        <p>Custom Orders & Bulk Supply</p>
        <h2>WORK WITH HCTPAL</h2>
        <a class="tiny-link" href="mailto:info@hameemchingtai.com" style="margin-top: clamp(26px, 3vw, 48px);">
          <span>Get in Touch</span>
          <i>
            <svg width="12" height="12" viewBox="0 0 20 20">
              <path d="M3 10h13M11 5l5 5-5 5" />
            </svg>
          </i>
        </a>
      </section>
    </div>

    <!-- GROUP 2: Sticky Reveal Footer -->
    <div class="image-footer h-screen">
      <div class="image-footer__backdrop">
        <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg"
          alt="Fabric weave dark background" />
      </div>

      <!-- FIX: Explicitly closed div prevents DOM hierarchy bugs -->
      <div class="image-footer__shade"></div>

      <div class="image-footer__top">
        <div>
          <span>Factory HQ</span>
          <p>Ghorashal, Narsingdi, Bangladesh</p>
        </div>
        <div>
          <span>Head Office</span>
          <p>Times Media Limited Building, 387, Dhaka 1208</p>
        </div>
        <div>
          <span>Contact</span>
          <p>+880 131 9320527</p>
          <a href="mailto:info@hameemchingtai.com">info@hameemchingtai.com</a>
        </div>
      </div>

      <div class="image-footer__mission">
        "For decades, mills waited on imports. We built the alternative in Bangladesh —
        pocketing, interlinings, labels, and the care that ships with them."
      </div>

      <div class="image-footer__trusted">
        <span>Trusted By</span>
        <div class="image-footer__trusted-brands text-white text-5xl font-bold">
          <span>H&M</span>
          <span>Zara</span>
          <span>Uniqlo</span>
          <span>C&A</span>
          <span>American Eagle</span>
        </div>
      </div>

      <div class="image-footer__word">HCTPAL</div>

      <div class="image-footer__bottom">
        <span>© {{ new Date().getFullYear() }} Ha-Meem Ching Tai Pocketing & Accessories Ltd.</span>
        <span>All rights reserved</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Core structural styles to enforce the separation */
.hctpal-footer {
  position: relative;
  display: flex;
  flex-direction: column;
}

.footer-flow-content {
  position: relative;
  z-index: 10;
  /* Crucial: Change this to match your site's exact background color */
  background-color: #ffffff;
}

/* Ensure the image doesn't overflow its grid/flex container */
.showroom-visit__image img {
  max-width: 100%;
  height: auto;
  display: block;
}

.image-footer {
  /* This ensures the footer stays beneath the flow content until scrolled */
  position: sticky;
  bottom: 0;
  z-index: 1;
}
</style>