<template>
  <div id="qrcodeMenu" class="mode-panel">
    <section class="content-card" :aria-label="$t('contentLabel')">
      <div class="content-card__head">
        <span class="content-card__title">
          <UiIcon :name="contentTypeIcon" />
          {{ $t('contentLabel') }}
        </span>
        <QRCodeOptionsTabs :active-tab-index="options.activeTabIndex" @tabChanged="setActiveTab" />
      </div>
      <QRCodeOptionsPanel :options="options" />
      <transition name="rise">
        <div v-if="generateError" class="notice notice--danger" role="alert">
          <UiIcon name="circle-x" />
          <span>{{ generateError }}</span>
        </div>
      </transition>
    </section>

    <UiTabs class="mode-tabs" :value="currentTab" :tabs="tabs" :aria-label="$t('settingsPanel')" @input="selectTab" />

    <div class="tab-panels">
      <div v-show="currentTab === 'content'" class="tab-panel" role="tabpanel">
        <div class="tab-panel__body">
          <button type="button" class="btn btn--block scan-button" @click="openQRScanner">
            <UiIcon name="camera" />
            <span>{{ $t('copyExistingQRCode') }}</span>
          </button>

          <UiField :label="$t('errorCorrection')" :title="'errorCorrectionLevel — ' + $t('errorCorrection')" stack>
            <UiSegmented
              :value="effectiveErrorCorrection"
              block
              :options="errorCorrectionOptions"
              :aria-label="$t('errorCorrection')"
              :title="'errorCorrectionLevel — ' + $t('errorCorrection')"
              @input="options.errorCorrectionLevel = $event"
            />
            <template #hint>
              <strong class="ec-current">{{ errorCorrectionDescription }}</strong>
              {{ $t('errorCorrectionHelp') }}
            </template>
          </UiField>
          <transition name="rise">
            <div v-if="hasIcon" class="notice notice--info">
              <UiIcon name="info" />
              <span>{{ $t('errorCorrectionIconLocked') }}</span>
            </div>
          </transition>

          <div class="tab-panel__divider"></div>

          <UiField
            :label="$t('useEscapeSequences')"
            :title="'useEscapeSequences — ' + $t('useEscapeSequences')"
            :hint="$t('useEscapeSequencesHelp')"
          >
            <UiToggle
              v-model="options.useEscapeSequences"
              :aria-label="$t('useEscapeSequencesToggle')"
              :title="'useEscapeSequences — ' + $t('useEscapeSequences')"
            />
          </UiField>
        </div>
      </div>

      <div v-show="currentTab === 'model'" class="tab-panel" role="tabpanel">
        <QRCodeModelOptionsPanel
          ref="modelOptionsPanel"
          :options="options"
          :unit="unit"
          :icon-compatibility-status="iconCompatibilityStatus"
          :printability-warning="printabilityWarning"
        />
      </div>

      <div v-show="currentTab === 'extras'" class="tab-panel" role="tabpanel">
        <CodeStyleOptions :options="options" :unit="unit" show-block-size show-compatibility />
      </div>
    </div>

    <transition name="modal" :duration="{ enter: 300, leave: 180 }">
      <ScannerModal v-if="scannerModalVisible" @decode="onDecode" />
    </transition>

    <transition name="modal" :duration="{ enter: 300, leave: 180 }">
      <BatchModeModal
        v-if="batchModalVisible"
        :options="options"
        :activeTabIndex="options.activeTabIndex"
        :exporter="exporter"
        :stlType="stlType"
        :multipleParts="multipleParts"
        @close="batchModalVisible = false"
      />
    </transition>
  </div>
</template>

<script>
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import qrcode from 'qrcode';
import vcardjs from 'vcards-js';
import merge from 'deepmerge';
import { bus } from '../main';
import { trimIconShapesBounds } from '../utils';
import menuMixin, { hasValidNumbers } from './menuMixin';
import QRCodeOptionsPanel from './QRCodeOptionsPanel.vue';
import QRCodeOptionsTabs from './QRCodeOptionsTabs.vue';
import QRCodeModelOptionsPanel from './QRCodeModelOptionsPanel.vue';
import CodeStyleOptions from './sections/CodeStyleOptions.vue';
import UiIcon from './ui/UiIcon.vue';
import UiTabs from './ui/UiTabs.vue';
import UiField from './ui/UiField.vue';
import UiSegmented from './ui/UiSegmented.vue';
import UiToggle from './ui/UiToggle.vue';

const defaultOptions = {
  activeTabIndex: 0,
  errorCorrectionLevel: 'M',
  useEscapeSequences: false,
  text: '',
  wifi: {
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false,
  },
  email: {
    recipient: '',
    subject: '',
    body: '',
  },
  contact: {
    firstName: '',
    lastName: '',
    organization: '',
    role: '',
    cell: '',
    phone: '',
    fax: '',
    email: '',
    street: '',
    postcode: '',
    city: '',
    state: '',
    country: '',
    website: '',
  },
  sms: {
    recipient: '',
    message: '',
  },
  calendar: {
    eventName: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '10:00',
    allDay: false,
    location: '',
    description: '',
  },
  base: {
    shape: 'roundedRectangle',
    width: 100,
    height: 100,
    depth: 3,
    cornerRadius: 5,
    hasBorder: true,
    borderWidth: 2,
    borderDepth: 1,
    hasText: false,
    textPlacement: 'bottom',
    textMargin: 4,
    textSpacing: 5,
    textSize: 10,
    textMessage: '',
    textDepth: 1,
    textAlign: 'center',
    hasKeychainAttachment: false,
    keychainPlacement: 'left',
    keychainHoleDiameter: 6,
    keychainMaterialThickness: 1.5,
    keychainOffset: 3,
    mirrorHoles: false,
    hasNfcIndentation: false,
    nfcIndentationShape: 'square',
    nfcIndentationSize: 30,
    nfcIndentationDepth: 1,
    nfcIndentationHidden: false,
    hasMagnetPockets: false,
    magnetPocketSize: 8.2,
    magnetPocketDepth: 2.2,
    magnetPocketOffset: 10,
  },
  code: {
    depth: 1,
    margin: 5,
    blockSizeMultiplier: 100,
    iconName: 'none',
    iconSizeRatio: 20,
    iconShapes: null,
    cityMode: false,
    depthMax: 5,
    invert: false,
    compatibilityMode: false,
  },
};

const CONTENT_TYPE_ICONS = ['letter-a', 'wifi', 'mail', 'contact', 'message', 'calendar'];

// cache of default icon SVG markup, shared between generations
const iconMarkupCache = new Map();

export default {
  name: 'QRCodeMenu',
  mixins: [menuMixin],
  components: {
    QRCodeOptionsPanel,
    QRCodeOptionsTabs,
    QRCodeModelOptionsPanel,
    CodeStyleOptions,
    UiIcon,
    UiTabs,
    UiField,
    UiSegmented,
    UiToggle,
    ScannerModal: () => import('./ScannerModal.vue'),
    BatchModeModal: () => import('./BatchModeModal.vue'),
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
      blockWidth: null,
      blockHeight: null,
      scannerModalVisible: false,
      batchModalVisible: false,
      iconCompatibilityStatus: null,
      qrImageUrl: '',
    };
  },
  computed: {
    tabs() {
      return [
        { id: 'content', label: this.$t('tabContent'), icon: 'scan-line' },
        { id: 'model', label: this.$t('tabModel'), icon: 'qr-code' },
        { id: 'extras', label: this.$t('tabExtras'), icon: 'box' },
      ];
    },
    exportParts() {
      return [
        ['base', 'base'],
        ['qrcode', 'qrcode'],
        ['border', 'border'],
        ['icon', 'icon'],
        ['subtitle', 'text'],
        ['keychainAttachment', 'attachment'],
      ];
    },
    contentTypeIcon() {
      return CONTENT_TYPE_ICONS[this.options.activeTabIndex] || 'letter-a';
    },
    hasIcon() {
      return this.options.code.iconName !== 'none';
    },
    // icons cover part of the code, so they always need the highest level.
    // The chosen level is kept and applies again once the icon is removed.
    effectiveErrorCorrection() {
      return this.hasIcon ? 'H' : this.options.errorCorrectionLevel;
    },
    errorCorrectionOptions() {
      return [
        { value: 'L', label: 'L', tip: 'L (Low, 7% redundant)' },
        { value: 'M', label: 'M', tip: 'M (Medium, 15% redundant)' },
        { value: 'Q', label: 'Q', tip: 'Q (Quartile, 25% redundant)' },
        { value: 'H', label: 'H', tip: 'H (High, 30% redundant)' },
      ].map((option) => ({ ...option, disabled: this.hasIcon && option.value !== 'H' }));
    },
    errorCorrectionDescription() {
      const option = this.errorCorrectionOptions.find((item) => item.value === this.effectiveErrorCorrection);
      return option ? option.tip : '';
    },
    printabilityWarning() {
      if (!(this.blockWidth && this.blockHeight) || (this.blockWidth >= 2 && this.blockHeight >= 2)) {
        return '';
      }
      return `${this.$t('printabilityWarning')}: ${this.$t('printabilityWarningBody', { dimensions: `${Number(this.blockWidth).toFixed(1)}mm x ${Number(this.blockHeight).toFixed(1)}mm` })}`;
    },
  },
  watch: {
    // QR codes are square: the base height follows the width
    'options.base.width': function syncHeight(width) {
      this.options.base.height = width;
    },
    'options.code.compatibilityMode': {
      handler(newValue, oldValue) {
        // Without live updates, regenerate right away so the icon compatibility info is current
        if (newValue !== oldValue && this.hasModel && !this.liveUpdate) {
          this.generate3dModel();
        }
      },
    },
  },
  mounted() {
    bus.$on('openScannerModal', this.openQRScanner);
    bus.$on('closeScannerModal', this.closeQRScanner);
    bus.$on('openBatchMode', this.openBatchMode);
  },
  activated() {
    if (this.qrImageUrl) {
      this.$emit('qr-image', this.qrImageUrl);
    }
  },
  beforeDestroy() {
    bus.$off('openScannerModal', this.openQRScanner);
    bus.$off('closeScannerModal', this.closeQRScanner);
    bus.$off('openBatchMode', this.openBatchMode);
  },
  methods: {
    getExportableOptions() {
      return JSON.parse(JSON.stringify(this.options));
    },
    importOptions(newOptions) {
      this.options = merge(this.options, newOptions);
    },
    setActiveTab(idx) {
      this.options.activeTabIndex = idx;
    },
    signatureSource() {
      // iconShapes is derived from the icon during generation and must not mark the model as outdated
      const code = { ...this.options.code };
      delete code.iconShapes;
      return {
        ...this.options,
        // icons always force the highest error correction level
        errorCorrectionLevel: this.effectiveErrorCorrection,
        code,
      };
    },
    isReadyForAutoUpdate() {
      return hasValidNumbers(this.options, defaultOptions) && this.getQRText(false) !== '';
    },
    interpretEscapeSequences(str) {
      if (typeof str !== 'string') return str;
      try {
        // Handle unicode (\uXXXX) and hex (\xXX) sequences first
        let out = str
          .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
          .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

        // Then handle common single-character escapes
        const map = {
          n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v',
          "'": "'", '"': '"', '\\': '\\',
        };
        out = out.replace(/\\([nrtbfv'"\\])/g, (m, ch) => map[ch] ?? m);
        return out;
      } catch (e) {
        // Fallback: return original if anything goes wrong
        return str;
      }
    },
    async loadIconMarkup(iconName) {
      // Check if it's a custom icon
      if (iconName.startsWith('custom-')) {
        const customIconContent = this.getCustomIconContent(iconName);
        if (!customIconContent) {
          throw new Error('Custom icon content not found');
        }
        return customIconContent;
      }
      if (!iconMarkupCache.has(iconName)) {
        const response = await fetch(`icons/${iconName}.svg`);
        iconMarkupCache.set(iconName, await response.text());
      }
      return iconMarkupCache.get(iconName);
    },
    async generate3dModel() {
      const ticket = this.beginGeneration();

      const txt = this.getQRText();
      if (txt === '') {
        this.failGeneration(ticket, this.$t('errorNoText'));
        this.$nextTick(() => {
          const input = this.$el.querySelector('.content-textarea');
          if (input) {
            input.focus();
          }
        });
        return;
      }

      const errorCorrectionLevel = this.effectiveErrorCorrection;
      if (this.options.code.iconName !== 'none') {
        try {
          const svgMarkup = await this.loadIconMarkup(this.options.code.iconName);
          // the fill color is irrelevant for the geometry; avoids THREE.Color warnings
          const svgData = new SVGLoader().parse(svgMarkup.replace(/currentColor/g, '#000'));

          // Use SVGLoader.createShapes for proper hole handling (r127+)
          const processedShapes = [];
          svgData.paths.forEach((path) => {
            try {
              SVGLoader.createShapes(path).forEach((shape) => {
                processedShapes.push({
                  shape: shape.toJSON(),
                  holes: shape.holes ? shape.holes.map((hole) => hole.toJSON()) : [],
                });
              });
            } catch (pathError) {
              console.warn('Error processing SVG path:', pathError);
            }
          });

          this.options.code.iconShapes = trimIconShapesBounds(processedShapes);
        } catch (error) {
          console.error(`Error processing ${this.options.code.iconName} icon:`, error);
          // Reset to no icon on error
          this.options.code.iconName = 'none';
          this.options.code.iconShapes = null;
        }
      }

      let qrCodeBitMask;
      try {
        console.time('2D QR Code Generation');
        const qrCodeObject = await qrcode.create(txt, {
          errorCorrectionLevel,
        });
        qrCodeBitMask = qrCodeObject.modules.data;
        this.qrImageUrl = await qrcode.toDataURL(txt, {
          errorCorrectionLevel,
          margin: 1,
          width: 512,
        });
        console.timeEnd('2D QR Code Generation');
        this.$emit('qr-image', this.qrImageUrl);
      } catch (e) {
        this.failGeneration(ticket, `Error during generation: ${e.message}`);
        return;
      }

      await this.requestModel(ticket, {
        mode: 'QR',
        qrCodeBitMask,
        options: this.options,
      });
    },
    onModelResult(result) {
      this.iconCompatibilityStatus = result.iconCompatibilityStatus;
      this.blockWidth = result.blockSize;
      this.blockHeight = result.blockSize;
    },
    openQRScanner() {
      this.scannerModalVisible = true;
    },
    closeQRScanner() {
      this.scannerModalVisible = false;
    },
    openBatchMode() {
      if (this.isActive) {
        this.batchModalVisible = true;
      }
    },
    onDecode(decodedText) {
      this.options.text = decodedText;
      this.options.activeTabIndex = 0;
      bus.$emit('toast', { type: 'success', message: this.$t('decodedQRCodeData') });
    },
    wifiQREscape(str) {
      const regex = /([:|\\|;|,|"])/gm;
      const subst = '\\$1';
      const result = str.replace(regex, subst);
      return result;
    },
    generateICalString() {
      const { calendar } = this.options;

      // Validate required fields
      if (!calendar.eventName || !calendar.startDate || !calendar.endDate) {
        return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//QRCode2STL//printer.tools//EN\r\nEND:VCALENDAR';
      }

      // Helper function to format date for iCal
      const formatICalDate = (date, time, allDay) => {
        if (allDay) {
          // For all-day events, use YYYYMMDD format
          return date.replace(/-/g, '');
        }
        // For timed events, use YYYYMMDDTHHMMSSZ format
        const dateTime = `${date}T${time}:00`;
        return `${new Date(dateTime).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
      };

      // Helper function to escape special characters in iCal
      const escapeICalString = (str) => {
        if (!str) return '';
        return str
          .replace(/\\/g, '\\\\')
          .replace(/;/g, '\\;')
          .replace(/,/g, '\\,')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '');
      };

      // Generate unique identifier
      const uid = Date.now().toString(36);

      // Format dates
      const dtstart = formatICalDate(calendar.startDate, calendar.startTime, calendar.allDay);
      let dtend = formatICalDate(calendar.endDate, calendar.endTime, calendar.allDay);

      // For all-day events, add one day to end date (iCal standard)
      if (calendar.allDay) {
        const endDate = new Date(calendar.endDate);
        endDate.setDate(endDate.getDate() + 1);
        dtend = endDate.toISOString().split('T')[0].replace(/-/g, '');
      }

      // Build iCal string
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
    getQRText(log = true) {
      let ret = '';
      switch (this.options.activeTabIndex) {
        case 0: // Text
          ret = this.options.text;
          if (this.options.useEscapeSequences) {
            ret = this.interpretEscapeSequences(ret);
          }
          break;
        case 1: { // Wifi
          // an empty password means an open network
          const security = this.options.wifi.password === '' ? 'nopass' : this.options.wifi.security;
          const password = security === 'nopass' ? '' : this.options.wifi.password;
          ret = `WIFI:S:${this.wifiQREscape(
            this.options.wifi.ssid,
          )};T:${this.wifiQREscape(security)};P:${this.wifiQREscape(
            password,
          )};H:${this.options.wifi.hidden ? 'true' : 'false'};`;
          break;
        }
        case 2: // E-Mail
          ret = `mailto:${this.options.email.recipient
            .split(',')
            .map((x) => x.trim())
            .join(',')}?subject=${encodeURI(
            this.options.email.subject,
          )}&body=${encodeURI(this.options.email.body)}`;
          break;
        case 3: { // Contact
          const vCard = vcardjs();
          vCard.firstName = this.options.contact.firstName;
          vCard.lastName = this.options.contact.lastName;
          vCard.organization = this.options.contact.organization;
          vCard.url = this.options.contact.website;
          vCard.role = this.options.contact.role;

          vCard.homePhone = this.options.contact.phone;
          vCard.cellPhone = this.options.contact.cell;
          vCard.homeFax = this.options.contact.fax;

          vCard.email = this.options.contact.email;

          vCard.homeAddress.street = this.options.contact.street;
          vCard.homeAddress.city = this.options.contact.city;
          vCard.homeAddress.stateProvince = this.options.contact.state;
          vCard.homeAddress.postalCode = this.options.contact.postcode;
          vCard.homeAddress.countryRegion = this.options.contact.country;

          vCard.version = '3.0'; // can also support 2.1 and 4.0, certain versions only support certain fields

          ret = vCard.getFormattedString();
          break;
        }
        case 4: // SMS
          ret = `SMSTO:${this.options.sms.recipient}:${this.options.sms.message}`;
          break;
        case 5: // Calendar
          ret = this.generateICalString();
          break;
        default:
          break;
      }

      if (log) {
        console.log('QR Code String:', ret);
      }
      return ret;
    },
    getCustomIconContent(iconName) {
      // The custom icons live in the model options panel
      const { modelOptionsPanel } = this.$refs;
      if (modelOptionsPanel && modelOptionsPanel.getCustomIconContent) {
        return modelOptionsPanel.getCustomIconContent(iconName);
      }
      return null;
    },
  },
};
</script>
