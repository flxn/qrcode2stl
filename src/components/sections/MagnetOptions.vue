<template>
  <UiSection
    :title="$t('magnetPockets')"
    toggleable
    :enabled="options.base.hasMagnetPockets"
    :toggle-title="'base.hasMagnetPockets — ' + $t('magnetPockets') + ': ' + $t('magnetPocketsHelp')"
    @update:enabled="options.base.hasMagnetPockets = $event"
  >
    <p class="field-hint">{{ $t('magnetPocketsHelp') }}</p>
    <UiNumberField
      v-model="options.base.magnetPocketSize"
      :label="$t('holeSize')"
      :unit="unit"
      :min="0"
      :step="0.1"
      :title="'base.magnetPocketSize — ' + $t('holeSize')"
    />
    <UiNumberField
      v-model="options.base.magnetPocketDepth"
      :label="$t('depth')"
      :unit="unit"
      :min="0"
      :step="0.1"
      :title="'base.magnetPocketDepth — ' + $t('depth')"
    />
    <UiNumberField
      v-model="options.base.magnetPocketOffset"
      :label="$t('offsetFromOuterEdge')"
      :unit="unit"
      :min="0"
      :step="0.1"
      :title="'base.magnetPocketOffset — ' + $t('offsetFromOuterEdge')"
    />
  </UiSection>
</template>

<script>
import UiSection from '../ui/UiSection.vue';
import UiNumberField from '../ui/UiNumberField.vue';

export default {
  name: 'MagnetOptions',
  components: { UiSection, UiNumberField },
  props: {
    options: {
      type: Object,
      required: true,
    },
    unit: {
      type: String,
      default: 'mm',
    },
  },
};
</script>
