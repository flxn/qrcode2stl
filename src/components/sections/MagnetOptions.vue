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
      :label="$t('labelPocketDepth')"
      :unit="unit"
      :min="0"
      :step="0.1"
      :warning="options.base.hasMagnetPockets ? modelWarning('magnetLimited') : ''"
      :title="'base.magnetPocketDepth — ' + $t('labelPocketDepth')"
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
import modelWarnings from './modelWarnings';

export default {
  name: 'MagnetOptions',
  mixins: [modelWarnings],
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
