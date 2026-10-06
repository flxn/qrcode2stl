<template>
  <UiSection :title="$t('base')" default-open>
    <UiField :label="$t('shape')" :title="'base.shape — ' + $t('shape')">
      <div class="choice-group" role="radiogroup" :aria-label="$t('shape')">
        <button
          type="button"
          class="choice"
          :class="{ 'is-active': options.base.shape === 'roundedRectangle' }"
          role="radio"
          :aria-checked="options.base.shape === 'roundedRectangle' ? 'true' : 'false'"
          :title="$t('roundedRectangle')"
          @click="options.base.shape = 'roundedRectangle'"
        >
          <span class="choice__glyph choice__glyph--rounded" aria-hidden="true"></span>
          <span>{{ $t('shapeRounded') }}</span>
        </button>
        <button
          type="button"
          class="choice"
          :class="{ 'is-active': options.base.shape === 'rectangle' }"
          role="radio"
          :aria-checked="options.base.shape === 'rectangle' ? 'true' : 'false'"
          :title="$t('rectangle')"
          @click="options.base.shape = 'rectangle'"
        >
          <span class="choice__glyph choice__glyph--rect" aria-hidden="true"></span>
          <span>{{ $t('shapeRectangular') }}</span>
        </button>
      </div>
    </UiField>

    <UiNumberField
      v-model="options.base.width"
      :label="$t('width')"
      :unit="unit"
      :min="1"
      :title="'base.width — ' + $t('width')"
    />
    <UiNumberField
      v-if="showHeight"
      v-model="options.base.height"
      :label="$t('height')"
      :unit="unit"
      :min="1"
      :help="heightHelp"
      :title="'base.height — ' + $t('height')"
    />
    <UiNumberField
      v-model="options.base.depth"
      :label="$t('depth')"
      :unit="unit"
      :min="0"
      :step="0.5"
      :title="'base.depth — ' + $t('depth')"
    />
    <UiCollapse :open="options.base.shape === 'roundedRectangle'">
      <UiNumberField
        v-model="options.base.cornerRadius"
        :label="$t('cornerRadius')"
        :unit="unit"
        :min="0"
        :title="'base.cornerRadius — ' + $t('cornerRadius')"
      />
    </UiCollapse>

    <UiField :label="$t('border')" :title="'base.hasBorder — ' + $t('border')" :help="$t('borderAroundBase')">
      <UiToggle v-model="options.base.hasBorder" :aria-label="$t('borderAroundBase')" :title="'base.hasBorder — ' + $t('border')" />
    </UiField>
    <UiCollapse :open="options.base.hasBorder">
      <div class="subgroup">
        <UiNumberField
          v-model="options.base.borderWidth"
          :label="$t('border') + ' ' + $t('width')"
          :unit="unit"
          :min="0"
          :step="0.5"
          :title="'base.borderWidth — ' + $t('border') + ' ' + $t('width')"
        />
        <UiNumberField
          v-model="options.base.borderDepth"
          :label="$t('border') + ' ' + $t('depth')"
          :unit="unit"
          :min="0"
          :step="0.5"
          :title="'base.borderDepth — ' + $t('border') + ' ' + $t('depth')"
        />
      </div>
    </UiCollapse>
  </UiSection>
</template>

<script>
import UiSection from '../ui/UiSection.vue';
import UiField from '../ui/UiField.vue';
import UiNumberField from '../ui/UiNumberField.vue';
import UiToggle from '../ui/UiToggle.vue';
import UiCollapse from '../ui/UiCollapse.vue';

export default {
  name: 'BaseOptions',
  components: {
    UiSection, UiField, UiNumberField, UiToggle, UiCollapse,
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
    showHeight: {
      type: Boolean,
      default: false,
    },
    heightHelp: {
      type: String,
      default: '',
    },
  },
};
</script>
