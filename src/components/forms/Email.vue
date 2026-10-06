<template>
  <div class="form-stack">
    <p class="field-hint">{{ $t('optionalFieldsHint') }}</p>
    <label class="field-stack" :title="'email.recipient — ' + $t('recipient')">
      <span class="field-label">{{ $t('recipient') }}</span>
      <input
        v-model="email.recipient"
        class="input"
        type="text"
        inputmode="email"
        autocomplete="off"
        :placeholder="$t('recipientPlaceholder')"
        :title="'email.recipient — ' + $t('recipient')"
      />
    </label>
    <label class="field-stack" :title="'email.subject — ' + $t('subject')">
      <span class="field-label">{{ $t('subject') }}</span>
      <input
        v-model="email.subject"
        class="input"
        type="text"
        :placeholder="$t('subjectPlaceholder')"
        :title="'email.subject — ' + $t('subject')"
      />
    </label>
    <label class="field-stack" :title="'email.body — ' + $t('body')">
      <span class="field-label">{{ $t('body') }}</span>
      <textarea
        v-model="email.body"
        v-autosize
        class="textarea form-textarea"
        rows="2"
        :placeholder="$t('bodyPlaceholder')"
        :title="'email.body — ' + $t('body')"
      ></textarea>
    </label>
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
