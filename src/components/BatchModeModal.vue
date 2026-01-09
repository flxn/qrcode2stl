<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card" style="width: 90%; max-width: 1000px;">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <i class="fas fa-layer-group"></i> {{ $t('batchMode') }}
        </p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Instructions -->
        <div class="content" v-if="!isProcessing && !showResults">
          <p>{{ $t('batchModeDescription') }}</p>

          <div class="notification is-info is-light">
            <p class="mb-2"><strong>{{ $t('batchHowToTitle') }}</strong></p>
            <ol class="mt-0">
              <li>{{ $t('batchStep1') }}</li>
              <li>{{ $t('batchStep2') }}</li>
              <li>{{ $t('batchStep3') }}</li>
              <li>{{ $t('batchStep4') }}</li>
            </ol>
            <p class="mb-1"><strong>{{ $t('batchTips') }}</strong></p>
            <ul class="mt-0">
              <li>{{ $t('batchTip1') }}</li>
              <li>{{ $t('batchTip2') }}</li>
              <li>{{ $t('batchTip3') }}</li>
            </ul>
          </div>

          <!-- Template Download -->
          <div class="field">
            <label class="label">{{ $t('batchTemplateDownload') }}</label>
            <p class="help mb-2">{{ $t('batchTemplateHelp') }}</p>
            <button class="button is-info is-small" @click="downloadTemplate">
              <span class="icon"><i class="fas fa-download"></i></span>
              <span>{{ $t('downloadCsvTemplate') }}</span>
            </button>
          </div>

          <hr />

          <!-- CSV Upload -->
          <div class="field">
            <label class="label">{{ $t('uploadCsvFile') }}</label>
            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  accept=".csv"
                  @change="handleFileUpload"
                  ref="fileInput"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">{{ $t('chooseFile') }}</span>
                </span>
                <span class="file-name">
                  {{ fileName || $t('noFileSelected') }}
                </span>
              </label>
            </div>
          </div>

          <!-- Warning for large batches -->
          <div class="notification is-warning" v-if="parsedRows.length > 50">
            <i class="fas fa-exclamation-triangle"></i>
            {{ $t('batchLargeWarning', { count: parsedRows.length }) }}
          </div>

          <!-- Parse Errors -->
          <div class="notification is-danger" v-if="parseError">
            <i class="fas fa-times-circle"></i>
            {{ parseError }}
          </div>

          <!-- Preview Table -->
          <div v-if="parsedRows.length > 0 && !parseError">
            <label class="label">{{ $t('batchPreview') }} ({{ $t('batchShowingRows', { shown: Math.min(5, parsedRows.length), total: parsedRows.length }) }})</label>
            <div class="table-container">
              <table class="table is-striped is-narrow is-hoverable is-fullwidth">
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
                      <span class="has-text-grey" v-if="!row[col]">—</span>
                      <span v-else>{{ truncateValue(row[col]) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="help" v-if="parsedRows.length > 5">
              {{ $t('batchMoreRows', { count: parsedRows.length - 5 }) }}
            </p>

            <!-- Validation Summary -->
            <div class="notification is-info is-light mt-3" v-if="validationSummary">
              <p><strong>{{ $t('batchValidation') }}:</strong></p>
              <p>{{ $t('batchValidRows') }}: {{ validationSummary.valid }}</p>
              <p v-if="validationSummary.invalid > 0" class="has-text-danger">
                {{ $t('batchInvalidRows') }}: {{ validationSummary.invalid }}
              </p>
            </div>
          </div>
        </div>

        <!-- Processing Progress -->
        <div v-if="isProcessing" class="has-text-centered">
          <p class="title is-5">{{ $t('batchProcessing') }}</p>
          <progress class="progress is-primary is-large" :value="processedCount" :max="totalCount">
            {{ Math.round((processedCount / totalCount) * 100) }}%
          </progress>
          <p class="subtitle is-6">
            {{ $t('batchProgress', { current: processedCount, total: totalCount }) }}
          </p>
          <p v-if="currentItemLabel" class="has-text-grey">
            {{ $t('batchCurrentItem') }}: {{ currentItemLabel }}
          </p>
        </div>

        <!-- Results Summary -->
        <div v-if="showResults">
          <div class="notification is-success" v-if="successCount > 0">
            <i class="fas fa-check-circle"></i>
            {{ $t('batchSuccessCount', { count: successCount }) }}
          </div>
          <div class="notification is-danger" v-if="errorResults.length > 0">
            <p><strong><i class="fas fa-times-circle"></i> {{ $t('batchErrorCount', { count: errorResults.length }) }}</strong></p>
            <ul>
              <li v-for="(err, index) in errorResults.slice(0, 10)" :key="index">
                {{ $t('batchRowError', { row: err.row, error: err.error }) }}
              </li>
              <li v-if="errorResults.length > 10">
                {{ $t('batchMoreErrors', { count: errorResults.length - 10 }) }}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons" v-if="!isProcessing && !showResults">
          <button
            class="button is-success"
            :disabled="parsedRows.length === 0 || parseError || (validationSummary && validationSummary.valid === 0)"
            @click="startBatchGeneration"
          >
            <span class="icon"><i class="fas fa-play"></i></span>
            <span>{{ $t('batchGenerate') }} ({{ validationSummary ? validationSummary.valid : 0 }})</span>
          </button>
          <button class="button" @click="close">{{ $t('cancel') }}</button>
        </div>
        <div class="buttons" v-if="isProcessing">
          <button class="button is-danger" @click="abortGeneration">
            <span class="icon"><i class="fas fa-stop"></i></span>
            <span>{{ $t('batchAbort') }}</span>
          </button>
        </div>
        <div class="buttons" v-if="showResults">
          <button class="button is-primary" @click="downloadZip" v-if="successCount > 0">
            <span class="icon"><i class="fas fa-download"></i></span>
            <span>{{ $t('batchDownloadZip') }}</span>
          </button>
          <button class="button" @click="reset">{{ $t('batchStartNew') }}</button>
          <button class="button" @click="close">{{ $t('close') }}</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import qrcode from 'qrcode';
import vcardjs from 'vcards-js';
import merge from 'deepmerge';
import JSZip from 'jszip';
import { save } from '../utils';

export default {
  name: 'BatchModeModal',
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
      fileName: '',
      csvContent: '',
      csvColumns: [],
      csvDelimiter: ',',
      parsedRows: [],
      parseError: null,
      isProcessing: false,
      aborted: false,
      processedCount: 0,
      totalCount: 0,
      currentItemLabel: '',
      successCount: 0,
      errorResults: [],
      showResults: false,
      generatedFiles: [],
    };
  },
  computed: {
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
  methods: {
    close() {
      this.$emit('close');
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

      // Filter valid rows
      const validRows = this.parsedRows.filter(row => this.validateRow(row));
      this.totalCount = validRows.length;

      // Import model worker
      const modelWorker = (await import('@/model-worker')).default;

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
              const svgData = svgLoader.parse(svgMarkup);

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
              rowOptions.code.iconShapes = processedShapes;
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

      this.isProcessing = false;
      this.showResults = true;
    },

    generateModelAsync(modelWorker, qrCodeBitMask, options) {
      return new Promise((resolve, reject) => {
        let timeoutId;

        // Store original handler to restore later
        const originalHandler = modelWorker.worker.onmessage;

        const handler = (event) => {
          console.log('[Batch] Worker message received:', event.data);

          // Guard against undefined or malformed messages
          if (!event.data || typeof event.data !== 'object') {
            console.log('[Batch] Ignoring non-object message');
            return;
          }

          if (event.data.type !== 'result') {
            console.log('[Batch] Ignoring non-result message, type:', event.data.type);
            return;
          }

          // Clear timeout since we got a response
          clearTimeout(timeoutId);

          // Restore original handler
          modelWorker.worker.onmessage = originalHandler;

          const jsonLoader = new THREE.ObjectLoader();
          const { meshes } = event.data;

          if (!meshes) {
            reject(new Error('No meshes in worker response'));
            return;
          }

          const parsedMeshes = {};
          let parsed = 0;
          const meshKeys = Object.keys(meshes);
          const total = meshKeys.length;

          console.log('[Batch] Parsing', total, 'meshes:', meshKeys);

          if (total === 0) {
            reject(new Error('Empty meshes object'));
            return;
          }

          meshKeys.forEach((key) => {
            jsonLoader.parse(meshes[key], (mesh) => {
              parsedMeshes[key] = mesh;
              parsed++;
              console.log(`[Batch] Parsed mesh ${key} (${parsed}/${total})`);
              if (parsed === total) {
                resolve(parsedMeshes);
              }
            });
          });
        };

        // Take over the worker's message handler
        modelWorker.worker.onmessage = handler;

        console.log('[Batch] Sending to worker:', { mode: 'QR', optionsKeys: Object.keys(options) });
        modelWorker.send({
          mode: 'QR',
          qrCodeBitMask: qrCodeBitMask,
          options: options,
        });

        // Timeout after 30 seconds
        timeoutId = setTimeout(() => {
          console.error('[Batch] Model generation timeout after 30s');
          // Restore original handler on timeout too
          modelWorker.worker.onmessage = originalHandler;
          reject(new Error('Model generation timeout'));
        }, 30000);
      });
    },

    async exportToBuffer(meshes, filename) {
      const exportAsBinary = this.stlType === 'binary';

      if (this.multipleParts) {
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
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
  },
};
</script>

<style scoped>
.modal-card-body {
  min-height: 300px;
}

.table-container {
  max-height: 300px;
  overflow: auto;
}

.table th, .table td {
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress {
  margin: 20px 0;
}
</style>
