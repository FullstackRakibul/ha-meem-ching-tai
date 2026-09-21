<!-- components/landing/FabricIndexDirectory.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";

// Define the weight categories based on the original catalog
const categories = [
  { id: "thin", label: "Thin Type", badge: "< 70G" },
  { id: "middle", label: "Middle Type", badge: "80G - 120G" },
  { id: "thick", label: "Thick Type", badge: "> 120G" },
];

const activeCategory = ref("middle");

// Transcribed sample data from the provided image catalog
const catalogData = [
  // Thin Type
  {
    serial: "1",
    type: "thin",
    weaving: "Plain",
    weight: "70",
    yarn: "60*60",
    density: "90*88",
    content: "100%C",
    width: '55/56"',
    art: "CP-PC186",
  },

  // Middle Type
  {
    serial: "2",
    type: "middle",
    weaving: "Plain",
    weight: "180",
    yarn: "45*45",
    density: "88*64",
    content: "T/C 80/20",
    width: '57/58"',
    art: "CP-PT152C",
  },
  {
    serial: "3",
    type: "middle",
    weaving: "Plain",
    weight: "90",
    yarn: "45*45",
    density: "96*72",
    content: "T/C 80/20",
    width: '57/58"',
    art: "CP-PT168C",
  },
  {
    serial: "5",
    type: "middle",
    weaving: "Plain",
    weight: "100",
    yarn: "45*45",
    density: "110*76",
    content: "T/C 90/10",
    width: '57/58"',
    art: "CP-PT186E",
  },
  {
    serial: "9",
    type: "middle",
    weaving: "Plain",
    weight: "110",
    yarn: "150D*30",
    density: "110*52",
    content: "T/C 80/20",
    width: '57/58"',
    art: "CP-PTL162C",
  },
  {
    serial: "17",
    type: "middle",
    weaving: "Herringbone",
    weight: "85",
    yarn: "100D*100D",
    density: "110*80",
    content: "100%P",
    width: '57/58"',
    art: "CP-HP190",
  },
  {
    serial: "20",
    type: "middle",
    weaving: "Big Herringbone",
    weight: "110",
    yarn: "45*45",
    density: "133*72",
    content: "T/C 65/35",
    width: '57/58"',
    art: "CP-HT205BN",
  },
  {
    serial: "23",
    type: "middle",
    weaving: "Twill",
    weight: "95",
    yarn: "75D*150D",
    density: "130*70",
    content: "100%P",
    width: '57/58"',
    art: "CP-TP200",
  },

  // Thick Type
  {
    serial: "26",
    type: "thick",
    weaving: "Plain",
    weight: "140",
    yarn: "20*20",
    density: "60*60",
    content: "100%C",
    width: '55/56"',
    art: "CP-PC120",
  },
  {
    serial: "29",
    type: "thick",
    weaving: "Better Twill",
    weight: "135",
    yarn: "23*23",
    density: "72*56",
    content: "T/C 65/35",
    width: '57/58"',
    art: "CP-TT511B",
  },
  {
    serial: "32",
    type: "thick",
    weaving: "Fine Twill",
    weight: "190",
    yarn: "21*21",
    density: "108*58",
    content: "T/C 65/35",
    width: '57/58"',
    art: "CP-TT166B",
  },
  {
    serial: "34",
    type: "thick",
    weaving: "Herringbone",
    weight: "130",
    yarn: "30*30",
    density: "100*70",
    content: "100%C",
    width: '55/56"',
    art: "CP-HC170",
  },
];

const displayedFabrics = computed(() => {
  return catalogData.filter((item) => item.type === activeCategory.value);
});
</script>

<template>
  <section class="fabric-index" data-reveal>
    <div class="fabric-index__container page-gutter">
      <!-- Section Header -->
      <div class="fabric-index__header">
        <div class="fabric-index__title-group">
          <p class="fabric-index__eyebrow">Technical Specifications</p>
          <h2 class="fabric-index__title">Fabric Index Directory</h2>
        </div>
        <p class="fabric-index__description">
          Engineered to precise tolerances. Explore our export-quality pocketing and
          lining configurations sorted by weight class.
        </p>
      </div>

      <!-- Interactive Category Toggles -->
      <div class="fabric-index__controls">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-btn"
          :class="{ 'is-active': activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="category-btn__label">{{ cat.label }}</span>
          <span class="category-btn__badge">{{ cat.badge }}</span>
        </button>
      </div>

      <!-- Data Table -->
      <div class="table-wrapper hide-native-cursor" data-cursor-text="DRAG">
        <table class="spec-table">
          <thead>
            <tr>
              <th>Art #</th>
              <th>Weaving</th>
              <th>Weight <span class="unit">(g/m²)</span></th>
              <th>Yarn Count</th>
              <th>Density</th>
              <th>Content</th>
              <th>Width</th>
            </tr>
          </thead>

          <TransitionGroup name="stagger" tag="tbody" class="spec-table__body">
            <tr
              v-for="(fabric, index) in displayedFabrics"
              :key="fabric.serial"
              class="spec-row"
              :style="{ '--delay': `${index * 0.05}s` }"
            >
              <td class="font-bold text-primary">{{ fabric.art }}</td>
              <td>{{ fabric.weaving }}</td>
              <td class="font-mono">{{ fabric.weight }}</td>
              <td class="font-mono text-gray-500">{{ fabric.yarn }}</td>
              <td class="font-mono text-gray-500">{{ fabric.density }}</td>
              <td>
                <span class="content-pill">{{ fabric.content }}</span>
              </td>
              <td class="font-mono">{{ fabric.width }}</td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fabric-index {
  padding-block: clamp(80px, 10vw, 150px);
  background-color: #f5f5f0;
  /* Light Beige background */
  color: #274257;
  /* Deep Navy */
}

.fabric-index__container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Styling */
.fabric-index__header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 48px;
}

@media (min-width: 768px) {
  .fabric-index__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.fabric-index__eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #e8b938;
  /* Mustard Gold */
  margin-bottom: 12px;
}

.fabric-index__title {
  font-family: var(--font-serif);
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.1;
  font-weight: 400;
}

.fabric-index__description {
  max-width: 400px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(39, 66, 87, 0.7);
}

/* Controls */
.fabric-index__controls {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.fabric-index__controls::-webkit-scrollbar {
  display: none;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 99px;
  border: 1px solid rgba(39, 66, 87, 0.15);
  background: transparent;
  color: #274257;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.category-btn:hover {
  border-color: #274257;
}

.category-btn.is-active {
  background: #274257;
  color: #ffffff;
  border-color: #274257;
}

.category-btn__label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-btn__badge {
  font-size: 10px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: monospace;
}

.category-btn:not(.is-active) .category-btn__badge {
  background: rgba(39, 66, 87, 0.08);
}

/* Table Design */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(39, 66, 87, 0.08);
  box-shadow: 0 20px 40px -12px rgba(39, 66, 87, 0.05);
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
}

.spec-table th {
  padding: 24px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(39, 66, 87, 0.5);
  border-bottom: 1px solid rgba(39, 66, 87, 0.1);
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.spec-table .unit {
  text-transform: none;
  font-size: 9px;
  letter-spacing: 0;
}

.spec-table td {
  padding: 20px 24px;
  font-size: 13px;
  border-bottom: 1px solid rgba(39, 66, 87, 0.05);
  transition: background-color 0.2s ease;
}

.spec-row:hover td {
  background-color: rgba(245, 245, 240, 0.5);
}

.spec-row:last-child td {
  border-bottom: none;
}

.content-pill {
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: #f5f5f0;
  border-radius: 4px;
  color: #274257;
}

/* Staggered Row Animation */
.stagger-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--delay);
}

.stagger-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.stagger-leave-to {
  opacity: 0;
}

.hide-native-cursor {
  cursor: none !important;
}
</style>
