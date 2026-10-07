<template>
  <div class="model-options">
    <BaseOptions :options="options" :unit="unit" show-height :height-help="$t('spotifyCodeHeightInfo')" :width-help="$t('widthHelpPlate')" />

    <UiSection title="Spotify Code" default-open>
      <UiNumberField
        v-model="options.code.depth"
        :label="$t('labelCodeDepth')"
        :unit="unit"
        :min="0.1"
        :step="0.5"
        :help="$t('labelCodeDepthHelp')"
        :title="'code.depth — ' + $t('labelCodeDepth')"
      />
      <UiNumberField
        v-model="options.code.margin"
        :label="$t('margin')"
        :unit="unit"
        :min="0"
        :step="0.5"
        :help="$t('spotifyMarginHelp')"
        :warning="modelWarning('marginLimited', 'quietZone')"
        :title="'code.margin — ' + $t('margin')"
      />
    </UiSection>

    <TitleOptions :options="options" :unit="unit" :placements="['top', 'bottom']" />
    <KeychainOptions :options="options" :unit="unit" :advanced="false" />
    <NfcOptions :options="options" :unit="unit" />
  </div>
</template>

<script>
import BaseOptions from './sections/BaseOptions.vue';
import TitleOptions from './sections/TitleOptions.vue';
import KeychainOptions from './sections/KeychainOptions.vue';
import NfcOptions from './sections/NfcOptions.vue';
import UiSection from './ui/UiSection.vue';
import UiNumberField from './ui/UiNumberField.vue';
import modelWarnings from './sections/modelWarnings';

export default {
  name: 'SpotifyModelOptionsPanel',
  mixins: [modelWarnings],
  components: {
    BaseOptions,
    TitleOptions,
    KeychainOptions,
    NfcOptions,
    UiSection,
    UiNumberField,
  },
  props: {
    options: Object,
    unit: String,
  },
};
</script>
