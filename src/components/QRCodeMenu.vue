/* eslint-disable import/no-webpack-loader-syntax */
<template>
  <div id="qrcodeMenu">

    <button
      class="button is-info is-medium is-fullwidth mb-3"
      @click="openQRScanner">
      <span class="icon">
        <i class="fa fa-camera"></i>
      </span>
      <span>{{$t('copyExistingQRCode')}}</span>
    </button>

    <!-- QR Code Options -->
    <QRCodeOptionsPanel :options="options" />

    <!-- 3D Options -->
    <QRCodeModelOptionsPanel ref="modelOptionsPanel" :options="options" :unit="unit" :iconCompatibilityStatus="iconCompatibilityStatus" />

    <div class="notification is-danger is-light" v-if="generateError" style="margin-top: 20px 0;">
      {{generateError}}
    </div>
    <div
      class="notification is-warning is-light"
      v-if="(blockWidth && blockHeight) && (blockWidth < 2 || blockHeight < 2)"
    >
      <strong>{{$t('printabilityWarning')}}:</strong>
      {{$t('printabilityWarningBody', { dimensions: `${Number(blockWidth).toFixed(1)}mm x ${Number(blockHeight).toFixed(1)}mm` })}}
    </div>

    <button
      class="button is-success is-large"
      v-bind:class="{'is-loading': isGenerating}"
      @click="generate3dModel"
    >
      <span class="icon">
        <i class="fa fa-cube"></i>
      </span>
      <span>{{$t('generateButton')}}</span>
    </button>

    <div class="box mt-3" v-bind:class="{'is-hidden': mesh === null}" style="width: fit-content">
      <figure class="image is-128x128" title="A QR Code in 2D? How lame ;)">
        <img id="qr-image"/>
      </figure>
    </div>

    <ScannerModal v-if="scannerModalVisible" @decode="onDecode"/>
  </div>
</template>

<script>
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import qrcode from 'qrcode';
import vcardjs from 'vcards-js';
import { diff } from 'deep-object-diff';
import merge from 'deepmerge';
import JSZip from 'jszip';
import modelWorker from '@/model-worker';
import { bus } from '../main';
import { save, saveAsString, saveAsArrayBuffer } from '../utils';
import { nextTick } from 'vue';

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

export default {
  name: 'QRCodeMenu',
  props: {
    initData: Object,
    scene: Object,
    exporter: Object,
  },
  components: {
    QRCodeOptionsPanel: () => import('./QRCodeOptionsPanel.vue'),
    QRCodeModelOptionsPanel: () => import('./QRCodeModelOptionsPanel.vue'),
    ScannerModal: () => import('./ScannerModal.vue'),
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
      qrCodeBitMask: null,
      unit: 'mm',
      mesh: null,
      baseMesh: null,
      qrcodeMesh: null,
      borderMesh: null,
      iconMesh: null,
      subtitleMesh: null,
      keychainAttachmentMesh: null,
      stlType: 'binary',
      dualExtrusion: false,
      blockWidth: null,
      blockHeight: null,
      isGenerating: false,
      generateError: null,
      scannerModalVisible: false,
      iconCompatibilityStatus: null,
    };
  },

  methods: {
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
    initWorker() {
      modelWorker.worker.onmessage = (event) => {
        if (event.data.type !== 'result') {
          return;
        }
        this.$emit('resetScene');
        const jsonLoader = new THREE.ObjectLoader();
        const { meshes } = event.data;
        let i = 0;
        Object.keys(meshes).forEach((key) => {
          jsonLoader.parse(meshes[key], (parsed) => {
            meshes[key] = parsed;
            i += 1;
            if (key !== 'combined') {
              this.scene.add(meshes[key]);
            }
            if (i === event.data.meshCount) {
              this.mesh = meshes.combined;
              this.baseMesh = meshes.base;
              this.qrcodeMesh = meshes.qrcode;
              this.borderMesh = meshes.border;
              this.iconMesh = meshes.icon;
              this.subtitleMesh = meshes.subtitle;
              this.keychainAttachmentMesh = meshes.keychainAttachment;
              this.iconCompatibilityStatus = event.data.iconCompatibilityStatus;
              this.isGenerating = false;
            }
          });
        });
        this.$emit('exportReady', diff(defaultOptions, this.options));
      };
    },
    setup3dObject() {
      modelWorker.send({
        mode: 'QR',
        qrCodeBitMask: this.qrCodeBitMask,
        options: this.options,
      });
    },
    async generate3dModel() {
      this.$emit('generating');

      this.generateError = null;
      this.isGenerating = true;

      const txt = this.getQRText();
      if (txt === '') {
        this.isGenerating = false;
        this.generateError = 'You have not entered any text.';
        return;
      }

      if (this.options.code.iconName !== 'none') {
        this.options.errorCorrectionLevel = 'H';
        try {
          const svgLoader = new SVGLoader();
          const iconPreview = document.querySelector('#icon-preview');

          // Wait for SVG to load if needed
          if (!iconPreview || !iconPreview.contentDocument) {
            console.warn('Icon preview not loaded yet, retrying...');
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          let svgMarkup;
          
          // Check if it's a custom icon
          if (this.options.code.iconName.startsWith('custom-')) {
            // Get custom icon content from the options panel
            const customIconContent = this.getCustomIconContent(this.options.code.iconName);
            if (customIconContent) {
              svgMarkup = customIconContent;
            } else {
              throw new Error('Custom icon content not found');
            }
          } else {
            // Handle default icons
            if (iconPreview && iconPreview.contentDocument) {
              const svgElement = iconPreview.contentDocument.querySelector('svg');
              if (svgElement) {
                svgMarkup = svgElement.outerHTML;
              } else {
                // Fallback: load SVG directly from file
                const response = await fetch(`icons/${this.options.code.iconName}.svg`);
                svgMarkup = await response.text();
              }
            } else {
              // Fallback: load SVG directly from file
              const response = await fetch(`icons/${this.options.code.iconName}.svg`);
              svgMarkup = await response.text();
            }
          }

          const svgData = svgLoader.parse(svgMarkup);

          // Use SVGLoader.createShapes for proper hole handling (r127+)
          const processedShapes = [];

          svgData.paths.forEach(path => {
            try {
              // Use the modern createShapes method
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

          this.options.code.iconShapes = processedShapes;
        } catch (error) {
          console.error(`Error processing ${this.options.code.iconName} icon:`, error);
          // Reset to no icon on error
          this.options.code.iconName = 'none';
          this.options.code.iconShapes = null;
        }
      }

      try {
        console.time('2D QR Code Generation');
        const qrCodeObject = await qrcode.create(txt, {
          errorCorrectionLevel: this.options.errorCorrectionLevel,
        });
        this.qrCodeBitMask = qrCodeObject.modules.data;
        qrcode.toDataURL(txt, {
          errorCorrectionLevel: this.options.errorCorrectionLevel,
          margin: 1,
        }, (err, url) => {
          console.timeEnd('2D QR Code Generation');
          if (err) {
            throw err;
          }
          const img = document.getElementById('qr-image');
          img.src = url;
        });
      } catch (e) {
        this.generateError = `Error during generation: ${e.message}`;
        this.isGenerating = false;
        return;
      }

      nextTick(() => {
        // this.init3d();
        this.setup3dObject();
        // this.startAnimation();
      });
    },
    exportSTL(stlType, multipleParts) {
      const timestamp = new Date().getTime();
      const exportAsBinary = (stlType === 'binary');

      if (multipleParts) {
        const zip = new JSZip();
        const filenameBase = `base-${timestamp}.stl`;
        const filenameQrcode = `qrcode-${timestamp}.stl`;
        const filenameBorder = `border-${timestamp}.stl`;
        const filenameIcon = `icon-${timestamp}.stl`;
        const filenameText = `text-${timestamp}.stl`;
        const filenameKeychain = `attachment-${timestamp}.stl`;

        const put = (name, data) => {
          if (exportAsBinary) {
            // data may be ArrayBuffer, DataView, or a typed array
            const content = (data && data.buffer) ? data.buffer : data;
            zip.file(name, content, { binary: true });
          } else {
            // ASCII export returns a string
            zip.file(name, data);
          }
        };

        const baseSTL = this.exporter.parse(this.baseMesh, { binary: exportAsBinary });
        const qrcodeSTL = this.exporter.parse(this.qrcodeMesh, { binary: exportAsBinary });
        put(filenameBase, baseSTL);
        put(filenameQrcode, qrcodeSTL);

        if (this.borderMesh) {
          const borderSTL = this.exporter.parse(this.borderMesh, { binary: exportAsBinary });
          put(filenameBorder, borderSTL);
        }

        if (this.iconMesh) {
          const iconSTL = this.exporter.parse(this.iconMesh, { binary: exportAsBinary });
          put(filenameIcon, iconSTL);
        }

        if (this.subtitleMesh) {
          const textSTL = this.exporter.parse(this.subtitleMesh, { binary: exportAsBinary });
          put(filenameText, textSTL);
        }

        if (this.keychainAttachmentMesh) {
          const kcaSTL = this.exporter.parse(this.keychainAttachmentMesh, { binary: exportAsBinary });
          put(filenameKeychain, kcaSTL);
        }

        zip.generateAsync({ type: 'blob' })
          .then((content) => {
            save(new Blob([content]), `qrcode2stl-${timestamp}.zip`);
          });
      } else {
        const filename = `combined-${timestamp}.stl`;
        const result = this.exporter.parse(this.mesh, { binary: exportAsBinary });
        if (exportAsBinary) {
          saveAsArrayBuffer(result, filename);
        } else {
          saveAsString(result, filename);
        }
      }
    },
    openQRScanner() {
      this.scannerModalVisible = true;
    },
    onDecode(decodedText) {
      this.options.text = decodedText;
      this.options.activeTabIndex = 0;
    },
    wifiQREscape(str) {
      const regex = /([:|\\|;|,|"])/gm;
      const subst = '\\$1';
      const result = str.replace(regex, subst);
      return result;
    },
    generateICalString() {
      const calendar = this.options.calendar;

      // Validate required fields
      if (!calendar.eventName || !calendar.startDate || !calendar.endDate) {
        return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//QRCode2STL//printer.tools//EN\r\nEND:VCALENDAR';
      }

      // Helper function to format date for iCal
      const formatICalDate = (date, time, allDay) => {
        if (allDay) {
          // For all-day events, use YYYYMMDD format
          return date.replace(/-/g, '');
        } else {
          // For timed events, use YYYYMMDDTHHMMSSZ format
          const dateTime = `${date}T${time}:00`;
          return new Date(dateTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }
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
    getQRText() {
      const vCard = vcardjs();
      let ret = '';
      switch (this.options.activeTabIndex) {
        case 0: // Text
          ret = this.options.text;
          if (this.options.useEscapeSequences) {
            ret = this.interpretEscapeSequences(ret);
          }
          break;
        case 1: // Wifi
          if (this.options.wifi.password === '') {
            this.options.wifi.security = 'nopass';
          }
          if (this.options.wifi.security === 'nopass') {
            this.options.wifi.password = '';
          }
          ret = `WIFI:S:${this.wifiQREscape(
            this.options.wifi.ssid,
          )};T:${this.wifiQREscape(this.options.wifi.security)};P:${this.wifiQREscape(
            this.options.wifi.password,
          )};H:${this.options.wifi.hidden ? 'true' : 'false'};`;
          break;
        case 2: // E-Mail
          ret = `mailto:${this.options.email.recipient
            .split(',')
            .map((x) => x.trim())
            .join(',')}?subject=${encodeURI(
            this.options.email.subject,
          )}&body=${encodeURI(this.options.email.body)}`;
          break;
        case 3: // Contact
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

          // vCard.socialUrls.facebook = 'https://...';
          // vCard.socialUrls.linkedIn = 'https://...';
          // vCard.socialUrls.twitter = 'https://...';
          // vCard.socialUrls.flickr = 'https://...';
          // vCard.socialUrls.custom = 'https://...';

          vCard.version = '3.0'; // can also support 2.1 and 4.0, certain versions only support certain fields

          ret = vCard.getFormattedString();
          break;
        case 4: // SMS
          ret = `SMSTO:${this.options.sms.recipient}:${this.options.sms.message}`;
          break;
        case 5: // Calendar
          ret = this.generateICalString();
          break;
        default:
          break;
      }

      console.log('QR Code String:', ret);
      return ret;
    },
    getCustomIconContent(iconName) {
      // This method will be called by the QRCodeModelOptionsPanel component
      // We need to access the custom icons from the child component
      const modelOptionsPanel = this.$refs.modelOptionsPanel;
      if (modelOptionsPanel && modelOptionsPanel.getCustomIconContent) {
        return modelOptionsPanel.getCustomIconContent(iconName);
      }
      return null;
    },
  },
  watch: {
    'options.code.compatibilityMode': {
      handler(newValue, oldValue) {
        // Only regenerate if the value actually changed and we have a mesh
        if (newValue !== oldValue && this.mesh !== null) {
          console.log('Compatibility mode changed, regenerating model...');
          this.generate3dModel();
        }
      }
    }
  },
  async mounted() {
    this.initWorker();
    if (this.initData && this.initData.mode === 'QR') {
      delete this.initData.mode;
      this.options = merge(this.options, this.initData);
      this.generate3dModel();
    }
    bus.$on('openScannerModal', () => { this.scannerModalVisible = true; });
    bus.$on('closeScannerModal', () => { this.scannerModalVisible = false; });
  },
};
</script>

<style scoped>
#main {
  margin-top: 20px;
}

.export-button {
  margin: 0 10px;
}

#notifications {
  margin-top: 10px;
}

.field-label {
  text-align: left;
}

#mode-buttons>button {
  margin-right: 20px;
}
</style>
