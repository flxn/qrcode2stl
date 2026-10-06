<template>
  <div class="form-stack">
    <p class="field-hint">{{ $t('optionalFieldsHint') }}</p>
    <label class="field-stack" :title="'sms.recipient — ' + $t('phone')">
      <span class="field-label">{{ $t('phone') }}</span>
      <input
        v-model="sms.recipient"
        class="input"
        type="text"
        inputmode="tel"
        autocomplete="off"
        :placeholder="$t('phonePlaceholder')"
        :title="'sms.recipient — ' + $t('phone')"
      />
    </label>
    <label class="field-stack" :title="'sms.message — ' + $t('smsMessage')">
      <span class="field-label">{{ $t('smsMessage') }}</span>
      <textarea
        v-model="sms.message"
        v-autosize
        class="textarea form-textarea"
        rows="2"
        :placeholder="$t('smsMessagePlaceholder')"
        :title="'sms.message — ' + $t('smsMessage')"
      ></textarea>
    </label>
  </div>
</template>

<script>
export default {
  name: 'SMSForm',
  props: {
    sms: Object,
  },
};
</script>
