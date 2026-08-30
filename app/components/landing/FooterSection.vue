<!-- components/landing/FooterSection.vue -->
<template>
  <footer>
    <section id="visit" class="showroom-visit" data-reveal>
      <div class="showroom-visit__image">
        <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai20.jpeg"
          alt="HCTPAL manufacturing plant exterior" />
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

    <div class="image-footer">
      <div class="image-footer__backdrop">
        <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai03.jpeg"
          alt="Fabric weave dark background" />
      </div>
      <div class="image-footer__shade" />

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
        <div class="image-footer__trusted-brands">
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