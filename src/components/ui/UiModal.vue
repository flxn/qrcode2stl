<template>
  <div
    class="modal"
    :class="sizeClass"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
  >
    <div class="modal__backdrop" @click="onBackdrop"></div>
    <div ref="panel" class="modal__panel" tabindex="-1">
      <header class="modal__header">
        <span v-if="icon" class="modal__icon"><UiIcon :name="icon" /></span>
        <div class="modal__titles">
          <h2 :id="titleId" class="modal__title">
            <slot name="title">{{ title }}</slot>
          </h2>
          <p v-if="subtitle" class="modal__subtitle">{{ subtitle }}</p>
        </div>
        <slot name="header-extra" />
        <button
          v-if="!hideClose"
          type="button"
          class="btn btn--ghost btn--icon btn--sm"
          :aria-label="closeLabel"
          @click="$emit('close')"
        >
          <UiIcon name="x" />
        </button>
      </header>
      <div class="modal__body" :class="bodyClass">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="modal__footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script>
import UiIcon from './UiIcon.vue';

const openModals = [];

const onKeydown = (event) => {
  if (event.key === 'Escape' && openModals.length) {
    const top = openModals[openModals.length - 1];
    if (!event.defaultPrevented) {
      top.$emit('close');
    }
  }
};

export default {
  name: 'UiModal',
  components: { UiIcon },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'sm',
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
    bodyClass: {
      type: [String, Array, Object],
      default: '',
    },
  },
  computed: {
    sizeClass() {
      return this.size === 'sm' ? '' : `modal--${this.size}`;
    },
    titleId() {
      return `modal-title-${this._uid}`;
    },
    closeLabel() {
      return this.$t ? this.$t('close') : 'Close';
    },
  },
  mounted() {
    this.previousFocus = document.activeElement;
    if (!openModals.length) {
      document.addEventListener('keydown', onKeydown);
    }
    openModals.push(this);
    document.documentElement.classList.add('has-modal');
    this.$nextTick(() => {
      if (this.$refs.panel && !this.$refs.panel.contains(document.activeElement)) {
        this.$refs.panel.focus({ preventScroll: true });
      }
    });
  },
  beforeDestroy() {
    const index = openModals.indexOf(this);
    if (index !== -1) {
      openModals.splice(index, 1);
    }
    if (!openModals.length) {
      document.removeEventListener('keydown', onKeydown);
      document.documentElement.classList.remove('has-modal');
    }
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus({ preventScroll: true });
    }
  },
  methods: {
    onBackdrop() {
      if (this.closeOnBackdrop) {
        this.$emit('close');
      }
    },
  },
};
</script>

<style>
.modal__panel:focus {
  outline: none;
}
</style>
