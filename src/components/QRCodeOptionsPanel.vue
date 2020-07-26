<template>
  <nav class="panel">
    <p class="panel-heading">{{ $t("qrCodeOptionsTitle") }}</p>
    <!-- QR Code settings tabs -->
    <QRCodeOptionsTabs :active-tab-index="options.activeTabIndex" @tabChanged="setActiveTab" />

    <!-- Text -->
    <div class="option-pane" v-if="options.activeTabIndex === 0">
      <textarea
        class="textarea"
        :placeholder="$t('qrCodeTextPlaceholder')"
        v-model="options.text"
        style="width: 100%"
      ></textarea>
    </div>

    <!-- Wifi -->
    <div class="option-pane" v-if="options.activeTabIndex === 1">
      <WifiForm :wifi="options.wifi" />
    </div>

    <!-- E-Mail -->
    <div class="option-pane" v-if="options.activeTabIndex === 2">
      <EmailForm :email="options.email" />
    </div>

    <!-- Contact -->
    <div class="option-pane" v-if="options.activeTabIndex === 3">
      <ContactForm :contact="options.contact" />
    </div>

    <!-- SMS -->
    <div class="option-pane" v-if="options.activeTabIndex === 4">
      <SMSForm :sms="options.sms" />
    </div>

    <!-- Error Correction -->
    <div class="option-pane">
      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">{{$t('errorCorrection')}}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <div class="select is-small">
                <select v-model="options.errorCorrectionLevel">
                  <option value="L">L (Low, 7% redundant)</option>
                  <option value="M">M (Medium, 15% redundant)</option>
                  <option value="Q">Q (Quartile, 25% redundant)</option>
                  <option value="H">H (High, 30% redundant)</option>
                </select>
              </div>
              <p class="help">{{$t('errorCorrectionHelp')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
// QR Code settings tabs
import QRCodeOptionsTabs from './QRCodeOptionsTabs.vue';
// QR Code settings forms
import WifiForm from './forms/Wifi.vue';
import EmailForm from './forms/Email.vue';
import ContactForm from './forms/Contact.vue';
import SMSForm from './forms/SMS.vue';

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
    QRCodeOptionsTabs,
  },
  methods: {
    setActiveTab(idx) {
      this.options.activeTabIndex = idx;
    },
  },
};
</script>

<style>

#option-tabs {
  margin-bottom: 0;
}

.option-pane {
  padding: 10px;
}

</style>
