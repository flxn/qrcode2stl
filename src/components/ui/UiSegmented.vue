<template>
  <div
    class="segmented"
    :class="classes"
    role="radiogroup"
    :aria-label="ariaLabel"
    @keydown="onKeydown"
  >
    <span
      class="segmented__indicator"
      :class="{ 'no-anim': !animate }"
      :style="indicatorStyle"
      aria-hidden="true"
    ></span>
    <button
      v-for="option in options"
      :key="String(option.value)"
      ref="items"
      type="button"
      class="segmented__item"
      :class="{ 'is-active': option.value === value }"
      role="radio"
      :aria-checked="option.value === value ? 'true' : 'false'"
      :aria-label="iconsOnly ? (option.tip || option.label) : undefined"
      :tabindex="option.value === value ? 0 : -1"
      :disabled="option.disabled"
      :title="option.title"
      :data-tip="option.tip"
      :data-tip-pos="tipPos"
      @click="select(option)"
    >
      <UiIcon v-if="option.icon" :name="option.icon" />
      <i v-else-if="option.fa" :class="option.fa" aria-hidden="true"></i>
      <span v-if="!iconsOnly && option.label">{{ option.label }}</span>
    </button>
  </div>
</template>

<script>
import UiIcon from './UiIcon.vue';

export default {
  name: 'UiSegmented',
  components: { UiIcon },
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    variant: {
      type: String,
      default: 'track',
    },
    block: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
    },
    iconsOnly: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: undefined,
    },
    tipPos: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      indicatorX: 0,
      indicatorWidth: 0,
      animate: false,
    };
  },
  computed: {
    classes() {
      return {
        'segmented--accent': this.variant === 'accent',
        'segmented--block': this.block,
        'segmented--lg': this.size === 'lg',
        'segmented--icons': this.iconsOnly,
      };
    },
    indicatorStyle() {
      return {
        width: `${this.indicatorWidth}px`,
        transform: `translateX(${this.indicatorX}px)`,
        opacity: this.indicatorWidth ? 1 : 0,
      };
    },
    activeIndex() {
      return this.options.findIndex((option) => option.value === this.value);
    },
  },
  watch: {
    value() {
      this.$nextTick(this.measure);
    },
    options() {
      this.$nextTick(this.measure);
    },
  },
  mounted() {
    this.measure();
    // enable the sliding animation only after the first layout
    requestAnimationFrame(() => {
      this.animate = true;
    });
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.$el);
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    measure() {
      const items = this.$refs.items || [];
      const item = items[this.activeIndex];
      if (!item || !item.offsetWidth) {
        this.indicatorWidth = 0;
        return;
      }
      this.indicatorX = item.offsetLeft;
      this.indicatorWidth = item.offsetWidth;
    },
    select(option) {
      if (option.disabled || option.value === this.value) {
        return;
      }
      this.$emit('input', option.value);
      this.$emit('change', option.value);
    },
    onKeydown(event) {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      const delta = keys[event.key];
      if (!delta) {
        return;
      }
      event.preventDefault();
      const enabled = this.options.filter((option) => !option.disabled);
      const current = enabled.findIndex((option) => option.value === this.value);
      const next = enabled[(current + delta + enabled.length) % enabled.length];
      if (next) {
        this.select(next);
        this.$nextTick(() => {
          const index = this.options.indexOf(next);
          const el = (this.$refs.items || [])[index];
          if (el) {
            el.focus();
          }
        });
      }
    },
  },
};
</script>
