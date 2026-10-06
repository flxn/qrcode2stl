<template>
  <div :class="[stack ? 'field-stack' : 'field-row', { 'field-row--top': top && !stack }]">
    <span class="field-label">
      <label :for="forId" :title="title">{{ label }}</label>
      <UiHelp v-if="help" :text="help" />
    </span>
    <div class="field-row__control" :class="{ 'field-row__control--inline': inline }">
      <slot />
    </div>
    <div v-if="hint || $slots.hint" class="field-hint" :class="{ 'field-row__hint': !stack }">
      <slot name="hint">{{ hint }}</slot>
    </div>
  </div>
</template>

<script>
import UiHelp from './UiHelp.vue';

export default {
  name: 'UiField',
  components: { UiHelp },
  props: {
    label: {
      type: String,
      required: true,
    },
    forId: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
    help: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    stack: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
