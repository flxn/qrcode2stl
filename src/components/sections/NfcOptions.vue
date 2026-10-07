<template>
  <UiSection
    :title="$t('nfcSection')"
    toggleable
    :enabled="options.base.hasNfcIndentation"
    :toggle-title="'base.hasNfcIndentation — ' + $t('nfcIndentation') + ': ' + $t('nfcIndentationHelp')"
    @update:enabled="options.base.hasNfcIndentation = $event"
  >
    <p class="field-hint">{{ $t('nfcIndentationHelp') }}</p>
    <UiField :label="$t('indentation') + ' ' + $t('shape')" :title="'base.nfcIndentationShape — ' + $t('indentation') + ' ' + $t('shape')">
      <div class="choice-group" role="radiogroup" :aria-label="$t('indentation') + ' ' + $t('shape')">
        <button
          type="button"
          class="choice"
          :class="{ 'is-active': options.base.nfcIndentationShape === 'square' }"
          role="radio"
          :aria-checked="options.base.nfcIndentationShape === 'square' ? 'true' : 'false'"
          @click="options.base.nfcIndentationShape = 'square'"
        >
          <span class="choice__glyph choice__glyph--rect" aria-hidden="true"></span>
          <span class="capitalize">{{ $t('square') }}</span>
        </button>
        <button
          type="button"
          class="choice"
          :class="{ 'is-active': options.base.nfcIndentationShape === 'round' }"
          role="radio"
          :aria-checked="options.base.nfcIndentationShape === 'round' ? 'true' : 'false'"
          @click="options.base.nfcIndentationShape = 'round'"
        >
          <span class="choice__glyph choice__glyph--circle" aria-hidden="true"></span>
          <span class="capitalize">{{ $t('round') }}</span>
        </button>
      </div>
    </UiField>
    <UiNumberField
      v-model="options.base.nfcIndentationSize"
      :label="$t('indentation') + ' ' + $t('size')"
      :unit="unit"
      :min="0"
      :title="'base.nfcIndentationSize — ' + $t('indentation') + ' ' + $t('size')"
    />
    <UiNumberField
      v-model="options.base.nfcIndentationDepth"
      :label="$t('indentation') + ' ' + $t('depth')"
      :unit="unit"
      :min="0"
      :step="0.1"
      :warning="options.base.hasNfcIndentation ? modelWarning('nfcLimited') : ''"
      :title="'base.nfcIndentationDepth — ' + $t('indentation') + ' ' + $t('depth')"
    />
    <UiField :label="$t('hidden')" :title="'base.nfcIndentationHidden — ' + $t('hidden')" :help="$t('nfcIndentationHiddenHelp')">
      <UiToggle v-model="options.base.nfcIndentationHidden" :aria-label="$t('hidden')" :title="'base.nfcIndentationHidden — ' + $t('hidden')" />
    </UiField>
  </UiSection>
</template>

<script>
import UiSection from '../ui/UiSection.vue';
import UiField from '../ui/UiField.vue';
import UiNumberField from '../ui/UiNumberField.vue';
import UiToggle from '../ui/UiToggle.vue';
import modelWarnings from './modelWarnings';

export default {
  name: 'NfcOptions',
  mixins: [modelWarnings],
  components: {
    UiSection, UiField, UiNumberField, UiToggle,
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
  },
};
</script>
