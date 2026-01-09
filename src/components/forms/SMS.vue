<template>
  <div>
    <div class="field has-text-centered">{{$t('optionalFieldsHint')}}</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'sms.recipient — ' + $t('phone')">{{$t('phone')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('phonePlaceholder')"
              v-model="sms.recipient"
              :title="'sms.recipient — ' + $t('phone')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'sms.message — ' + $t('smsMessage')">{{$t('smsMessage')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              :placeholder="$t('smsMessagePlaceholder')"
              v-model="sms.message"
              style="width: 100%"
              :title="'sms.message — ' + $t('smsMessage')"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
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

<style>
</style>
