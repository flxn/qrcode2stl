<template>
  <div id="textMenu" class="mode-panel">
    <section class="content-card" :aria-label="$t('text')">
      <div class="content-card__head">
        <span class="content-card__title">
          <UiIcon name="letter-a" />
          {{ $t('text') }}
        </span>
        <UiSegmented
          v-model="options.base.textAlign"
          icons-only
          tip-pos="bottom"
          :options="alignOptions"
          :aria-label="$t('alignment')"
          title="base.textAlign"
        />
      </div>
      <textarea
        v-model="options.base.textMessage"
        v-autosize
        class="textarea content-textarea text-mode-textarea"
        rows="3"
        :placeholder="$t('theText')"
        :aria-label="$t('text')"
        :style="{ textAlign: options.base.textAlign }"
        title="base.textMessage"
      ></textarea>
      <p class="field-hint">
        {{ $t('fontInfoText') }}
        <code>{{ $t('italicInfoText') }}</code>
        <code>{{ $t('boldInfoText') }}</code>
      </p>
      <transition name="rise">
        <div v-if="generateError" class="notice notice--danger" role="alert">
          <UiIcon name="circle-x" />
          <span>{{ generateError }}</span>
        </div>
      </transition>
    </section>

    <UiTabs class="mode-tabs" :value="currentTab" :tabs="tabs" :aria-label="$t('settingsPanel')" @input="selectTab" />

    <div class="tab-panels">
      <div v-show="currentTab === 'content'" class="tab-panel" role="tabpanel">
        <UiSection :title="$t('text')" default-open>
          <UiNumberField
            v-model="options.base.textSize"
            :label="$t('text') + ' ' + $t('size')"
            :unit="unit"
            :min="1"
            title="base.textSize"
          />
          <UiNumberField
            v-model="options.base.textDepth"
            :label="$t('text') + ' ' + $t('depth')"
            :unit="unit"
            :min="0"
            :step="0.5"
            title="base.textDepth"
          />
        </UiSection>
      </div>

      <div v-show="currentTab === 'model'" class="tab-panel" role="tabpanel">
        <div class="model-options">
          <BaseOptions :options="options" :unit="unit" show-height />
          <KeychainOptions :options="options" :unit="unit" />
          <NfcOptions :options="options" :unit="unit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import merge from 'deepmerge';
import menuMixin, { hasValidNumbers } from './menuMixin';
import BaseOptions from './sections/BaseOptions.vue';
import KeychainOptions from './sections/KeychainOptions.vue';
import NfcOptions from './sections/NfcOptions.vue';
import UiIcon from './ui/UiIcon.vue';
import UiTabs from './ui/UiTabs.vue';
import UiSection from './ui/UiSection.vue';
import UiNumberField from './ui/UiNumberField.vue';
import UiSegmented from './ui/UiSegmented.vue';

const defaultOptions = {
  code: {
    invert: false,
    margin: 0,
  },
  base: {
    shape: 'roundedRectangle',
    width: 100,
    height: 100,
    depth: 3,
    cornerRadius: 5,
    hasBorder: true,
    borderWidth: 2,
    borderDepth: 1,
    hasText: true,
    textPlacement: 'center',
    textMargin: 4,
    textSize: 10,
    textMessage: '',
    textDepth: 1,
    textAlign: 'center',
    hasKeychainAttachment: false,
    keychainPlacement: 'left',
    keychainHoleDiameter: 6,
    keychainMaterialThickness: 1.5,
    keychainOffset: 3,
    mirrorHoles: false,
    hasNfcIndentation: false,
    nfcIndentationShape: 'square',
    nfcIndentationSize: 30,
    nfcIndentationDepth: 1,
    nfcIndentationHidden: false,
  },
};

export default {
  name: 'TextMenu',
  mixins: [menuMixin],
  components: {
    BaseOptions,
    KeychainOptions,
    NfcOptions,
    UiIcon,
    UiTabs,
    UiSection,
    UiNumberField,
    UiSegmented,
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
    };
  },
  computed: {
    tabs() {
      return [
        { id: 'content', label: this.$t('tabContent'), icon: 'scan-line' },
        { id: 'model', label: this.$t('tabModel'), icon: 'qr-code' },
      ];
    },
    exportParts() {
      return [
        ['base', 'base'],
        ['border', 'border'],
        ['subtitle', 'text'],
        ['keychainAttachment', 'attachment'],
      ];
    },
    alignOptions() {
      return [
        { value: 'left', icon: 'align-left', tip: this.$t('left') },
        { value: 'center', icon: 'align-center', tip: this.$t('alignCenter') },
        { value: 'right', icon: 'align-right', tip: this.$t('right') },
      ];
    },
  },
  methods: {
    getExportableOptions() {
      return JSON.parse(JSON.stringify(this.options));
    },
    importOptions(newOptions) {
      this.options = merge(this.options, newOptions);
    },
    isReadyForAutoUpdate() {
      return hasValidNumbers(this.options, defaultOptions) && this.options.base.textMessage.trim() !== '';
    },
    async generate3dModel() {
      const ticket = this.beginGeneration();
      await this.requestModel(ticket, {
        mode: 'Text',
        options: this.options,
      });
    },
  },
};
</script>

<style>
.text-mode-textarea.textarea {
  min-height: 92px;
}
</style>
