<template>
  <UiModal :title="$t('holdQRCodeInView')" icon="camera" size="md" @close="close">
    <div class="scanner">
      <qrcode-stream @decode="onDecode" @init="onInit">
        <div v-if="!ready && !cameraError" class="scanner__overlay">
          <UiIcon name="loader" class="spin" />
        </div>
        <div v-if="cameraError" class="scanner__overlay scanner__overlay--error">
          <UiIcon name="alert" />
          <span>{{ cameraError }}</span>
        </div>
        <div v-else-if="ready && !decodedData" class="scanner__frame" aria-hidden="true">
          <span class="scanner__line"></span>
        </div>
        <transition name="rise">
          <div v-if="decodedData" class="scanner__result">
            <p class="scanner__result-title">
              <UiIcon name="circle-check" />
              {{ $t('decodedQRCodeData') }}
            </p>
            <code class="scanner__result-data">{{ decodedData }}</code>
          </div>
        </transition>
      </qrcode-stream>
    </div>
    <template #footer>
      <button type="button" class="btn" @click="close">{{ $t('close') }}</button>
    </template>
  </UiModal>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
import { bus } from '../main';
import UiModal from './ui/UiModal.vue';
import UiIcon from './ui/UiIcon.vue';

export default {
  name: 'ScannerModal',
  components: {
    QrcodeStream,
    UiModal,
    UiIcon,
  },
  data() {
    return {
      scanner: null,
      decodedData: '',
      ready: false,
      cameraError: '',
    };
  },
  beforeDestroy() {
    window.clearTimeout(this.closeTimer);
  },
  methods: {
    async onInit(promise) {
      try {
        await promise;
        this.ready = true;
      } catch (error) {
        console.error(error);
        this.cameraError = error && error.name === 'NotAllowedError'
          ? 'Camera access was denied.'
          : (error && error.message) || 'Camera not available.';
      }
    },
    onDecode(result) {
      console.log('Decoded QR Code:', result);
      this.decodedData = result;
      window.clearTimeout(this.closeTimer);
      this.closeTimer = window.setTimeout(() => {
        this.$emit('decode', result);
        this.close();
      }, 2000);
    },
    close() {
      bus.$emit('closeScannerModal');
    },
  },
};
</script>

<style>
.scanner {
  position: relative;
  min-height: 280px;
  border-radius: var(--radius-md);
  background: #0b0f12;
  overflow: hidden;
}

.scanner__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 280px;
  padding: 24px;
  color: #d8dee2;
  font-size: 14px;
  text-align: center;
}

.scanner__overlay .svg-icon {
  width: 28px;
  height: 28px;
}

.scanner__overlay--error {
  flex-direction: column;
  color: #ffb4b4;
}

.scanner__frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(58%, 260px);
  aspect-ratio: 1;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
  overflow: hidden;
}

.scanner__line {
  position: absolute;
  right: 8%;
  left: 8%;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
  animation: scanner-sweep 2.2s ease-in-out infinite alternate;
}

@keyframes scanner-sweep {
  from {
    top: 10%;
  }

  to {
    top: 88%;
  }
}

.scanner__result {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: rgba(10, 14, 17, 0.82);
  color: #fff;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.scanner__result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 6px;
  font-weight: 600;
}

.scanner__result-title .svg-icon {
  color: var(--accent);
}

.scanner__result-data {
  display: block;
  overflow-wrap: anywhere;
  color: #d9f7e9;
  font-family: var(--font-mono);
  font-size: 13px;
}
</style>
