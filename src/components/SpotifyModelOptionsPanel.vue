<template>
  <div class="model-options">
    <BaseOptions :options="options" :unit="unit" show-height :height-help="$t('spotifyCodeHeightInfo')" />

    <UiSection title="Spotify Code" default-open>
      <UiNumberField
        v-model="options.code.depth"
        :label="$t('depth')"
        :unit="unit"
        :min="0"
        :step="0.5"
        :title="'code.depth — ' + $t('depth')"
      />
      <UiNumberField
        v-model="options.code.margin"
        :label="$t('margin')"
        :unit="unit"
        :min="0"
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

export default {
  name: 'SpotifyModelOptionsPanel',
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
