<template>
  <div>
    <UiSection :title="$t('codeStyle')" default-open>
      <UiNumberField
        v-if="showBlockSize"
        v-model="options.code.blockSizeMultiplier"
        :label="$t('block') + ' ' + $t('size')"
        unit="%"
        :min="1"
        :step="5"
        :help="$t('blockSizeHelp')"
        :title="'code.blockSizeMultiplier — ' + $t('block') + ' ' + $t('size')"
      />
      <UiField :label="$t('invert')" :title="'code.invert — ' + $t('invert')" :help="$t('invertText')">
        <UiToggle v-model="options.code.invert" :aria-label="$t('invert')" :title="'code.invert — ' + $t('invert')" />
      </UiField>
      <UiCollapse :open="!options.code.invert">
        <UiField :label="$t('cityMode')" :title="'code.cityMode — ' + $t('cityMode')" :help="$t('cityModeText')">
          <UiToggle v-model="options.code.cityMode" :aria-label="$t('cityMode')" :title="'code.cityMode — ' + $t('cityMode')" />
        </UiField>
      </UiCollapse>
      <UiCollapse :open="options.code.cityMode && !options.code.invert">
        <div class="subgroup">
          <UiNumberField
            v-model="options.code.depth"
            :label="$t('labelCodeDepthMin')"
            :unit="unit"
            :min="0.1"
            :step="0.5"
            :title="'code.depth — ' + $t('labelCodeDepthMin')"
          />
          <UiNumberField
            v-model="options.code.depthMax"
            :label="$t('labelCodeDepthMax')"
            :unit="unit"
            :min="0.1"
            :step="0.5"
            :title="'code.depthMax — ' + $t('labelCodeDepthMax')"
          />
        </div>
      </UiCollapse>
    </UiSection>

    <UiSection v-if="showCompatibility" :title="$t('compatibilityMode')" default-open>
      <div class="compat-row">
        <UiToggle
          v-model="options.code.compatibilityMode"
          :label="$t('compatibilityModeLabel')"
          :title="'code.compatibilityMode — ' + $t('compatibilityMode')"
        />
        <UiHelp :text="$t('compatibilityModeHelp')" />
      </div>
    </UiSection>
  </div>
</template>

<script>
import UiSection from '../ui/UiSection.vue';
import UiField from '../ui/UiField.vue';
import UiNumberField from '../ui/UiNumberField.vue';
import UiToggle from '../ui/UiToggle.vue';
import UiCollapse from '../ui/UiCollapse.vue';
import UiHelp from '../ui/UiHelp.vue';

export default {
  name: 'CodeStyleOptions',
  components: {
    UiSection, UiField, UiNumberField, UiToggle, UiCollapse, UiHelp,
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
    showBlockSize: {
      type: Boolean,
      default: false,
    },
    showCompatibility: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.compat-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.compat-row .switch {
  align-items: flex-start;
}

.compat-row .switch__label {
  color: var(--text-2);
  line-height: 1.4;
}
</style>
