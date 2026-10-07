<template>
  <UiSection
    ref="section"
    :title="$t('titleSection')"
    toggleable
    :enabled="options.base.hasText"
    :toggle-title="'base.hasText — ' + $t('text') + ': ' + $t('textOnEdge')"
    @update:enabled="options.base.hasText = $event"
  >
    <template #aside="{ open }">
      <transition name="fade">
        <input
          v-if="options.base.hasText && !open && isSingleLine"
          class="input title-inline-input"
          type="text"
          :value="options.base.textMessage"
          :placeholder="$t('titlePlaceholder')"
          :aria-label="$t('titleSection')"
          :title="'base.textMessage — ' + $t('text') + ' ' + $t('content')"
          @input="options.base.textMessage = $event.target.value"
        />
        <span v-else-if="options.base.hasText && !open" class="title-inline-preview" :title="options.base.textMessage">
          {{ firstLine }}
        </span>
      </transition>
    </template>

    <p class="field-hint">{{ $t('textOnEdge') }}</p>

    <UiField :label="$t('placement')" :title="'base.textPlacement — ' + $t('text') + ' ' + $t('placement')">
      <UiSegmented
        v-model="options.base.textPlacement"
        class="capitalize-items"
        block
        :options="placementOptions"
        :aria-label="$t('placement')"
      />
    </UiField>

    <div class="field-stack">
      <div class="title-content-head">
        <span class="field-label">
          <label :for="textareaId" :title="'base.textMessage — ' + $t('text') + ' ' + $t('content')">
            {{ $t('text') }} {{ $t('content') }}
          </label>
        </span>
        <UiSegmented
          v-model="options.base.textAlign"
          icons-only
          :options="alignOptions"
          :aria-label="$t('alignment')"
          :title="'base.textAlign'"
        />
      </div>
      <textarea
        :id="textareaId"
        v-model="options.base.textMessage"
        class="textarea"
        rows="3"
        :placeholder="$t('theText')"
        :title="'base.textMessage — ' + $t('text') + ' ' + $t('content')"
      ></textarea>
      <p class="field-hint">
        {{ $t('fontInfoText') }}
        <code>{{ $t('italicInfoText') }}</code>
        <code>{{ $t('boldInfoText') }}</code>
      </p>
      <transition name="rise">
        <p v-if="textWarning" class="field-hint field-hint--warning" role="status">
          <UiIcon name="alert" />
          <span>{{ textWarning }}</span>
        </p>
      </transition>
    </div>

    <UiNumberField
      v-model="options.base.textSize"
      :label="$t('text') + ' ' + $t('size')"
      :unit="unit"
      :min="1"
      :title="'base.textSize — ' + $t('text') + ' ' + $t('size')"
    />
    <UiNumberField
      v-model="options.base.textSpacing"
      :label="$t('textSpacing')"
      :unit="unit"
      :min="0"
      :step="0.5"
      :help="$t('textSpacingHelp')"
      :title="'base.textSpacing — ' + $t('textSpacing')"
    />
    <UiNumberField
      v-model="options.base.textMargin"
      :label="$t('textEdgeMargin')"
      :unit="unit"
      :min="0"
      :step="0.5"
      :help="$t('textEdgeMarginHelp')"
      :title="'base.textMargin — ' + $t('textEdgeMargin')"
    />
    <UiNumberField
      v-model="options.base.textDepth"
      :label="$t('labelTextDepth')"
      :unit="unit"
      :min="0.1"
      :step="0.5"
      :help="$t('labelTextDepthHelp')"
      :title="'base.textDepth — ' + $t('labelTextDepth')"
    />
  </UiSection>
</template>

<script>
import UiSection from '../ui/UiSection.vue';
import UiField from '../ui/UiField.vue';
import UiNumberField from '../ui/UiNumberField.vue';
import UiSegmented from '../ui/UiSegmented.vue';
import UiIcon from '../ui/UiIcon.vue';
import modelWarnings from './modelWarnings';

export default {
  name: 'TitleOptions',
  mixins: [modelWarnings],
  components: {
    UiSection, UiField, UiNumberField, UiSegmented, UiIcon,
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
    placements: {
      type: Array,
      default: () => ['top', 'bottom', 'left', 'right'],
    },
  },
  computed: {
    textWarning() {
      return this.options.base.hasText ? this.modelWarning('titleWrapped', 'textOverflow') : '';
    },
    textareaId() {
      return `title-text-${this._uid}`;
    },
    isSingleLine() {
      return !String(this.options.base.textMessage || '').includes('\n');
    },
    firstLine() {
      const [first] = String(this.options.base.textMessage || '').split('\n');
      return `${first}…`;
    },
    placementOptions() {
      return this.placements.map((placement) => ({ value: placement, label: this.$t(placement) }));
    },
    isVertical() {
      return this.options.base.textPlacement === 'left' || this.options.base.textPlacement === 'right';
    },
    alignOptions() {
      if (this.isVertical) {
        return [
          { value: 'left', icon: 'arrow-up', tip: this.$t('top') },
          { value: 'center', icon: 'equal', tip: this.$t('alignCenter') },
          { value: 'right', icon: 'arrow-down', tip: this.$t('bottom') },
        ];
      }
      return [
        { value: 'left', icon: 'align-left', tip: this.$t('left') },
        { value: 'center', icon: 'align-center', tip: this.$t('alignCenter') },
        { value: 'right', icon: 'align-right', tip: this.$t('right') },
      ];
    },
  },
};
</script>

<style>
.title-inline-input.input {
  width: 150px;
  height: 34px;
}

.title-inline-preview {
  overflow: hidden;
  max-width: 150px;
  padding: 0 10px;
  color: var(--text-2);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title-content-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.capitalize-items .segmented__item {
  text-transform: capitalize;
}
</style>
