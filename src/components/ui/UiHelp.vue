<template>
  <span class="help-tip" @mouseenter="show" @mouseleave="scheduleHide">
    <button
      ref="trigger"
      type="button"
      class="help-tip__button"
      :aria-label="ariaLabel"
      :aria-expanded="open ? 'true' : 'false'"
      @click.stop.prevent="toggle"
      @focus="show"
      @blur="scheduleHide"
      @keydown.esc="hide"
    >
      <UiIcon name="help" />
    </button>
    <transition name="popover">
      <span
        v-if="open"
        ref="bubble"
        class="help-tip__bubble"
        role="tooltip"
        :style="bubbleStyle"
        @mouseenter="cancelHide"
        @mouseleave="scheduleHide"
      ><slot>{{ cleanText }}</slot></span>
    </transition>
  </span>
</template>

<script>
import UiIcon from './UiIcon.vue';

export default {
  name: 'UiHelp',
  components: { UiIcon },
  props: {
    text: {
      type: String,
      default: '',
    },
    ariaLabel: {
      type: String,
      default: 'Help',
    },
  },
  data() {
    return {
      open: false,
      bubbleStyle: {},
    };
  },
  computed: {
    cleanText() {
      // translation strings are written as indented template literals
      return this.text.replace(/\\/g, '').replace(/\s+/g, ' ').trim();
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.hideTimer);
    window.removeEventListener('scroll', this.hide, true);
  },
  methods: {
    show() {
      this.cancelHide();
      if (this.open) {
        return;
      }
      this.open = true;
      window.addEventListener('scroll', this.hide, true);
      this.$nextTick(this.position);
    },
    hide() {
      this.open = false;
      window.removeEventListener('scroll', this.hide, true);
    },
    toggle() {
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    },
    scheduleHide() {
      this.cancelHide();
      this.hideTimer = window.setTimeout(this.hide, 140);
    },
    cancelHide() {
      window.clearTimeout(this.hideTimer);
    },
    position() {
      const trigger = this.$refs.trigger;
      const bubble = this.$refs.bubble;
      if (!trigger || !bubble) {
        return;
      }
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(300, window.innerWidth - 24);
      const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
      const height = bubble.offsetHeight;
      const below = rect.bottom + 8 + height < window.innerHeight - 8;
      this.bubbleStyle = {
        width: `${width}px`,
        left: `${left}px`,
        top: below ? `${rect.bottom + 8}px` : `${Math.max(8, rect.top - height - 8)}px`,
        '--popover-origin': below ? 'top center' : 'bottom center',
      };
    },
  },
};
</script>

<style>
.help-tip {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.help-tip__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text-3);
  transition: color var(--duration) ease, background-color var(--duration) ease;
}

.help-tip__button:hover,
.help-tip__button[aria-expanded="true"] {
  color: var(--accent-text);
  background: var(--accent-soft);
}

.help-tip__button .svg-icon {
  width: 16px;
  height: 16px;
}

.help-tip__bubble {
  position: fixed;
  z-index: 90;
  display: block;
  padding: 10px 12px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  color: var(--text-2);
  font-size: 12.5px;
  font-weight: 400;
  line-height: 1.5;
  white-space: normal;
  text-align: left;
  box-shadow: var(--shadow-lg);
  transform-origin: var(--popover-origin, top center);
}
</style>
