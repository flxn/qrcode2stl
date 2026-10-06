<template>
  <section
    class="panel-section"
    :class="{
      'is-open': isOpen,
      'is-settled': settled,
      'is-disabled': toggleable && !enabled,
    }"
  >
    <div class="panel-section__header">
      <button
        type="button"
        class="panel-section__toggle"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="bodyId"
        :title="toggleable ? toggleTitle : undefined"
        @click="setOpen(!isOpen)"
      >
        <UiIcon name="chevron-right" class="panel-section__chevron" />
        <span class="panel-section__title">{{ title }}</span>
      </button>
      <div v-if="toggleable || $slots.aside || $scopedSlots.aside" class="panel-section__aside">
        <UiToggle
          v-if="toggleable"
          :value="enabled"
          :title="toggleTitle"
          :aria-label="title"
          @input="onToggle"
        />
        <slot name="aside" :open="isOpen" />
      </div>
    </div>
    <div :id="bodyId" class="panel-section__body" @transitionend.self="onTransitionEnd">
      <div class="panel-section__inner">
        <div class="panel-section__content">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UiIcon from './UiIcon.vue';
import UiToggle from './UiToggle.vue';

export default {
  name: 'UiSection',
  components: { UiIcon, UiToggle },
  props: {
    title: {
      type: String,
      required: true,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
    toggleable: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    toggleTitle: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isOpen: this.defaultOpen,
      settled: this.defaultOpen,
    };
  },
  computed: {
    bodyId() {
      return `section-body-${this._uid}`;
    },
  },
  methods: {
    setOpen(open) {
      if (open === this.isOpen) {
        return;
      }
      this.isOpen = open;
      this.settled = false;
      this.$emit('toggle-open', open);
    },
    onToggle(value) {
      this.$emit('update:enabled', value);
      this.setOpen(value);
    },
    onTransitionEnd(event) {
      if (event.propertyName === 'grid-template-rows' && this.isOpen) {
        this.settled = true;
      }
    },
  },
};
</script>
