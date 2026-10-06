<template>
  <section id="printguide" class="info-section print-guide">
    <header class="info-section__header">
      <span class="info-section__icon"><UiIcon name="book-open" /></span>
      <div>
        <h2 class="info-section__title">{{ $t('printGuideTitle') }}</h2>
        <p class="info-section__subtitle">{{ $t('printGuideSubtitle') }}</p>
      </div>
    </header>

    <div class="prose">
      <p v-html="$t('printGuideIntro')"></p>
    </div>
    <div class="notice notice--warning print-guide__warning">
      <UiIcon name="alert" />
      <div>
        <strong>{{ $t('printGuideSupportWarningTitle') }}</strong><br />
        <span v-html="$t('printGuideSupportWarningMessage')"></span>
      </div>
    </div>

    <!-- General -->
    <div class="guide-step">
      <h3 class="guide-step__title">{{ $t('printGuideGenerateQRCode') }}</h3>
      <div class="guide-grid guide-grid--wide">
        <figure class="guide-figure">
          <img src="../assets/printguide/generate_code.gif" alt="configure the qrcode exporter" loading="lazy" />
        </figure>
        <ol class="prose guide-list" v-html="$t('printGuideGenerateQRCodeSteps')"></ol>
      </div>
    </div>

    <!-- Cura Guide -->
    <div class="guide-step">
      <h3 class="guide-step__title">
        Cura
        <span class="badge badge--muted">{{ $t('printGuideVersionDisclaimer', { version: '4.4.1' }) }}</span>
      </h3>
      <div class="guide-grid">
        <div>
          <figure class="guide-figure">
            <img src="../assets/printguide/cura_layers.gif" alt="find the layer where the color change should happen" loading="lazy" />
          </figure>
          <p class="prose" v-html="$t('printGuideCuraStep1')"></p>
        </div>
        <div>
          <figure class="guide-figure">
            <img src="../assets/printguide/cura_add_postprocessing.gif" alt="set up the postprocessing script" loading="lazy" />
          </figure>
          <ol class="prose guide-list" v-html="$t('printGuideCuraStep2')"></ol>
        </div>
      </div>
      <p class="prose" v-html="$t('printGuideStep3')"></p>
    </div>

    <!-- PrusaSlicer Guide -->
    <div class="guide-step">
      <h3 class="guide-step__title">
        PrusaSlicer
        <span class="badge badge--muted">{{ $t('printGuideVersionDisclaimer', { version: '2.1.1' }) }}</span>
      </h3>
      <div class="guide-grid">
        <div>
          <figure class="guide-figure">
            <img src="../assets/printguide/prusa_layers.gif" alt="find the layer where the color change should happen" loading="lazy" />
          </figure>
          <p class="prose" v-html="$t('printGuidePrusaSlicerStep1')"></p>
        </div>
        <div>
          <figure class="guide-figure">
            <img src="../assets/printguide/prusa_add_filament_change.gif" alt="set up the filament change" loading="lazy" />
          </figure>
          <ol class="prose guide-list" v-html="$t('printGuidePrusaSlicerStep2')"></ol>
        </div>
      </div>
      <p class="prose" v-html="$t('printGuideStep3')"></p>
    </div>
  </section>
</template>

<script>
import { getRandomBanner } from '../utils';
import UiIcon from './ui/UiIcon.vue';

export default {
  name: 'PrintGuide',
  components: { UiIcon },
  data() {
    return {
      banner1: '',
      banner2: '',
      banner3: '',
    };
  },
  mounted() {
    this.banner1 = getRandomBanner('300x600');
    this.banner2 = getRandomBanner('300x600');
    this.banner3 = getRandomBanner('300x600');
  },
};
</script>

<style>
.print-guide .prose {
  max-width: 78ch;
}

.print-guide__warning {
  margin: 4px 0 8px;
}

.guide-step {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--divider);
}

.guide-step__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  color: var(--text);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.guide-step__title .badge {
  font-weight: 600;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 12px;
}

.guide-grid--wide {
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  align-items: start;
}

.guide-figure {
  margin: 0 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.guide-figure img {
  display: block;
  width: 100%;
  height: auto;
}

.guide-list {
  padding-left: 1.3em;
  list-style: decimal;
}

.guide-list li {
  margin: 0.4em 0;
}

@media (max-width: 760px) {
  .guide-grid,
  .guide-grid--wide {
    grid-template-columns: 1fr;
  }
}
</style>
