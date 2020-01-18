<template>
  <div>
    <div class="field has-text-centered">Not all fields have to be filled in.</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Phone</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="The phone number of the recipient"
              v-model="sms.recipient"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Message</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              placeholder="The sms content"
              v-model="sms.message"
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
  name: 'SMSForm',
  props: {
    sms: Object,
  },
};
</script>

<style>
</style>
