<template>
  <UiModal
    :title="$t('batchMode')"
    :subtitle="!isProcessing && !showResults ? $t('batchModeDescription') : ''"
    icon="layers"
    size="lg"
    :close-on-backdrop="!isProcessing"
    @close="close"
  >
    <!-- Mode Selector and Options (visible before processing and results) -->
    <div v-if="!isProcessing && !showResults" class="batch">
      <div class="batch__options">
        <div class="field-stack">
          <span class="field-label">{{ $t('batchModeType') }}</span>
          <UiSegmented v-model="batchModeType" :options="modeOptions" :aria-label="$t('batchModeType')" />
        </div>
        <div class="batch__parts">
          <UiToggle v-model="localMultipleParts" :label="$t('separateParts')" />
          <p class="field-hint">{{ $t('exportSeparatePartsHelp') }}</p>
        </div>
      </div>
      <p class="field-hint batch__mode-help">
        {{ batchModeType === 'simple' ? $t('batchModeSimpleHelp') : $t('batchModeAdvancedHelp') }}
      </p>

      <!-- Simple Mode: Textarea for text entries -->
      <div v-if="batchModeType === 'simple'" key="simple" class="batch__panel">
        <details class="howto">
          <summary><UiIcon name="info" /> {{ $t('batchSimpleHowToTitle') }}</summary>
          <ol>
            <li>{{ $t('batchSimpleStep1') }}</li>
            <li>{{ $t('batchSimpleStep2') }}</li>
            <li>{{ $t('batchSimpleStep3') }}</li>
          </ol>
        </details>

        <label class="field-stack">
          <span class="field-label">{{ $t('batchSimpleTextareaLabel') }}</span>
          <div class="batch__textarea-wrap">
            <textarea
              v-model="simpleTextInput"
              class="textarea textarea--mono batch__textarea"
              :placeholder="$t('batchSimpleTextareaPlaceholder')"
              rows="10"
              spellcheck="false"
            ></textarea>
            <span class="batch__count" :class="{ 'is-active': simpleTextLines.length > 0 }">
              {{ $t('batchSimpleTextareaHelp', { count: simpleTextLines.length }) }}
            </span>
          </div>
        </label>

        <!-- Warning for large batches -->
        <div v-if="simpleTextLines.length > 50" class="notice notice--warning">
          <UiIcon name="alert" />
          <span>{{ $t('batchLargeWarning', { count: simpleTextLines.length }) }}</span>
        </div>
      </div>

      <!-- Advanced Mode: CSV approach -->
      <div v-else key="advanced" class="batch__panel">
        <details class="howto">
          <summary><UiIcon name="info" /> {{ $t('batchHowToTitle') }}</summary>
          <ol>
            <li>{{ $t('batchStep1') }}</li>
            <li>{{ $t('batchStep2') }}</li>
            <li>{{ $t('batchStep3') }}</li>
            <li>{{ $t('batchStep4') }}</li>
          </ol>
          <p><strong>{{ $t('batchTips') }}</strong></p>
          <ul>
            <li>{{ $t('batchTip1') }}</li>
            <li>{{ $t('batchTip2') }}</li>
            <li>{{ $t('batchTip3') }}</li>
          </ul>
        </details>

        <div class="batch__steps">
          <!-- Template Download -->
          <section class="batch-step">
            <span class="batch-step__number">1</span>
            <div class="batch-step__content">
              <h3 class="batch-step__title">{{ $t('batchTemplateDownload') }}</h3>
              <p class="field-hint">{{ $t('batchTemplateHelp') }}</p>
              <button type="button" class="btn btn--sm" @click="downloadTemplate">
                <UiIcon name="download" />
                <span>{{ $t('downloadCsvTemplate') }}</span>
              </button>
            </div>
          </section>

          <!-- CSV Upload -->
          <section class="batch-step">
            <span class="batch-step__number">2</span>
            <div class="batch-step__content">
              <h3 class="batch-step__title">{{ $t('uploadCsvFile') }}</h3>
              <label
                class="file-drop"
                :class="{ 'is-dragover': isDragOver }"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="onDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept=".csv"
                  @change="handleFileUpload"
                />
                <span class="file-drop__icon"><UiIcon name="file-spreadsheet" /></span>
                <span class="file-drop__text">
                  <span class="file-drop__title">{{ fileName || $t('chooseFile') }}</span>
                  <span>{{ fileName ? $t('batchReplaceFile') : $t('noFileSelected') }}</span>
                </span>
              </label>
            </div>
          </section>
        </div>

        <!-- Warning for large batches -->
        <div v-if="parsedRows.length > 50" class="notice notice--warning">
          <UiIcon name="alert" />
          <span>{{ $t('batchLargeWarning', { count: parsedRows.length }) }}</span>
        </div>

        <!-- Parse Errors -->
        <div v-if="parseError" class="notice notice--danger">
          <UiIcon name="circle-x" />
          <span>{{ parseError }}</span>
        </div>

        <!-- Preview Table -->
        <div v-if="parsedRows.length > 0 && !parseError" class="batch__preview">
          <div class="batch__preview-head">
            <span class="field-label">
              {{ $t('batchPreview') }} ({{ $t('batchShowingRows', { shown: Math.min(5, parsedRows.length), total: parsedRows.length }) }})
            </span>
            <span v-if="validationSummary" class="batch__validation">
              <span class="badge">{{ $t('batchValidRows') }}: {{ validationSummary.valid }}</span>
              <span v-if="validationSummary.invalid > 0" class="badge badge--danger">
                {{ $t('batchInvalidRows') }}: {{ validationSummary.invalid }}
              </span>
            </span>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th v-for="col in csvColumns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in parsedRows.slice(0, 5)" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td v-for="col in csvColumns" :key="col">
                    <span v-if="!row[col]" class="data-table__empty">—</span>
                    <span v-else>{{ truncateValue(row[col]) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="parsedRows.length > 5" class="field-hint">
            {{ $t('batchMoreRows', { count: parsedRows.length - 5 }) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Processing Progress -->
    <div v-if="isProcessing" class="batch-progress" role="status" aria-live="polite">
      <div class="batch-progress__head">
        <span class="batch-progress__title">
          <UiIcon name="loader" class="spin" />
          {{ $t('batchProcessing') }}
        </span>
        <span class="batch-progress__percent">{{ progressPercent }}%</span>
      </div>
      <div class="progress">
        <div class="progress__bar" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <p class="field-hint">{{ $t('batchProgress', { current: processedCount, total: totalCount }) }}</p>
      <p v-if="currentItemLabel" class="batch-progress__current">
        {{ $t('batchCurrentItem') }}: <code>{{ currentItemLabel }}</code>
      </p>
    </div>

    <!-- Results Summary with Thank You and Countdown -->
    <div v-if="showResults" class="batch-results" :class="{ 'has-ad': !adblockEnabled && exportAd }">
      <div v-if="!adblockEnabled && exportAd" class="batch-results__ad" v-html="exportAd"></div>
      <div class="batch-results__content">
        <div v-if="successCount > 0" class="notice notice--success">
          <UiIcon name="circle-check" />
          <span>{{ $t('batchSuccessCount', { count: successCount }) }}</span>
        </div>
        <div v-if="errorResults.length > 0" class="notice notice--danger">
          <UiIcon name="circle-x" />
          <div>
            <strong>{{ $t('batchErrorCount', { count: errorResults.length }) }}</strong>
            <ul class="batch-results__errors">
              <li v-for="(err, index) in errorResults.slice(0, 10)" :key="index">
                {{ $t('batchRowError', { row: err.row, error: err.error }) }}
              </li>
              <li v-if="errorResults.length > 10">
                {{ $t('batchMoreErrors', { count: errorResults.length - 10 }) }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Countdown and Thank You Message -->
        <div v-if="successCount > 0" class="batch-results__download">
          <div class="progress" :class="{ 'progress--indeterminate': countdownSeconds !== 0 }">
            <div class="progress__bar" :style="countdownSeconds === 0 ? { width: '100%' } : null"></div>
          </div>
          <p class="batch-results__countdown">
            <span v-if="countdownSeconds > 0">{{ $t('batchDownloadCountdown', { seconds: countdownSeconds }) }}</span>
            <span v-if="countdownSeconds === 0">{{ $t('batchDownloadStarting') }}</span>
          </p>
          <p v-if="!adblockEnabled" class="field-hint">{{ $t('batchThankYou') }}</p>
          <template v-if="adblockEnabled">
            <p class="field-hint">{{ $t('batchAdblockMessage') }}</p>
            <div class="button-row">
              <a class="btn" href="https://paypal.me/fstein42" target="_blank" rel="noopener" v-if="!showingThankYou" @click="showThanks">
                <i class="fab fa-paypal" aria-hidden="true"></i>
                <span>Support qrcode2stl</span>
              </a>
              <a class="btn btn--danger" href="https://paypal.me/fstein42" target="_blank" rel="noopener" v-if="showingThankYou">
                <UiIcon name="heart" />
                <span>{{ $t('thankYou') }}</span>
              </a>
            </div>
            <p class="field-hint">{{ $t('batchThankYou') }}</p>
          </template>
        </div>
      </div>
    </div>

    <template #footer>
      <template v-if="!isProcessing && !showResults">
        <button type="button" class="btn" @click="close">{{ $t('cancel') }}</button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="!canGenerate"
          @click="startBatchGeneration"
        >
          <UiIcon name="play" />
          <span>{{ $t('batchGenerate') }} ({{ totalItemCount }})</span>
        </button>
      </template>
      <template v-if="isProcessing">
        <button type="button" class="btn btn--danger" @click="abortGeneration">
          <UiIcon name="square" />
          <span>{{ $t('batchAbort') }}</span>
        </button>
      </template>
      <template v-if="showResults">
        <button type="button" class="btn" @click="reset">{{ $t('batchStartNew') }}</button>
        <button type="button" class="btn" @click="close">{{ $t('close') }}</button>
        <button v-if="successCount > 0" type="button" class="btn btn--primary" @click="downloadZip">
          <UiIcon name="file-archive" />
          <span>{{ $t('batchDownloadZip') }}</span>
        </button>
      </template>
    </template>
  </UiModal>
</template>

<script>
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import qrcode from 'qrcode';
import vcardjs from 'vcards-js';
import merge from 'deepmerge';
import JSZip from 'jszip';
import { save, getRandomBanner, trimIconShapesBounds } from '../utils';
import parseWorkerMeshes from '../model-worker/meshes';
import UiModal from './ui/UiModal.vue';
import UiIcon from './ui/UiIcon.vue';
import UiSegmented from './ui/UiSegmented.vue';
import UiToggle from './ui/UiToggle.vue';

export default {
  name: 'BatchModeModal',
  components: {
    UiModal, UiIcon, UiSegmented, UiToggle,
  },
  props: {
    options: Object,
    activeTabIndex: Number,
    exporter: Object,
    stlType: String,
    multipleParts: Boolean,
  },
  emits: ['close', 'generateSingle'],
  data() {
    return {
      // Mode selection
      batchModeType: 'simple', // 'simple' or 'advanced'
      localMultipleParts: this.multipleParts,
      // Simple mode
      simpleTextInput: '',
      // Advanced mode (CSV)
      fileName: '',
      csvContent: '',
      csvColumns: [],
      csvDelimiter: ',',
      parsedRows: [],
      parseError: null,
      // Processing
      isProcessing: false,
      aborted: false,
      processedCount: 0,
      totalCount: 0,
      currentItemLabel: '',
      successCount: 0,
      errorResults: [],
      showResults: false,
      generatedFiles: [],
      // Countdown and ad
      countdownSeconds: 5,
      countdownInterval: null,
      adblockEnabled: false,
      exportAd: '',
      showingThankYou: false,
      hasAutoDownloaded: false,
      isDragOver: false,
    };
  },
  computed: {
    modeOptions() {
      return [
        { value: 'simple', label: this.$t('batchModeSimple'), icon: 'list' },
        { value: 'advanced', label: this.$t('batchModeAdvanced'), icon: 'file-spreadsheet' },
      ];
    },
    progressPercent() {
      return this.totalCount ? Math.round((this.processedCount / this.totalCount) * 100) : 0;
    },
    simpleTextLines() {
      if (!this.simpleTextInput.trim()) return [];
      return this.simpleTextInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    },
    totalItemCount() {
      if (this.batchModeType === 'simple') {
        return this.simpleTextLines.length;
      }
      return this.validationSummary ? this.validationSummary.valid : 0;
    },
    canGenerate() {
      if (this.batchModeType === 'simple') {
        return this.simpleTextLines.length > 0;
      }
      return this.parsedRows.length > 0 && !this.parseError && this.validationSummary && this.validationSummary.valid > 0;
    },
    validationSummary() {
      if (this.parsedRows.length === 0) return null;

      let valid = 0;
      let invalid = 0;

      for (const row of this.parsedRows) {
        if (this.validateRow(row)) {
          valid++;
        } else {
          invalid++;
        }
      }

      return { valid, invalid };
    },
    contentTypeFields() {
      // Map of required content fields per tab index
      return {
        0: ['text'], // Text
        1: ['wifi.ssid'], // WiFi
        2: ['email.recipient'], // Email
        3: ['contact.firstName', 'contact.lastName'], // Contact (at least one)
        4: ['sms.recipient'], // SMS
        5: ['calendar.eventName'], // Calendar
      };
    },
  },
  watch: {
    countdownSeconds(newVal) {
      if (newVal === 0 && this.successCount > 0 && !this.hasAutoDownloaded) {
        this.hasAutoDownloaded = true;
        this.downloadZip();
      }
    },
  },
  methods: {
    close() {
      if (this.isProcessing) {
        // stop the running batch instead of leaving it working in the background
        this.aborted = true;
      }
      this.stopCountdown();
      this.$emit('close');
    },

    showThanks() {
      this.showingThankYou = true;
    },

    startCountdown() {
      this.countdownSeconds = 5;
      this.hasAutoDownloaded = false;

      // Check for adblock
      // eslint-disable-next-line camelcase
      if (typeof __google_ad_urls === 'undefined') {
        this.exportAd = getRandomBanner('300x250');
      } else {
        const adElement = document.getElementById('adsenseloader-export');
        this.exportAd = adElement ? adElement.innerHTML : '';
      }

      this.countdownInterval = setInterval(() => {
        if (this.countdownSeconds > 0) {
          this.countdownSeconds -= 1;
        }
      }, 1000);
    },

    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    },

    truncateValue(value) {
      if (!value) return '';
      const str = String(value);
      return str.length > 30 ? str.substring(0, 30) + '...' : str;
    },

    getFieldsForContentType() {
      // Get all available fields based on current content type
      const commonFields = [
        'errorCorrectionLevel',
        'base.shape',
        'base.width',
        'base.depth',
        'base.cornerRadius',
        'base.hasBorder',
        'base.borderWidth',
        'base.borderDepth',
        'base.hasText',
        'base.textPlacement',
        'base.textMessage',
        'base.textSize',
        'base.textMargin',
        'base.textDepth',
        'base.textAlign',
        'base.hasKeychainAttachment',
        'base.keychainPlacement',
        'base.keychainHoleDiameter',
        'base.keychainMaterialThickness',
        'base.keychainOffset',
        'base.mirrorHoles',
        'base.hasNfcIndentation',
        'base.nfcIndentationShape',
        'base.nfcIndentationSize',
        'base.nfcIndentationDepth',
        'base.nfcIndentationHidden',
        'base.hasMagnetPockets',
        'base.magnetPocketSize',
        'base.magnetPocketDepth',
        'base.magnetPocketOffset',
        'code.depth',
        'code.margin',
        'code.blockSizeMultiplier',
        'code.iconName',
        'code.iconSizeRatio',
        'code.cityMode',
        'code.depthMax',
        'code.invert',
        'code.compatibilityMode',
      ];

      let contentFields = [];
      switch (this.activeTabIndex) {
        case 0: // Text
          contentFields = ['text'];
          break;
        case 1: // WiFi
          contentFields = ['wifi.ssid', 'wifi.password', 'wifi.security', 'wifi.hidden'];
          break;
        case 2: // Email
          contentFields = ['email.recipient', 'email.subject', 'email.body'];
          break;
        case 3: // Contact
          contentFields = [
            'contact.firstName', 'contact.lastName', 'contact.organization',
            'contact.role', 'contact.cell', 'contact.phone', 'contact.fax',
            'contact.email', 'contact.street', 'contact.postcode', 'contact.city',
            'contact.state', 'contact.country', 'contact.website'
          ];
          break;
        case 4: // SMS
          contentFields = ['sms.recipient', 'sms.message'];
          break;
        case 5: // Calendar
          contentFields = [
            'calendar.eventName', 'calendar.startDate', 'calendar.startTime',
            'calendar.endDate', 'calendar.endTime', 'calendar.allDay',
            'calendar.location', 'calendar.description'
          ];
          break;
      }

      return ['filename', ...contentFields, ...commonFields];
    },

    downloadTemplate() {
      const fields = this.getFieldsForContentType();
      const csvHeader = fields.join(',');

      // Create an example row with current options values
      const exampleRow = fields.map(field => {
        if (field === 'filename') return 'qrcode_001';
        const value = this.getNestedValue(this.options, field);
        if (value === undefined || value === null || value === '') return '';
        // Escape values with commas or quotes
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      }).join(',');

      const csvContent = `${csvHeader}\n${exampleRow}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const contentTypes = ['text', 'wifi', 'email', 'contact', 'sms', 'calendar'];
      const filename = `qrcode_batch_template_${contentTypes[this.activeTabIndex]}.csv`;
      save(blob, filename);
    },

    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    },

    setNestedValue(obj, path, value) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((current, key) => {
        if (!(key in current)) current[key] = {};
        return current[key];
      }, obj);
      target[lastKey] = value;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.readCsvFile(file);
    },

    onDrop(event) {
      this.isDragOver = false;
      const file = event.dataTransfer && event.dataTransfer.files[0];
      if (file) {
        this.readCsvFile(file);
      }
    },

    readCsvFile(file) {
      this.fileName = file.name;
      this.parseError = null;
      this.parsedRows = [];
      this.csvColumns = [];

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.csvContent = e.target.result;
          this.parseCSV(this.csvContent);
        } catch (error) {
          this.parseError = this.$t('batchParseError') + ': ' + error.message;
        }
      };
      reader.onerror = () => {
        this.parseError = this.$t('batchFileReadError');
      };
      reader.readAsText(file);
    },

    parseCSV(content) {
      const lines = content.split(/\r?\n/).filter(line => line.trim());
      if (lines.length < 2) {
        this.parseError = this.$t('batchNoDataRows');
        return;
      }

      // Auto-detect delimiter (comma or semicolon)
      const headerLine = lines[0];
      const commaCount = (headerLine.match(/,/g) || []).length;
      const semicolonCount = (headerLine.match(/;/g) || []).length;
      this.csvDelimiter = semicolonCount > commaCount ? ';' : ',';

      // Parse header
      this.csvColumns = this.parseCSVLine(lines[0]);

      // Validate required content field exists
      const requiredFields = this.contentTypeFields[this.activeTabIndex];
      const hasRequiredField = requiredFields.some(field =>
        this.csvColumns.includes(field)
      );

      if (!hasRequiredField) {
        this.parseError = this.$t('batchMissingRequiredField', {
          fields: requiredFields.join(' ' + this.$t('or') + ' ')
        });
        return;
      }

      // Parse data rows
      this.parsedRows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        const row = {};
        this.csvColumns.forEach((col, index) => {
          row[col] = values[index] || '';
        });
        this.parsedRows.push(row);
      }
    },

    parseCSVLine(line) {
      const delimiter = this.csvDelimiter || ',';
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
          if (char === '"') {
            if (line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            current += char;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
          } else if (char === delimiter) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
      }
      result.push(current.trim());

      return result;
    },

    validateRow(row) {
      const requiredFields = this.contentTypeFields[this.activeTabIndex];
      console.log('[Batch] Validating row:', row);
      console.log('[Batch] Required fields for tab', this.activeTabIndex, ':', requiredFields);
      // For contact, at least one of firstName/lastName must be present
      if (this.activeTabIndex === 3) {
        const valid = row['contact.firstName'] || row['contact.lastName'];
        console.log('[Batch] Contact validation result:', valid);
        return valid;
      }
      const valid = requiredFields.some(field => {
        const hasField = row[field] && row[field].trim();
        console.log(`[Batch] Checking field '${field}':`, row[field], '-> valid:', !!hasField);
        return hasField;
      });
      console.log('[Batch] Row validation result:', valid);
      return valid;
    },

    buildOptionsFromRow(row) {
      // Start with a deep copy of current options
      const rowOptions = JSON.parse(JSON.stringify(this.options));
      console.log('[Batch] Building options from row:', row);
      console.log('[Batch] Base options:', this.options);

      // Apply CSV values
      for (const [key, value] of Object.entries(row)) {
        if (key === 'filename' || !value) continue;

        // Convert value to appropriate type
        let convertedValue = value;

        // Boolean conversion
        if (value.toLowerCase() === 'true') convertedValue = true;
        else if (value.toLowerCase() === 'false') convertedValue = false;
        // Number conversion
        else if (!isNaN(value) && value !== '') convertedValue = Number(value);

        console.log(`[Batch] Setting ${key} = ${convertedValue} (type: ${typeof convertedValue})`);
        this.setNestedValue(rowOptions, key, convertedValue);
      }

      console.log('[Batch] Final row options:', rowOptions);
      return rowOptions;
    },

    wifiQREscape(str) {
      const regex = /([:|\\|;|,|"])/gm;
      const subst = '\\$1';
      return str.replace(regex, subst);
    },

    generateICalString(calendar) {
      if (!calendar.eventName || !calendar.startDate || !calendar.endDate) {
        return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//QRCode2STL//printer.tools//EN\r\nEND:VCALENDAR';
      }

      const formatICalDate = (date, time, allDay) => {
        if (allDay) {
          return date.replace(/-/g, '');
        } else {
          const dateTime = `${date}T${time}:00`;
          return new Date(dateTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }
      };

      const escapeICalString = (str) => {
        if (!str) return '';
        return str
          .replace(/\\/g, '\\\\')
          .replace(/;/g, '\\;')
          .replace(/,/g, '\\,')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '');
      };

      const uid = Date.now().toString(36);
      const dtstart = formatICalDate(calendar.startDate, calendar.startTime, calendar.allDay);
      let dtend = formatICalDate(calendar.endDate, calendar.endTime, calendar.allDay);

      if (calendar.allDay) {
        const endDate = new Date(calendar.endDate);
        endDate.setDate(endDate.getDate() + 1);
        dtend = endDate.toISOString().split('T')[0].replace(/-/g, '');
      }

      let icalString = 'BEGIN:VCALENDAR\r\n';
      icalString += 'VERSION:2.0\r\n';
      icalString += 'PRODID:-//QRCode2STL//printer.tools//EN\r\n';
      icalString += 'BEGIN:VEVENT\r\n';
      icalString += `UID:${uid}\r\n`;
      icalString += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;

      if (calendar.allDay) {
        icalString += `DTSTART;VALUE=DATE:${dtstart}\r\n`;
        icalString += `DTEND;VALUE=DATE:${dtend}\r\n`;
      } else {
        icalString += `DTSTART:${dtstart}\r\n`;
        icalString += `DTEND:${dtend}\r\n`;
      }

      icalString += `SUMMARY:${escapeICalString(calendar.eventName)}\r\n`;
      if (calendar.description) {
        icalString += `DESCRIPTION:${escapeICalString(calendar.description)}\r\n`;
      }
      if (calendar.location) {
        icalString += `LOCATION:${escapeICalString(calendar.location)}\r\n`;
      }

      icalString += 'END:VEVENT\r\n';
      icalString += 'END:VCALENDAR';
      return icalString;
    },

    getQRText(rowOptions) {
      const vCard = vcardjs();
      let ret = '';

      console.log('[Batch] getQRText called with activeTabIndex:', this.activeTabIndex);
      console.log('[Batch] rowOptions.text:', rowOptions.text, 'type:', typeof rowOptions.text);

      switch (this.activeTabIndex) {
        case 0: // Text
          ret = rowOptions.text !== undefined ? String(rowOptions.text) : '';
          break;
        case 1: // WiFi
          if (rowOptions.wifi.password === '') {
            rowOptions.wifi.security = 'nopass';
          }
          if (rowOptions.wifi.security === 'nopass') {
            rowOptions.wifi.password = '';
          }
          ret = `WIFI:S:${this.wifiQREscape(rowOptions.wifi.ssid)};T:${this.wifiQREscape(rowOptions.wifi.security)};P:${this.wifiQREscape(rowOptions.wifi.password)};H:${rowOptions.wifi.hidden ? 'true' : 'false'};`;
          break;
        case 2: // Email
          ret = `mailto:${rowOptions.email.recipient.split(',').map(x => x.trim()).join(',')}?subject=${encodeURI(rowOptions.email.subject)}&body=${encodeURI(rowOptions.email.body)}`;
          break;
        case 3: // Contact
          vCard.firstName = rowOptions.contact.firstName;
          vCard.lastName = rowOptions.contact.lastName;
          vCard.organization = rowOptions.contact.organization;
          vCard.url = rowOptions.contact.website;
          vCard.role = rowOptions.contact.role;
          vCard.homePhone = rowOptions.contact.phone;
          vCard.cellPhone = rowOptions.contact.cell;
          vCard.homeFax = rowOptions.contact.fax;
          vCard.email = rowOptions.contact.email;
          vCard.homeAddress.street = rowOptions.contact.street;
          vCard.homeAddress.city = rowOptions.contact.city;
          vCard.homeAddress.stateProvince = rowOptions.contact.state;
          vCard.homeAddress.postalCode = rowOptions.contact.postcode;
          vCard.homeAddress.countryRegion = rowOptions.contact.country;
          vCard.version = '3.0';
          ret = vCard.getFormattedString();
          break;
        case 4: // SMS
          ret = `SMSTO:${rowOptions.sms.recipient}:${rowOptions.sms.message}`;
          break;
        case 5: // Calendar
          ret = this.generateICalString(rowOptions.calendar);
          break;
      }

      return ret;
    },

    async startBatchGeneration() {
      this.isProcessing = true;
      this.aborted = false;
      this.processedCount = 0;
      this.successCount = 0;
      this.errorResults = [];
      this.generatedFiles = [];
      this.showResults = false;

      // Import model worker
      const modelWorker = (await import('@/model-worker')).default;

      if (this.batchModeType === 'simple') {
        // Simple mode: process text lines
        const lines = this.simpleTextLines;
        this.totalCount = lines.length;

        for (let i = 0; i < lines.length; i++) {
          if (this.aborted) break;

          const textValue = lines[i];
          const rowIndex = i + 1;

          try {
            // Build options from current settings, only changing text
            const rowOptions = JSON.parse(JSON.stringify(this.options));
            rowOptions.text = textValue;
            console.log(`[Batch Simple] Row ${rowIndex} text:`, textValue);

            this.currentItemLabel = this.truncateValue(textValue);

            // Handle icon if present
            if (rowOptions.code.iconName && rowOptions.code.iconName !== 'none' && !rowOptions.code.iconName.startsWith('custom-')) {
              rowOptions.errorCorrectionLevel = 'H';
              try {
                const svgLoader = new SVGLoader();
                const response = await fetch(`icons/${rowOptions.code.iconName}.svg`);
                const svgMarkup = await response.text();
                const svgData = svgLoader.parse(svgMarkup.replace(/currentColor/g, '#000'));

                const processedShapes = [];
                svgData.paths.forEach(path => {
                  try {
                    const shapes = SVGLoader.createShapes(path);
                    shapes.forEach(shape => {
                      processedShapes.push({
                        shape: shape.toJSON(),
                        holes: shape.holes ? shape.holes.map(hole => hole.toJSON()) : []
                      });
                    });
                  } catch (pathError) {
                    console.warn('Error processing SVG path:', pathError);
                  }
                });
                rowOptions.code.iconShapes = trimIconShapesBounds(processedShapes);
              } catch (iconError) {
                console.warn('Error loading icon:', iconError);
                rowOptions.code.iconName = 'none';
                rowOptions.code.iconShapes = null;
              }
            }

            // Generate QR code bitmap
            console.log(`[Batch Simple] Row ${rowIndex} generating QR bitmap with error correction:`, rowOptions.errorCorrectionLevel);
            const qrCodeObject = await qrcode.create(textValue, {
              errorCorrectionLevel: rowOptions.errorCorrectionLevel,
            });
            const qrCodeBitMask = qrCodeObject.modules.data;
            console.log(`[Batch Simple] Row ${rowIndex} QR bitmap generated, size:`, qrCodeBitMask.length);

            // Generate 3D model via worker
            console.log(`[Batch Simple] Row ${rowIndex} sending to model worker...`);
            const meshes = await this.generateModelAsync(modelWorker, qrCodeBitMask, rowOptions);
            console.log(`[Batch Simple] Row ${rowIndex} meshes received:`, Object.keys(meshes));

            // Export to STL
            const filename = `qrcode_${String(i + 1).padStart(3, '0')}`;
            console.log(`[Batch Simple] Row ${rowIndex} exporting as:`, filename);
            await this.exportToBuffer(meshes, filename);

            this.successCount++;
            console.log(`[Batch Simple] Row ${rowIndex} completed successfully`);
          } catch (error) {
            console.error(`[Batch Simple] Error processing row ${rowIndex}:`, error);
            this.errorResults.push({
              row: rowIndex,
              error: error.message || String(error),
            });
          }

          this.processedCount++;
        }
      } else {
        // Advanced mode: process CSV rows
        const validRows = this.parsedRows.filter(row => this.validateRow(row));
        this.totalCount = validRows.length;

        for (let i = 0; i < validRows.length; i++) {
          if (this.aborted) break;

          const row = validRows[i];
          const rowIndex = this.parsedRows.indexOf(row) + 1;

          try {
            // Build options from row
            const rowOptions = this.buildOptionsFromRow(row);
            console.log(`[Batch] Row ${rowIndex} options:`, rowOptions);

            // Get QR text
            const qrText = this.getQRText(rowOptions);
            console.log(`[Batch] Row ${rowIndex} QR text:`, qrText);
            this.currentItemLabel = this.truncateValue(qrText);

            if (!qrText) {
              throw new Error(this.$t('batchEmptyQRText'));
            }

            // Handle icon if present
            if (rowOptions.code.iconName && rowOptions.code.iconName !== 'none' && !rowOptions.code.iconName.startsWith('custom-')) {
              rowOptions.errorCorrectionLevel = 'H';
              try {
                const svgLoader = new SVGLoader();
                const response = await fetch(`icons/${rowOptions.code.iconName}.svg`);
                const svgMarkup = await response.text();
                const svgData = svgLoader.parse(svgMarkup.replace(/currentColor/g, '#000'));

                const processedShapes = [];
                svgData.paths.forEach(path => {
                  try {
                    const shapes = SVGLoader.createShapes(path);
                    shapes.forEach(shape => {
                      processedShapes.push({
                        shape: shape.toJSON(),
                        holes: shape.holes ? shape.holes.map(hole => hole.toJSON()) : []
                      });
                    });
                  } catch (pathError) {
                    console.warn('Error processing SVG path:', pathError);
                  }
                });
                rowOptions.code.iconShapes = trimIconShapesBounds(processedShapes);
              } catch (iconError) {
                console.warn('Error loading icon:', iconError);
                rowOptions.code.iconName = 'none';
                rowOptions.code.iconShapes = null;
              }
            }

            // Generate QR code bitmap
            console.log(`[Batch] Row ${rowIndex} generating QR bitmap with error correction:`, rowOptions.errorCorrectionLevel);
            const qrCodeObject = await qrcode.create(qrText, {
              errorCorrectionLevel: rowOptions.errorCorrectionLevel,
            });
            const qrCodeBitMask = qrCodeObject.modules.data;
            console.log(`[Batch] Row ${rowIndex} QR bitmap generated, size:`, qrCodeBitMask.length);

            // Generate 3D model via worker
            console.log(`[Batch] Row ${rowIndex} sending to model worker...`);
            const meshes = await this.generateModelAsync(modelWorker, qrCodeBitMask, rowOptions);
            console.log(`[Batch] Row ${rowIndex} meshes received:`, Object.keys(meshes));

            // Export to STL
            const filename = row.filename || `qrcode_${String(i + 1).padStart(3, '0')}`;
            console.log(`[Batch] Row ${rowIndex} exporting as:`, filename);
            await this.exportToBuffer(meshes, filename);

            this.successCount++;
            console.log(`[Batch] Row ${rowIndex} completed successfully`);
          } catch (error) {
            console.error(`[Batch] Error processing row ${rowIndex}:`, error);
            this.errorResults.push({
              row: rowIndex,
              error: error.message || String(error),
            });
          }

          this.processedCount++;
        }
      }

      this.isProcessing = false;
      this.showResults = true;
      // Start countdown for auto-download
      if (this.successCount > 0) {
        this.startCountdown();
      }
    },

    generateModelAsync(modelWorker, qrCodeBitMask, options) {
      let timeoutId;
      const timeout = new Promise((resolve, reject) => {
        // Timeout after 30 seconds
        timeoutId = setTimeout(() => {
          console.error('[Batch] Model generation timeout after 30s');
          reject(new Error('Model generation timeout'));
        }, 30000);
      });

      console.log('[Batch] Sending to worker:', { mode: 'QR', optionsKeys: Object.keys(options) });
      const generation = modelWorker.request({
        mode: 'QR',
        qrCodeBitMask,
        options,
      }).then((result) => {
        if (!result.meshes) {
          throw new Error('No meshes in worker response');
        }
        const meshes = parseWorkerMeshes(result.meshes, { preview: false });
        if (Object.keys(meshes).length === 0) {
          throw new Error('Empty meshes object');
        }
        return meshes;
      });

      return Promise.race([generation, timeout]).finally(() => clearTimeout(timeoutId));
    },

    async exportToBuffer(meshes, filename) {
      const exportAsBinary = this.stlType === 'binary';

      if (this.localMultipleParts) {
        // Export as multiple parts in a sub-zip
        const subZip = new JSZip();

        const parts = ['base', 'qrcode', 'border', 'icon', 'subtitle', 'keychainAttachment'];
        for (const part of parts) {
          if (meshes[part]) {
            const stlData = this.exporter.parse(meshes[part], { binary: exportAsBinary });
            const partFilename = `${filename}_${part}.stl`;
            if (exportAsBinary) {
              const content = stlData.buffer ? stlData.buffer : stlData;
              subZip.file(partFilename, content, { binary: true });
            } else {
              subZip.file(partFilename, stlData);
            }
          }
        }

        const zipBlob = await subZip.generateAsync({ type: 'blob' });
        this.generatedFiles.push({
          filename: `${filename}.zip`,
          data: zipBlob,
        });
      } else {
        // Export combined mesh
        if (meshes.combined) {
          const stlData = this.exporter.parse(meshes.combined, { binary: exportAsBinary });
          if (exportAsBinary) {
            const content = stlData.buffer ? new Uint8Array(stlData.buffer ? stlData.buffer : stlData) : new Uint8Array(stlData);
            this.generatedFiles.push({
              filename: `${filename}.stl`,
              data: content,
            });
          } else {
            this.generatedFiles.push({
              filename: `${filename}.stl`,
              data: stlData,
            });
          }
        }
      }
    },

    abortGeneration() {
      this.aborted = true;
    },

    async downloadZip() {
      const zip = new JSZip();

      for (const file of this.generatedFiles) {
        if (file.data instanceof Blob) {
          zip.file(file.filename, file.data);
        } else if (file.data instanceof Uint8Array) {
          zip.file(file.filename, file.data, { binary: true });
        } else {
          zip.file(file.filename, file.data);
        }
      }

      const timestamp = new Date().getTime();
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      save(zipBlob, `qrcode_batch_${timestamp}.zip`);
    },

    reset() {
      this.stopCountdown();
      this.batchModeType = 'simple';
      this.simpleTextInput = '';
      this.fileName = '';
      this.csvContent = '';
      this.csvColumns = [];
      this.csvDelimiter = ',';
      this.parsedRows = [];
      this.parseError = null;
      this.isProcessing = false;
      this.aborted = false;
      this.processedCount = 0;
      this.totalCount = 0;
      this.currentItemLabel = '';
      this.successCount = 0;
      this.errorResults = [];
      this.showResults = false;
      this.generatedFiles = [];
      this.countdownSeconds = 5;
      this.hasAutoDownloaded = false;
      this.showingThankYou = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
  },
};
</script>

<style>
.batch {
  display: grid;
  gap: 16px;
}

.batch__options {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.batch__parts {
  display: grid;
  gap: 4px;
  max-width: 420px;
}

.batch__mode-help {
  margin-top: -6px;
}

.batch__panel {
  display: grid;
  gap: 14px;
}

.howto {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-inset);
  color: var(--text-2);
  font-size: 13.5px;
}

.howto summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

.howto summary::-webkit-details-marker {
  display: none;
}

.howto summary::after {
  content: "";
  width: 7px;
  height: 7px;
  margin-left: auto;
  border-right: 2px solid var(--text-3);
  border-bottom: 2px solid var(--text-3);
  transform: rotate(45deg);
  transition: transform var(--duration) var(--ease-out);
}

.howto[open] summary::after {
  transform: rotate(-135deg);
}

.howto summary .svg-icon {
  width: 17px;
  height: 17px;
  color: var(--info-text);
}

.howto ol,
.howto ul,
.howto p {
  margin: 0;
  padding: 0 14px 10px 34px;
  line-height: 1.55;
}

.howto ol {
  list-style: decimal;
}

.howto ul {
  list-style: disc;
}

.howto li {
  margin: 3px 0;
}

.howto p {
  padding-left: 14px;
}

.batch__textarea-wrap {
  position: relative;
}

.batch__textarea.textarea {
  min-height: 220px;
  padding-bottom: 36px;
}

.batch__count {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--surface-inset);
  color: var(--text-3);
  font-size: 12px;
  font-weight: 600;
  pointer-events: none;
  transition: background-color var(--duration) ease, color var(--duration) ease;
}

.batch__count.is-active {
  background: var(--accent-soft);
  color: var(--accent-text);
}

.batch__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.batch-step {
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.batch-step__number {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 13px;
  font-weight: 700;
}

.batch-step__content {
  display: grid;
  flex: 1 1 auto;
  align-content: start;
  justify-items: start;
  gap: 8px;
  min-width: 0;
}

.batch-step__content .file-drop {
  width: 100%;
}

.batch-step__title {
  margin: 2px 0 0;
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
}

.batch__preview {
  display: grid;
  gap: 8px;
}

.batch__preview-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.batch__validation {
  display: inline-flex;
  gap: 6px;
}

.badge--danger {
  background: var(--danger-soft);
  color: var(--danger-text);
}

.data-table-wrap {
  max-height: 260px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.data-table th,
.data-table td {
  max-width: 200px;
  padding: 7px 10px;
  border-bottom: 1px solid var(--divider);
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-table th {
  position: sticky;
  top: 0;
  background: var(--surface-inset);
  color: var(--text-2);
  font-family: var(--font-mono);
  font-weight: 600;
}

.data-table tbody tr:nth-child(even) {
  background: var(--surface-inset);
}

.data-table__empty {
  color: var(--text-3);
}

.batch-progress {
  display: grid;
  gap: 10px;
  padding: 24px 4px;
}

.batch-progress__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.batch-progress__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-size: 16px;
  font-weight: 600;
}

.batch-progress__title .svg-icon {
  color: var(--accent);
}

.batch-progress__percent {
  color: var(--accent-text);
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.batch-progress .progress {
  height: 10px;
}

.batch-progress__current {
  margin: 0;
  overflow: hidden;
  color: var(--text-3);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.batch-results {
  display: grid;
  gap: 20px;
}

.batch-results.has-ad {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
}

.batch-results__content {
  display: grid;
  gap: 12px;
}

.batch-results__errors {
  margin: 6px 0 0;
  padding-left: 18px;
  list-style: disc;
}

.batch-results__download {
  display: grid;
  gap: 10px;
}

.batch-results__countdown {
  margin: 0;
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
}

@media (max-width: 760px) {
  .batch__steps,
  .batch-results.has-ad {
    grid-template-columns: 1fr;
  }
}
</style>
