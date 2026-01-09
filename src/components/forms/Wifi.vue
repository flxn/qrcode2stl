<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'wifi.ssid — SSID'">SSID</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('ssidPlaceholder')"
              v-model="wifi.ssid"
              title="wifi.ssid — SSID"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal" v-if="wifi.security !== 'nopass'">
      <div class="field-label is-normal">
        <label class="label" :title="'wifi.password — ' + $t('password')">{{$t('password')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('passwordPlaceholder')"
              v-model="wifi.password"
              :title="'wifi.password — ' + $t('password')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'wifi.security — ' + $t('security')">{{$t('security')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <div class="select">
              <select v-model="wifi.security" :title="'wifi.security — ' + $t('security')">
                <option value="WPA">WPA</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No password</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'wifi.hidden — ' + $t('hidden')">{{$t('hidden')}}?</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="wifi.hidden" :title="'wifi.hidden — ' + $t('hidden')" />
              {{$t('hiddenText')}}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WifiForm',
  props: {
    wifi: Object,
  },
};
</script>

<style>
</style>
