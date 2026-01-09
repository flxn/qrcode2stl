<template>
  <div>
    <div class="field has-text-centered">{{$t('optionalFieldsHint')}}</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'email.recipient — ' + $t('recipient')">{{$t('recipient')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('recipientPlaceholder')"
              v-model="email.recipient"
              :title="'email.recipient — ' + $t('recipient')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'email.subject — ' + $t('subject')">{{$t('subject')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              :placeholder="$t('subjectPlaceholder')"
              v-model="email.subject"
              :title="'email.subject — ' + $t('subject')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'email.body — ' + $t('body')">{{$t('body')}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              :placeholder="$t('bodyPlaceholder')"
              v-model="email.body"
              style="width: 100%"
              :title="'email.body — ' + $t('body')"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailForm',
  props: {
    email: Object,
  },
};
</script>

<style>
</style>
