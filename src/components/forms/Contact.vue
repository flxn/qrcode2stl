<template>
  <div>
    <div class="field has-text-centered">{{$t('optionalFieldsHint')}}</div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.firstName / contact.lastName'">{{$t('yourName')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" :placeholder="$t('firstname')" v-model="contact.firstName" :title="'contact.firstName — ' + $t('firstname')" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" :placeholder="$t('lastname')" v-model="contact.lastName" :title="'contact.lastName — ' + $t('lastname')" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.organization — ' + $t('organization')">{{$t('organization')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="ACME Inc." v-model="contact.organization" :title="'contact.organization — ' + $t('organization')" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.role — ' + $t('role')">{{$t('role')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input"
              type="text"
              placeholder="Senior Money Maker"
              v-model="contact.role"
              :title="'contact.role — ' + $t('role')"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.cell / contact.phone / contact.fax'">{{$t('numbers')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" :placeholder="$t('cellphone')" v-model="contact.cell" :title="'contact.cell — ' + $t('cellphone')" />
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
            <input class="input" type="text" :placeholder="$t('phone')" v-model="contact.phone" :title="'contact.phone — ' + $t('phone')" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="Fax" v-model="contact.fax" title="contact.fax — Fax" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" title="contact.email — E-Mail">E-Mail:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="you@example.com" v-model="contact.email" title="contact.email — E-Mail" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.street — ' + $t('street')">{{$t('street')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My Street 31" v-model="contact.street" :title="'contact.street — ' + $t('street')" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.postcode / contact.city'">{{$t('city')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="12345" v-model="contact.postcode" title="contact.postcode — Postcode" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My Town" v-model="contact.city" :title="'contact.city — ' + $t('city')" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" :title="'contact.state / contact.country'">{{$t('state')}}:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My State" v-model="contact.state" :title="'contact.state — ' + $t('state')" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="My Country" v-model="contact.country" title="contact.country — Country" />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" title="contact.website — Website">Website:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" placeholder="www.mysite.com" v-model="contact.website" title="contact.website — Website" />
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
