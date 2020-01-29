<template>
  <div>
    <div class="field has-text-centered">{{$t('optionalFieldsHint')}}</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('yourName')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" :placeholder="$t('firstname')" v-model="contact.firstName" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" :placeholder="$t('lastname')" v-model="contact.lastName" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">{{$t('organization')}}:</label>
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
        <label class="label">{{$t('role')}}:</label>
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
        <label class="label">{{$t('numbers')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" :placeholder="$t('cellphone')" v-model="contact.cell" />
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
            <input class="input" type="text" :placeholder="$t('phone')" v-model="contact.phone" />
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
        <label class="label">{{$t('street')}}:</label>
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
        <label class="label">{{$t('city')}}:</label>
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
        <label class="label">{{$t('state')}}:</label>
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
