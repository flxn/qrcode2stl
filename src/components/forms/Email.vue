<template>
  <div>
    <div class="field has-text-centered">Not all fields have to be filled in.</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Recipient</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="The address that sould receive the mail"
              v-model="email.recipient"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Subject</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="The e-mail subject line"
              v-model="email.subject"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Body</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              placeholder="The e-mail content"
              v-model="email.body"
              style="width: 100%"
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
