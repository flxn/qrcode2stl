<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span class="icon">
            <i class="fa fa-cog"></i>
          </span>
          <span>{{ $t('importExportSettings') }}</span>
        </p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Export Section -->
        <div class="box">
          <h3 class="title is-5">
            <span class="icon">
              <i class="fa fa-download"></i>
            </span>
            <span>{{ $t('exportSettings') }}</span>
          </h3>
          <p class="subtitle is-6">{{ $t('exportSettingsDescription') }}</p>
          <div class="field">
            <div class="control">
              <textarea
                class="textarea is-family-monospace"
                rows="8"
                readonly
                :value="exportJson"
              ></textarea>
            </div>
          </div>
          <div class="buttons">
            <button class="button is-info" @click="copyToClipboard">
              <span class="icon">
                <i class="fa fa-clipboard"></i>
              </span>
              <span>{{ $t('copyToClipboard') }}</span>
            </button>
            <button class="button is-primary" @click="downloadAsFile">
              <span class="icon">
                <i class="fa fa-file-download"></i>
              </span>
              <span>{{ $t('downloadAsFile') }}</span>
            </button>
          </div>
          <p v-if="copySuccess" class="help is-success">
            <span class="icon">
              <i class="fa fa-check"></i>
            </span>
            {{ $t('copiedToClipboard') }}
          </p>
        </div>

        <!-- Import Section -->
        <div class="box">
          <h3 class="title is-5">
            <span class="icon">
              <i class="fa fa-upload"></i>
            </span>
            <span>{{ $t('importSettings') }}</span>
          </h3>
          <p class="subtitle is-6">{{ $t('importSettingsDescription') }}</p>
          <div class="field">
            <div class="control">
              <textarea
                class="textarea is-family-monospace"
                rows="8"
                v-model="importJson"
                :placeholder="$t('pasteJsonHere')"
              ></textarea>
            </div>
          </div>
          <div class="buttons">
            <button class="button is-success" @click="applySettings" :disabled="!isValidJson">
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
              <span>{{ $t('applySettings') }}</span>
            </button>
            <div class="file is-info">
              <label class="file-label">
                <input class="file-input" type="file" accept=".json" @change="loadFromFile">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fa fa-file-upload"></i>
                  </span>
                  <span class="file-label">{{ $t('loadFromFile') }}</span>
                </span>
              </label>
            </div>
          </div>
          <p v-if="importError" class="help is-danger">
            <span class="icon">
              <i class="fa fa-exclamation-triangle"></i>
            </span>
            {{ $t('invalidJsonError') }}: {{ importError }}
          </p>
          <p v-if="importSuccess" class="help is-success">
            <span class="icon">
              <i class="fa fa-check"></i>
            </span>
            {{ $t('settingsApplied') }}
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close">{{ $t('close') }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { bus } from '../main';
import { saveAsString } from '../utils';

export default {
  name: 'SettingsModal',
  data() {
    return {
      exportJson: '',
      importJson: '',
      copySuccess: false,
      importError: null,
      importSuccess: false,
    };
  },
  computed: {
    isValidJson() {
      if (!this.importJson.trim()) return false;
      try {
        JSON.parse(this.importJson);
        return true;
      } catch (e) {
        return false;
      }
    },
  },
  methods: {
    close() {
      bus.$emit('closeSettingsModal');
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.exportJson).then(() => {
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      });
    },
    downloadAsFile() {
      const timestamp = new Date().getTime();
      const filename = `qrcode2stl-settings-${timestamp}.json`;
      saveAsString(this.exportJson, filename);
    },
    loadFromFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.importJson = e.target.result;
        this.importError = null;
      };
      reader.onerror = () => {
        this.importError = 'Failed to read file';
      };
      reader.readAsText(file);
    },
    applySettings() {
      this.importError = null;
      this.importSuccess = false;

      try {
        const settings = JSON.parse(this.importJson);
        bus.$emit('importSettings', settings);
        this.importSuccess = true;
        setTimeout(() => {
          this.importSuccess = false;
        }, 2000);
      } catch (e) {
        this.importError = e.message;
      }
    },
    onSettingsExported(settings) {
      if (settings) {
        this.exportJson = JSON.stringify(settings, null, 2);
      }
    },
  },
  created() {
    bus.$on('settingsExported', this.onSettingsExported);
    // Request the current settings when modal opens
    bus.$emit('requestExportSettings');
  },
  beforeDestroy() {
    bus.$off('settingsExported', this.onSettingsExported);
  },
};
</script>

<style scoped>
.modal-card {
  max-width: 700px;
  width: 90%;
}

.modal-card-body {
  max-height: 70vh;
  overflow-y: auto;
}

.box {
  margin-bottom: 1.5rem;
}

.box:last-child {
  margin-bottom: 0;
}

.textarea.is-family-monospace {
  font-family: monospace;
  font-size: 0.85rem;
}

.buttons {
  margin-top: 1rem;
}

.help {
  margin-top: 0.5rem;
}

.title .icon {
  margin-right: 0.5rem;
}
</style>
