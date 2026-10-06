<template>
  <UiModal :title="$t('importExportSettings')" icon="settings" size="lg" @close="close">
    <div class="settings-grid">
      <!-- Export Section -->
      <section class="card">
        <header class="card__header">
          <span class="settings-card__icon"><UiIcon name="file-down" /></span>
          <div>
            <h3 class="card__title">{{ $t('exportSettings') }}</h3>
            <p class="settings-card__subtitle">{{ $t('exportSettingsDescription') }}</p>
          </div>
        </header>
        <div class="card__body">
          <textarea
            class="textarea textarea--mono settings-json"
            rows="10"
            readonly
            :value="exportJson"
            :aria-label="$t('exportSettings')"
            @focus="$event.target.select()"
          ></textarea>
          <div class="button-row">
            <button type="button" class="btn" :class="{ 'is-copied': copySuccess }" @click="copyToClipboard">
              <transition name="icon-swap" mode="out-in">
                <UiIcon v-if="copySuccess" key="ok" name="check" />
                <UiIcon v-else key="copy" name="copy" />
              </transition>
              <span>{{ copySuccess ? $t('copiedToClipboard') : $t('copyToClipboard') }}</span>
            </button>
            <button type="button" class="btn btn--primary" @click="downloadAsFile">
              <UiIcon name="download" />
              <span>{{ $t('downloadAsFile') }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Import Section -->
      <section class="card">
        <header class="card__header">
          <span class="settings-card__icon"><UiIcon name="file-up" /></span>
          <div>
            <h3 class="card__title">{{ $t('importSettings') }}</h3>
            <p class="settings-card__subtitle">{{ $t('importSettingsDescription') }}</p>
          </div>
        </header>
        <div class="card__body">
          <textarea
            v-model="importJson"
            class="textarea textarea--mono settings-json"
            :class="{ 'is-invalid': importJson.trim() && !isValidJson }"
            rows="10"
            :placeholder="$t('pasteJsonHere')"
            :aria-label="$t('importSettings')"
          ></textarea>
          <div class="button-row">
            <button type="button" class="btn btn--primary" :disabled="!isValidJson" @click="applySettings">
              <UiIcon name="check" />
              <span>{{ $t('applySettings') }}</span>
            </button>
            <label class="btn file-button">
              <input type="file" accept=".json" @change="loadFromFile" />
              <UiIcon name="upload" />
              <span>{{ $t('loadFromFile') }}</span>
            </label>
          </div>
          <transition name="rise">
            <p v-if="importError" key="error" class="notice notice--danger">
              <UiIcon name="alert" />
              <span>{{ $t('invalidJsonError') }}: {{ importError }}</span>
            </p>
            <p v-else-if="importJson.trim() && !isValidJson" key="invalid" class="field-hint settings-hint--error">
              {{ $t('invalidJsonError') }}
            </p>
            <p v-else-if="importSuccess" key="success" class="notice notice--success">
              <UiIcon name="circle-check" />
              <span>{{ $t('settingsApplied') }}</span>
            </p>
          </transition>
        </div>
      </section>
    </div>
    <template #footer>
      <button type="button" class="btn" @click="close">{{ $t('close') }}</button>
    </template>
  </UiModal>
</template>

<script>
import { bus } from '../main';
import { saveAsString } from '../utils';
import UiModal from './ui/UiModal.vue';
import UiIcon from './ui/UiIcon.vue';

export default {
  name: 'SettingsModal',
  components: { UiModal, UiIcon },
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
        bus.$emit('toast', { type: 'success', icon: 'clipboard', message: this.$t('copiedToClipboard') });
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
      // allow loading the same file again
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    },
    applySettings() {
      this.importError = null;
      this.importSuccess = false;

      try {
        const settings = JSON.parse(this.importJson);
        bus.$emit('importSettings', settings);
        this.importSuccess = true;
        bus.$emit('toast', { type: 'success', message: this.$t('settingsApplied') });
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

<style>
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.settings-card__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--surface-inset);
  color: var(--text-2);
}

.settings-card__icon .svg-icon {
  width: 18px;
  height: 18px;
}

.settings-card__subtitle {
  margin: 2px 0 0;
  color: var(--text-3);
  font-size: 12.5px;
  line-height: 1.4;
}

.settings-json.textarea {
  min-height: 210px;
  resize: vertical;
}

.settings-json.is-invalid {
  border-color: var(--danger);
}

.settings-hint--error {
  color: var(--danger-text);
}

.btn.is-copied {
  border-color: var(--accent-soft-border);
  color: var(--accent-text);
}

.file-button {
  position: relative;
  overflow: hidden;
}

.file-button input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

@media (max-width: 760px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
