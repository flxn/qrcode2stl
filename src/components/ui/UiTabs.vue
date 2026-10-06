<template>
  <div class="tabs" role="tablist" :aria-label="ariaLabel" @keydown="onKeydown">
    <button
      v-for="tab in tabs"
      :id="`tab-${tab.id}-${_uid}`"
      :key="tab.id"
      ref="tabs"
      type="button"
      class="tabs__tab"
      :class="{ 'is-active': tab.id === value }"
      role="tab"
      :aria-selected="tab.id === value ? 'true' : 'false'"
      :tabindex="tab.id === value ? 0 : -1"
      @click="select(tab.id)"
    >
      <UiIcon v-if="tab.icon" :name="tab.icon" />
      <span>{{ tab.label }}</span>
      <span v-if="tab.badge" class="badge">{{ tab.badge }}</span>
    </button>
    <span class="tabs__ink" :style="inkStyle" aria-hidden="true"></span>
  </div>
</template>

<script>
import UiIcon from './UiIcon.vue';

export default {
  name: 'UiTabs',
  components: { UiIcon },
  props: {
    value: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
    },
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      inkX: 0,
      inkWidth: 0,
    };
  },
  computed: {
    inkStyle() {
      return {
        width: `${this.inkWidth}px`,
        transform: `translateX(${this.inkX}px)`,
      };
    },
  },
  watch: {
    value() {
      this.$nextTick(this.measure);
    },
    tabs() {
      this.$nextTick(this.measure);
    },
  },
  mounted() {
    this.measure();
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
      const index = this.tabs.findIndex((tab) => tab.id === this.value);
      const el = (this.$refs.tabs || [])[index];
      if (!el) {
        this.inkWidth = 0;
        return;
      }
      // the ink is a little narrower than the tab, centered under it
      const inset = Math.max(12, el.offsetWidth * 0.12);
      this.inkX = el.offsetLeft + inset;
      this.inkWidth = Math.max(0, el.offsetWidth - inset * 2);
    },
    select(id) {
      if (id !== this.value) {
        this.$emit('input', id);
      }
    },
    onKeydown(event) {
      const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!delta) {
        return;
      }
      event.preventDefault();
      const index = this.tabs.findIndex((tab) => tab.id === this.value);
      const next = this.tabs[(index + delta + this.tabs.length) % this.tabs.length];
      this.select(next.id);
      this.$nextTick(() => {
        const el = (this.$refs.tabs || [])[this.tabs.indexOf(next)];
        if (el) {
          el.focus();
        }
      });
    },
  },
};
</script>
