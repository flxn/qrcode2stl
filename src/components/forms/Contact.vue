<template>
  <div>
    <div class="field has-text-centered">Not all fields have to be filled in.</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Your Name:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="Firstname" v-model="contact.firstName" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="Lastname" v-model="contact.lastName" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Organization:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="ACME Inc." v-model="contact.organization" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Role:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input"
              type="text"
              placeholder="Senior Money Maker"
              v-model="contact.role"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Numbers:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="Cell" v-model="contact.cell" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label for class="label"></label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="Phone" v-model="contact.phone" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="Fax" v-model="contact.fax" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">E-Mail:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="you@example.com" v-model="contact.email" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Street:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My Street 31" v-model="contact.street" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">City:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="12345" v-model="contact.postcode" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My Town" v-model="contact.city" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">State:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My State" v-model="contact.state" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My Country" v-model="contact.country" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Website:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="www.mysite.com" v-model="contact.website" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  props: {
    contact: Object,
  },
};
</script>

<style>
</style>
