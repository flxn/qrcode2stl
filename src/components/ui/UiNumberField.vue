<template>
  <div :class="stack ? 'field-stack' : 'field-row'">
    <span class="field-label">
      <label
        :for="inputId"
        :class="{ 'is-scrubbable': canScrub, 'is-scrubbing': scrubbing }"
        :title="title"
        @pointerdown="onScrubStart"
        @click="onLabelClick"
      >{{ label }}</label>
      <UiHelp v-if="help" :text="help" />
    </span>
    <div class="field-row__control">
      <div class="input-group" :class="{ 'is-invalid': isInvalid, 'is-flash': flash }">
        <input
          :id="inputId"
          ref="input"
          class="input-group__input"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          spellcheck="false"
          :value="text"
          :placeholder="placeholder"
          :disabled="disabled"
          :title="title"
          :aria-label="label"
          @input="onInput"
          @focus="focused = true"
          @blur="onBlur"
          @keydown="onKeydown"
        />
        <span v-if="unit" class="input-group__unit" aria-hidden="true">{{ unit }}</span>
      </div>
      <slot />
    </div>
    <div v-if="hint" class="field-hint field-row__hint">{{ hint }}</div>
    <transition name="rise">
      <div v-if="warning" class="field-hint field-hint--warning" role="status">
        <UiIcon name="alert" />
        <span>{{ warning }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import UiHelp from './UiHelp.vue';
import UiIcon from './UiIcon.vue';

const PIXELS_PER_STEP = 4;

const decimalsOf = (step) => {
  const text = String(step);
  const index = text.indexOf('.');
  return index === -1 ? 0 : text.length - index - 1;
};

export default {
  name: 'UiNumberField',
  components: { UiHelp, UiIcon },
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: undefined,
    },
    help: {
      type: String,
      default: '',
    },
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    stack: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
    // shown below the field, e.g. when the generator had to adjust this value
    warning: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      text: this.format(this.value),
      focused: false,
      scrubbing: false,
      flash: false,
    };
  },
  computed: {
    inputId() {
      return `number-field-${this._uid}`;
    },
    canScrub() {
      return !this.disabled;
    },
    isInvalid() {
      return !this.focused && this.value === '';
    },
  },
  watch: {
    value(newValue) {
      if (this.parse(this.text) === newValue) {
        return;
      }
      this.text = this.format(newValue);
      if (!this.focused && !this.scrubbing) {
        this.triggerFlash();
      }
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.flashTimer);
    this.stopScrub();
  },
  methods: {
    format(value) {
      if (value === '' || value === null || value === undefined) {
        return '';
      }
      return String(value);
    },
    parse(text) {
      const normalized = String(text).trim().replace(',', '.');
      if (normalized === '' || normalized === '-' || normalized === '.') {
        return '';
      }
      const number = Number(normalized);
      return Number.isFinite(number) ? number : '';
    },
    round(value) {
      const decimals = Math.max(decimalsOf(this.step), 2);
      return Number(value.toFixed(decimals));
    },
    clamp(value) {
      let result = value;
      if (this.min !== null) {
        result = Math.max(this.min, result);
      }
      if (this.max !== null) {
        result = Math.min(this.max, result);
      }
      return result;
    },
    commit(value, emitChange) {
      this.text = this.format(value);
      if (value !== this.value) {
        this.$emit('input', value);
      }
      if (emitChange) {
        this.$emit('change', value);
      }
    },
    onInput(event) {
      this.text = event.target.value;
      const parsed = this.parse(this.text);
      if (parsed !== this.value) {
        this.$emit('input', parsed);
      }
    },
    /** Parses the typed text and keeps it within min / max. */
    settle() {
      const parsed = this.parse(this.text);
      const value = parsed === '' ? '' : this.clamp(parsed);
      if (value !== parsed && value !== '') {
        this.triggerFlash();
      }
      this.commit(value, true);
    },
    onBlur() {
      this.focused = false;
      this.settle();
    },
    onKeydown(event) {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        if (event.key === 'Enter') {
          this.settle();
        }
        return;
      }
      event.preventDefault();
      const current = this.parse(this.text);
      const base = current === '' ? 0 : current;
      let delta = this.step;
      if (event.shiftKey) {
        delta *= 10;
      } else if (event.altKey) {
        delta /= 10;
      }
      const next = this.clamp(this.round(base + (event.key === 'ArrowUp' ? delta : -delta)));
      this.commit(next, true);
    },
    onScrubStart(event) {
      if (!this.canScrub || event.button !== 0) {
        return;
      }
      const current = this.parse(this.text);
      this.scrubState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startValue: current === '' ? 0 : current,
        moved: false,
        changed: false,
        target: event.currentTarget,
      };
      window.addEventListener('pointermove', this.onScrubMove);
      window.addEventListener('pointerup', this.onScrubEnd);
      window.addEventListener('pointercancel', this.onScrubEnd);
    },
    onScrubMove(event) {
      const state = this.scrubState;
      if (!state || event.pointerId !== state.pointerId) {
        return;
      }
      const dx = event.clientX - state.startX;
      if (!state.moved && Math.abs(dx) < 3) {
        return;
      }
      if (!state.moved) {
        state.moved = true;
        this.scrubbing = true;
        document.documentElement.style.cursor = 'ew-resize';
        document.documentElement.style.userSelect = 'none';
      }
      let step = this.step;
      if (event.shiftKey) {
        step *= 10;
      } else if (event.altKey) {
        step /= 10;
      }
      const steps = Math.round(dx / PIXELS_PER_STEP);
      const next = this.clamp(this.round(state.startValue + steps * step));
      if (next !== this.parse(this.text)) {
        state.changed = true;
        this.commit(next, false);
      }
    },
    onScrubEnd() {
      const state = this.scrubState;
      this.stopScrub();
      if (state && state.changed) {
        this.$emit('change', this.parse(this.text));
      }
      this.justScrubbed = !!(state && state.moved);
    },
    stopScrub() {
      window.removeEventListener('pointermove', this.onScrubMove);
      window.removeEventListener('pointerup', this.onScrubEnd);
      window.removeEventListener('pointercancel', this.onScrubEnd);
      if (this.scrubbing) {
        document.documentElement.style.cursor = '';
        document.documentElement.style.userSelect = '';
      }
      this.scrubbing = false;
      this.scrubState = null;
    },
    onLabelClick(event) {
      if (this.justScrubbed) {
        event.preventDefault();
        this.justScrubbed = false;
      }
    },
    triggerFlash() {
      this.flash = false;
      window.clearTimeout(this.flashTimer);
      this.$nextTick(() => {
        this.flash = true;
        this.flashTimer = window.setTimeout(() => {
          this.flash = false;
        }, 600);
      });
    },
  },
};
</script>
