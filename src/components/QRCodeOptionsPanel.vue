<template>
  <div class="content-form">
    <transition name="content-swap">
      <!-- Text -->
      <div v-if="options.activeTabIndex === 0" key="text" class="option-pane">
        <textarea
          v-model="options.text"
          v-autosize
          class="textarea content-textarea"
          rows="1"
          :placeholder="$t('qrCodeTextPlaceholder')"
          :aria-label="$t('contentLabel')"
          :title="'text — ' + $t('text')"
          spellcheck="false"
        ></textarea>
      </div>

      <!-- Wifi -->
      <div v-else-if="options.activeTabIndex === 1" key="wifi" class="option-pane">
        <WifiForm :wifi="options.wifi" />
      </div>

      <!-- E-Mail -->
      <div v-else-if="options.activeTabIndex === 2" key="email" class="option-pane">
        <EmailForm :email="options.email" />
      </div>

      <!-- Contact -->
      <div v-else-if="options.activeTabIndex === 3" key="contact" class="option-pane">
        <ContactForm :contact="options.contact" />
      </div>

      <!-- SMS -->
      <div v-else-if="options.activeTabIndex === 4" key="sms" class="option-pane">
        <SMSForm :sms="options.sms" />
      </div>

      <!-- Calendar -->
      <div v-else-if="options.activeTabIndex === 5" key="calendar" class="option-pane">
        <CalendarForm :calendar="options.calendar" />
      </div>
    </transition>
  </div>
</template>

<script>
// QR Code settings forms
import WifiForm from './forms/Wifi.vue';
import EmailForm from './forms/Email.vue';
import ContactForm from './forms/Contact.vue';
import SMSForm from './forms/SMS.vue';
import CalendarForm from './forms/Calendar.vue';

export default {
  name: 'QRCodeOptionsPanel',
  props: {
    options: Object,
  },
  components: {
    WifiForm,
    EmailForm,
    ContactForm,
    SMSForm,
    CalendarForm,
  },
};
</script>

<style>
.content-form {
  min-width: 0;
}

.option-pane {
  display: grid;
  gap: 10px;
}

.content-textarea.textarea {
  min-height: 48px;
  max-height: 168px;
  padding: 13px 14px;
  font-size: 15px;
  resize: none;
  overflow-y: auto;
}

.content-swap-enter-active {
  transition: opacity 180ms ease, transform 240ms var(--ease-out);
}

/* swap instantly; only the incoming form animates */
.content-swap-leave-active {
  display: none;
}

.content-swap-enter {
  opacity: 0;
  transform: translateY(4px);
}
</style>
