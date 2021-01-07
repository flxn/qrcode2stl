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
            <div class="column">
              <div v-html="exportAd"></div>
            </div>
            <div class="column content">
                <p class="subtitle">
                  <span v-if="seconds > 0">Your download will start in {{seconds}} seconds.</span>
                  <span v-if="seconds == 0">Your download will start now.</span>
                </p>
                <p>
                  Ads are annoying, I know.
                  <br/>But they help me to pay the bills so I can keep the site running and continue the development.
                  <br/>Thank You for your understanding and for using qrcode2stl.
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
// eslint-disable-next-line import/no-webpack-loader-syntax
import { bus } from '../main';

export default {
  name: 'ExportModal',
  components: {
  },
  data() {
    return {
      seconds: 5,
      exportAd: '',
    };
  },
  mounted() {
    this.exportAd = document.getElementById('adsenseloader-export').innerHTML;
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
  },
};
</script>
