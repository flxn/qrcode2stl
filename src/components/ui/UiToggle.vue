<template>
  <label
    class="switch"
    :class="{ 'is-disabled': disabled, 'switch--sm': small }"
    :title="title"
    @click.stop
  >
    <input
      type="checkbox"
      class="switch__input"
      role="switch"
      :checked="!!value"
      :disabled="disabled"
      :aria-checked="value ? 'true' : 'false'"
      :aria-label="ariaLabel || label || title"
      @change="onChange"
    />
    <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
    <span v-if="label || $slots.default" class="switch__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<script>
export default {
  name: 'UiToggle',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: undefined,
    },
    ariaLabel: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.checked);
      this.$emit('change', event.target.checked);
    },
  },
};
</script>
