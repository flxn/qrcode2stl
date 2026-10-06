<template>
  <div class="form-stack">
    <p class="field-hint">{{ $t('optionalFieldsHint') }}</p>

    <div class="field-stack">
      <span class="field-label" title="contact.firstName / contact.lastName">{{ $t('yourName') }}</span>
      <div class="field-grid">
        <input v-model="contact.firstName" class="input" type="text" autocomplete="given-name" :placeholder="$t('firstname')" :aria-label="$t('firstname')" :title="'contact.firstName — ' + $t('firstname')" />
        <input v-model="contact.lastName" class="input" type="text" autocomplete="family-name" :placeholder="$t('lastname')" :aria-label="$t('lastname')" :title="'contact.lastName — ' + $t('lastname')" />
      </div>
    </div>

    <div class="field-grid">
      <label class="field-stack">
        <span class="field-label" :title="'contact.organization — ' + $t('organization')">{{ $t('organization') }}</span>
        <input v-model="contact.organization" class="input" type="text" autocomplete="organization" placeholder="ACME Inc." :title="'contact.organization — ' + $t('organization')" />
      </label>
      <label class="field-stack">
        <span class="field-label" :title="'contact.role — ' + $t('role')">{{ $t('role') }}</span>
        <input v-model="contact.role" class="input" type="text" autocomplete="organization-title" placeholder="Senior Money Maker" :title="'contact.role — ' + $t('role')" />
      </label>
    </div>

    <div class="field-stack">
      <span class="field-label" title="contact.cell / contact.phone / contact.fax">{{ $t('numbers') }}</span>
      <input v-model="contact.cell" class="input" type="text" inputmode="tel" autocomplete="tel" :placeholder="$t('cellphone')" :aria-label="$t('cellphone')" :title="'contact.cell — ' + $t('cellphone')" />
      <div class="field-grid">
        <input v-model="contact.phone" class="input" type="text" inputmode="tel" :placeholder="$t('phone')" :aria-label="$t('phone')" :title="'contact.phone — ' + $t('phone')" />
        <input v-model="contact.fax" class="input" type="text" inputmode="tel" placeholder="Fax" aria-label="Fax" title="contact.fax — Fax" />
      </div>
    </div>

    <label class="field-stack">
      <span class="field-label" title="contact.email — E-Mail">E-Mail</span>
      <input v-model="contact.email" class="input" type="text" inputmode="email" autocomplete="email" placeholder="you@example.com" title="contact.email — E-Mail" />
    </label>

    <div class="field-stack">
      <span class="field-label" :title="'contact.street — ' + $t('street')">{{ $t('street') }}</span>
      <input v-model="contact.street" class="input" type="text" autocomplete="street-address" placeholder="My Street 31" :aria-label="$t('street')" :title="'contact.street — ' + $t('street')" />
      <div class="field-grid field-grid--postcode">
        <input v-model="contact.postcode" class="input" type="text" autocomplete="postal-code" placeholder="12345" aria-label="Postcode" title="contact.postcode — Postcode" />
        <input v-model="contact.city" class="input" type="text" autocomplete="address-level2" placeholder="My Town" :aria-label="$t('city')" :title="'contact.city — ' + $t('city')" />
      </div>
      <div class="field-grid">
        <input v-model="contact.state" class="input" type="text" autocomplete="address-level1" placeholder="My State" :aria-label="$t('state')" :title="'contact.state — ' + $t('state')" />
        <input v-model="contact.country" class="input" type="text" autocomplete="country-name" placeholder="My Country" aria-label="Country" title="contact.country — Country" />
      </div>
    </div>

    <label class="field-stack">
      <span class="field-label" title="contact.website — Website">Website</span>
      <input v-model="contact.website" class="input" type="text" inputmode="url" autocomplete="url" placeholder="www.mysite.com" title="contact.website — Website" />
    </label>
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
