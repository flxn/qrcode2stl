<template>
  <div class="form-stack">
    <label class="field-stack" title="wifi.ssid — SSID">
      <span class="field-label">SSID</span>
      <input
        v-model="wifi.ssid"
        class="input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        :placeholder="$t('ssidPlaceholder')"
        title="wifi.ssid — SSID"
      />
    </label>
    <UiCollapse :open="wifi.security !== 'nopass'">
      <label class="field-stack" :title="'wifi.password — ' + $t('password')">
        <span class="field-label">{{ $t('password') }}</span>
        <input
          v-model="wifi.password"
          class="input"
          type="text"
          autocomplete="off"
          spellcheck="false"
          :placeholder="$t('passwordPlaceholder')"
          :title="'wifi.password — ' + $t('password')"
        />
      </label>
    </UiCollapse>
    <div class="field-stack" :title="'wifi.security — ' + $t('security')">
      <span class="field-label">{{ $t('security') }}</span>
      <UiSegmented v-model="wifi.security" block :options="securityOptions" :aria-label="$t('security')" />
    </div>
    <div class="form-inline-row">
      <UiToggle
        v-model="wifi.hidden"
        :label="$t('hiddenText')"
        :title="'wifi.hidden — ' + $t('hidden')"
      />
    </div>
  </div>
</template>

<script>
import UiSegmented from '../ui/UiSegmented.vue';
import UiToggle from '../ui/UiToggle.vue';
import UiCollapse from '../ui/UiCollapse.vue';

export default {
  name: 'WifiForm',
  components: { UiSegmented, UiToggle, UiCollapse },
  props: {
    wifi: Object,
  },
  computed: {
    securityOptions() {
      return [
        { value: 'WPA', label: 'WPA' },
        { value: 'WEP', label: 'WEP' },
        { value: 'nopass', label: 'No password' },
      ];
    },
  },
};
</script>
