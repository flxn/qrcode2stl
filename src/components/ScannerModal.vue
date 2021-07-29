<template>
  <div :class="{'modal': true, 'is-active': true}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{$t('holdQRCodeInView')}}</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <qrcode-stream @decode="onDecode" @init="onInit">
            <div class="has-text-centered pt-3 pb-3" v-if="decodedData" style="background: rgba(0,0,0,0.6)">
                <p class="is-size-4 mb-3" style="color: #fff;">
                    {{$t('decodedQRCodeData')}}
                </p>
                <code class="mt-3 is-size-5">
                    {{decodedData}}
                </code>
            </div>
        </qrcode-stream>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close">Close</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
import { bus } from '../main';

export default {
  name: 'ScannerModal',
  components: {
    QrcodeStream,
  },
  data() {
    return {
      scanner: null,
      decodedData: '',
    };
  },
  methods: {
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        console.error(error);
      }
    },
    onDecode(result) {
      console.log('Decoded QR Code:', result);
      this.decodedData = result;
      setTimeout(() => {
        this.$emit('decode', result);
        this.close();
      }, 2000);
    },
    close() {
      bus.$emit('closeScannerModal');
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>
