<template>
  <div
    v-show="state !== 'hidden'"
    class="ad-unit"
    :class="[`ad-unit--${state}`, { 'ad-unit--labeled': label }]"
    :style="reserveStyle"
  >
    <span v-if="label" class="ad-unit__label">{{ $t('advertisement') }}</span>
    <!-- rendered only when the ad is requested: adsbygoogle.push() fills the first unfilled <ins> -->
    <ins
      v-if="layout"
      ref="ins"
      class="adsbygoogle"
      :style="layout.style"
      :data-ad-client="client"
      :data-ad-slot="unit.slot"
      :data-ad-format="layout.format"
      :data-full-width-responsive="layout.format ? 'false' : null"
      :data-adtest="testMode ? 'on' : null"
    ></ins>
  </div>
</template>

<script>
import {
  AD_CLIENT, AD_UNITS, isAdTestMode, whenAdsReady, requestAd,
} from '../ads';

/**
 * One AdSense display unit.
 * - requests the ad only once the slot is visible and has a width (AdSense cannot fill hidden units)
 * - uses the fixed size when it fits, otherwise a responsive unit so ads are never cropped
 * - reserves the height while loading and collapses when the ad is unfilled or blocked
 * Emits `state` with 'loading' | 'filled' | 'unfilled' | 'blocked'.
 */
export default {
  name: 'AdSlot',
  props: {
    // key of AD_UNITS
    name: {
      type: String,
      required: true,
    },
    // show a small "Advertisement" label above the ad
    label: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      client: AD_CLIENT,
      testMode: isAdTestMode(),
      layout: null,
      state: 'loading',
    };
  },
  computed: {
    unit() {
      return AD_UNITS[this.name];
    },
    reserveStyle() {
      // keep the space while loading so the page does not jump when the ad arrives
      if (this.state !== 'loading' || !this.unit) return null;
      return { minHeight: `${this.unit.height}px` };
    },
  },
  async mounted() {
    if (!this.unit) {
      this.setState('hidden');
      return;
    }
    const status = await whenAdsReady();
    if (this.destroyed) return;
    if (status === 'blocked') {
      this.state = 'hidden';
      this.$emit('state', 'blocked');
      return;
    }
    this.waitForWidth();
  },
  beforeDestroy() {
    this.destroyed = true;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.statusObserver) this.statusObserver.disconnect();
  },
  methods: {
    setState(state) {
      this.state = state;
      this.$emit('state', state === 'hidden' ? 'unfilled' : state);
    },
    waitForWidth() {
      if (this.$el.clientWidth > 0) {
        this.load();
        return;
      }
      if (!window.ResizeObserver) return;
      this.resizeObserver = new ResizeObserver(() => {
        if (this.$el.clientWidth > 0) {
          this.resizeObserver.disconnect();
          this.load();
        }
      });
      this.resizeObserver.observe(this.$el);
    },
    load() {
      const available = this.$el.clientWidth;
      const { width, height } = this.unit;
      if (available >= width) {
        this.layout = { style: `display:inline-block;width:${width}px;height:${height}px` };
      } else {
        // not enough room for the fixed size: let AdSense pick a size that fits the container
        // (full-width stretching is off so banners stay banner-shaped on phones)
        this.layout = {
          style: 'display:block;width:100%',
          format: height <= 90 ? 'horizontal' : 'auto',
        };
      }
      this.$nextTick(() => {
        if (this.destroyed || !this.$refs.ins) return;
        this.watchStatus(this.$refs.ins);
        if (!requestAd()) {
          this.setState('hidden');
        }
      });
    },
    watchStatus(ins) {
      const update = () => {
        const status = ins.getAttribute('data-ad-status');
        if (status === 'filled') {
          this.setState('filled');
        } else if (status === 'unfilled') {
          this.setState('hidden');
        }
      };
      this.statusObserver = new MutationObserver(update);
      this.statusObserver.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
    },
  },
};
</script>

<style>
.ad-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.ad-unit__label {
  color: var(--text-3);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
