<template>
  <UiSection
    :title="$t('keychain')"
    toggleable
    :enabled="options.base.hasKeychainAttachment"
    :toggle-title="'base.hasKeychainAttachment — ' + $t('keychain') + ': ' + $t('keychainHelp')"
    @update:enabled="options.base.hasKeychainAttachment = $event"
  >
    <p class="field-hint">{{ $t('keychainHelp') }}</p>
    <UiField :label="$t('placement')" :title="'base.keychainPlacement — ' + $t('keychain') + ' ' + $t('placement')">
      <UiSegmented
        v-model="options.base.keychainPlacement"
        class="capitalize-items"
        block
        :options="placementOptions"
        :aria-label="$t('keychain') + ' ' + $t('placement')"
      />
    </UiField>
    <UiNumberField
      v-model="options.base.keychainHoleDiameter"
      :label="$t('keychainHoleDiameter')"
      :unit="unit"
      :min="0.5"
      :step="0.5"
      :title="'base.keychainHoleDiameter — ' + $t('keychainHoleDiameter')"
    />
    <template v-if="advanced">
      <UiNumberField
        v-model="options.base.keychainMaterialThickness"
        :label="$t('keychainMaterialThickness')"
        :unit="unit"
        :min="0.4"
        :step="0.1"
        :help="$t('keychainMaterialThicknessHelp')"
        :title="'base.keychainMaterialThickness — ' + $t('keychainMaterialThickness')"
      />
      <UiNumberField
        v-model="options.base.keychainOffset"
        :label="$t('keychainOffset')"
        :unit="unit"
        :min="0"
        :step="0.5"
        :help="$t('keychainOffsetHelp')"
        :title="'base.keychainOffset — ' + $t('keychainOffset')"
      />
    </template>
    <UiField :label="$t('mirrorHoles')" :title="'base.mirrorHoles — ' + $t('mirrorHoles')" :help="$t('mirrorHolesHelp')">
      <UiToggle v-model="options.base.mirrorHoles" :aria-label="$t('mirrorHoles')" :title="'base.mirrorHoles — ' + $t('mirrorHoles')" />
    </UiField>
  </UiSection>
</template>

<script>
import UiSection from '../ui/UiSection.vue';
import UiField from '../ui/UiField.vue';
import UiNumberField from '../ui/UiNumberField.vue';
import UiSegmented from '../ui/UiSegmented.vue';
import UiToggle from '../ui/UiToggle.vue';

export default {
  name: 'KeychainOptions',
  components: {
    UiSection, UiField, UiNumberField, UiSegmented, UiToggle,
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    unit: {
      type: String,
      default: 'mm',
    },
    advanced: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    placementOptions() {
      return [
        { value: 'top', label: this.$t('top') },
        { value: 'left', label: this.$t('left') },
        {
          value: 'topLeft',
          label: this.$t('corner'),
          title: `${this.$t('top')}-${this.$t('left')} ${this.$t('corner')}`,
        },
      ];
    },
  },
};
</script>
