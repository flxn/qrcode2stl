<template>
  <div :class="{'modal': true, 'is-active': true}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Exporting STL</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
          <div class="columns">
            <div class="column" v-if="!adblockEnabled">
              <div v-html="exportAd"></div>
            </div>
            <div class="column content">
                <p class="is-size-4">
                  <progress class="progress is-small is-primary" max="100" v-if="seconds !== 0"></progress>
                  <progress class="progress is-small is-primary" max="100" v-if="seconds === 0" value="100"></progress>
                  <span v-if="seconds > 0">Your download will start in {{seconds}} seconds.</span>
                  <span v-if="seconds == 0">Your download will start now.</span>
                </p>
                <p v-if="!adblockEnabled">
                  <br/>Thank You for using qrcode2stl.
                </p>
                <p v-if="adblockEnabled">
                  Ads are annoying, I know.
                  <br/>But they help me to pay the bills so I can keep the site running and continue the development.
                  If you can't afford to donate, maybe consider disabling your AdBlocker for this site.
                  <br/>
                  <br/>
                  <a class="button" href="https://paypal.me/fstein42" target="_blank" v-if="!showingThankYou" @click="showThanks">
                    <span class="icon">
                      <i class="fab fa-paypal"></i>
                    </span>
                    <span>Support qrcode2stl</span>
                  </a>
                  <a class="button is-danger" href="https://paypal.me/fstein42" target="_blank" v-if="showingThankYou">
                    <span class="icon">
                      <i class="fa fa-heart"></i>
                    </span>
                    <span>Thank You!</span>
                  </a>
                  <br/>
                  <br/>
                  Thank You for your understanding and for using qrcode2stl.
                </p>
            </div>
          </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close">OK</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { bus } from '../main';

export default {
  name: 'ExportModal',
  components: {
  },
  data() {
    return {
      adblockEnabled: false,
      seconds: 5,
      exportAd: '',
      showingThankYou: false,
    };
  },
  mounted() {
    // eslint-disable-next-line camelcase
    if (typeof __google_ad_urls === 'undefined') {
      this.adblockEnabled = true;
    } else {
      this.exportAd = document.getElementById('adsenseloader-export').innerHTML;
    }
    setInterval(() => {
      if (this.seconds > 0) {
        this.seconds -= 1;
      }
    }, 1000);
  },
  methods: {
    close() {
      bus.$emit('closeExportModal');
    },
    showThanks() {
      this.showingThankYou = true;
    },
  },
};
</script>
