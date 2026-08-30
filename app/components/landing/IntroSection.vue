<!-- components/landing/IntroSection.vue -->
<script setup lang="ts">
defineProps<{
  servicePoints: string[]
}>()
</script>

<template>
  <section id="studio">
    <div class="editorial-intro" data-reveal>
      <div class="editorial-intro__collage">
        <div class="intro-image intro-image--main" data-parallax="0.04">
          <img src="https://api.hameemgroup.com:9012/Resources/HCTPALc/HameemChingTai40.jpeg"
            alt="Textile weaving loom at HCTPAL factory" />
        </div>
        <div class="intro-image intro-image--small" data-parallax="-0.03">
          <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai34.jpeg"
            alt="Garment trims and interlinings detail" />
        </div>
      </div>

      <div class="editorial-intro__copy">
        <h2>Built to Strengthen Bangladesh's Manufacturing Future</h2>
        <div>
          <p>
            Ha-Meem Ching Tai Pocketing & Accessories Ltd. (HCTPAL) supplies global garment brands with
            high-performance pocketing, interlinings, waistbands, and custom accessory trims —
            manufactured locally using advanced Chinese technology.
          </p>
          <a class="tiny-link" href="#why-matters">
            <span>Why It Matters</span>
            <i>
              <svg width="12" height="12" viewBox="0 0 20 20">
                <path d="M3 10h13M11 5l5 5-5 5" />
              </svg>
            </i>
          </a>
        </div>
      </div>
    </div>

    <div class="service-ticker" aria-hidden="true">
      <div>
        <span v-for="(point, i) in [...servicePoints, ...servicePoints]" :key="i">
          <i>/</i> {{ point }}
        </span>
      </div>
    </div>
  </section>
</template>