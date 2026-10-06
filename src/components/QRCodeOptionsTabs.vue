<template>
  <UiSegmented
    id="option-tabs"
    class="content-type-picker"
    :value="activeTabIndex"
    :options="types"
    icons-only
    tip-pos="bottom"
    :aria-label="$t('contentType')"
    @input="$emit('tabChanged', $event)"
  />
</template>

<script>
import UiSegmented from './ui/UiSegmented.vue';

export default {
  name: 'QRCodeOptionsTabs',
  components: { UiSegmented },
  props: {
    activeTabIndex: Number,
  },
  computed: {
    types() {
      return [
        { value: 0, icon: 'letter-a', tip: 'Text/URL' },
        { value: 1, icon: 'wifi', tip: 'Wifi' },
        { value: 2, icon: 'mail', tip: 'E-Mail' },
        { value: 3, icon: 'contact', tip: `${this.$t('contact')} (vCard)` },
        { value: 4, icon: 'message', tip: 'SMS' },
        { value: 5, icon: 'calendar', tip: this.$t('calendar') },
      ];
    },
  },
};
</script>

<style>
.content-type-picker.segmented {
  padding: 2px;
}

.content-type-picker .segmented__item {
  width: 32px;
  height: 30px;
}
</style>
