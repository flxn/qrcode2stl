<template>
  <UiModal
    :title="kind === 'png' ? $t('exportingPng') : $t('exportingStl')"
    :icon="kind === 'png' ? 'image' : 'download'"
    :size="showAd ? 'md' : 'sm'"
    @close="close"
  >
    <div class="export-modal" :class="{ 'has-ad': showAd }">
      <div v-if="showAd" class="export-modal__ad">
        <AdSlot name="export" label @state="adState = $event" />
      </div>
      <div class="export-modal__status">
        <div class="countdown" :class="{ 'is-done': seconds === 0 }" aria-hidden="true">
          <svg viewBox="0 0 120 120" class="countdown__ring">
            <circle class="countdown__track" cx="60" cy="60" r="52" />
            <circle class="countdown__progress" cx="60" cy="60" r="52" :style="progressStyle" />
          </svg>
          <span class="countdown__value">
            <transition name="icon-swap" mode="out-in">
              <UiIcon v-if="seconds === 0" key="done" name="check" />
              <span v-else :key="seconds">{{ seconds }}</span>
            </transition>
          </span>
        </div>
        <p class="export-modal__headline" role="status">
          <template v-if="seconds > 0">{{ $t('batchDownloadCountdown', { seconds }) }}</template>
          <template v-else>{{ $t('batchDownloadStarting') }}</template>
        </p>
        <p v-if="!adBlocked" class="export-modal__text">{{ $t('batchThankYou') }}</p>
        <template v-else>
          <p class="export-modal__text">{{ $t('batchAdblockMessage') }}</p>
          <a
            class="btn"
            :class="{ 'btn--danger': showingThankYou }"
            href="https://paypal.me/fstein42"
            target="_blank"
            rel="noopener"
            @click="showThanks"
          >
            <i v-if="!showingThankYou" class="fab fa-paypal" aria-hidden="true"></i>
            <UiIcon v-else name="heart" />
            <span>{{ showingThankYou ? 'Thank You!' : 'Support qrcode2stl' }}</span>
          </a>
        </template>
      </div>
    </div>
    <template #footer>
      <button type="button" class="btn btn--primary" @click="close">OK</button>
    </template>
  </UiModal>
</template>

<script>
import UiModal from './ui/UiModal.vue';
import UiIcon from './ui/UiIcon.vue';
import AdSlot from './AdSlot.vue';

const COUNTDOWN_SECONDS = 5;

export default {
  name: 'ExportModal',
  components: { UiModal, UiIcon, AdSlot },
  props: {
    kind: {
      type: String,
      default: 'stl',
    },
  },
  data() {
    return {
      // 'loading' | 'filled' | 'unfilled' | 'blocked', reported by the ad slot
      adState: 'loading',
      seconds: COUNTDOWN_SECONDS,
      showingThankYou: false,
      started: false,
    };
  },
  computed: {
    showAd() {
      return this.adState === 'loading' || this.adState === 'filled';
    },
    adBlocked() {
      return this.adState === 'blocked';
    },
    progressStyle() {
      const circumference = 2 * Math.PI * 52;
      return {
        strokeDasharray: `${circumference}`,
        strokeDashoffset: this.started ? '0' : `${circumference}`,
        transitionDuration: `${COUNTDOWN_SECONDS}s`,
      };
    },
  },
  mounted() {
    requestAnimationFrame(() => {
      this.started = true;
    });
    this.interval = window.setInterval(() => {
      if (this.seconds > 0) {
        this.seconds -= 1;
      }
      if (this.seconds === 0) {
        window.clearInterval(this.interval);
      }
    }, 1000);
  },
  beforeDestroy() {
    window.clearInterval(this.interval);
  },
  methods: {
    close() {
      this.$emit('close');
    },
    showThanks() {
      this.showingThankYou = true;
    },
  },
};
</script>

<style>
.export-modal {
  display: grid;
  gap: 20px;
}

.export-modal.has-ad {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
}

.export-modal__ad {
  display: flex;
  justify-content: center;
  min-width: 300px;
}

.export-modal__status {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 8px 0;
  text-align: center;
}

.export-modal__headline {
  margin: 0;
  color: var(--text);
  font-size: 17px;
  font-weight: 600;
}

.export-modal__text {
  margin: 0;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.55;
}

.countdown {
  position: relative;
  width: 104px;
  height: 104px;
}

.countdown__ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.countdown__track {
  fill: none;
  stroke: var(--surface-inset);
  stroke-width: 8;
}

.countdown__progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 8;
  stroke-linecap: round;
  transition-property: stroke-dashoffset;
  transition-timing-function: linear;
}

.countdown__value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  font-size: 34px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.countdown__value .svg-icon {
  width: 40px;
  height: 40px;
  color: var(--accent);
}

.countdown.is-done {
  animation: countdown-pop 420ms var(--ease-spring);
}

@keyframes countdown-pop {
  0% {
    transform: scale(1);
  }

  45% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(1);
  }
}

@media (max-width: 720px) {
  .export-modal.has-ad {
    grid-template-columns: 1fr;
  }
}
</style>
