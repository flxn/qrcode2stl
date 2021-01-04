/* eslint-disable import/no-webpack-loader-syntax */
<template>
  <div id="qrcodeMenu">
    <!-- QR Code Options -->
    <QRCodeOptionsPanel :options="options" />
    <!-- 3D Options -->
    <QRCode3DOptionsPanel :options="options" :unit="unit" />

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
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import qrcode from 'qrcode';
import vcardjs from 'vcards-js';
import { diff } from 'deep-object-diff';
import merge from 'deepmerge';
import JSZip from 'jszip';
import modelWorker from '@/model-worker';
import QRCodeOptionsPanel from './QRCodeOptionsPanel.vue';
// 3D settings panel
import QRCode3DOptionsPanel from './QRCode3DOptionsPanel.vue';

const defaultOptions = {
  activeTabIndex: 0,
  errorCorrectionLevel: 'M',
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
    textMargin: 2,
    textSize: 8,
    textMessage: '',
    textDepth: 1,
    hasKeychainAttachment: false,
    keychainPlacement: 'left',
    keychainHoleDiameter: 6,
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
  },
};

export default {
  name: 'QRCodeMenu',
  props: {
    initData: Object,
  },
  components: {
    QRCodeOptionsPanel,
    QRCode3DOptionsPanel,
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
      qrCodeBitMask: null,
      exporter: null,
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
      camera: null,
      scene: null,
      renderer: null,
      animationFrameId: null,
      animationTimer: null,
      blockWidth: null,
      blockHeight: null,
      isGenerating: false,
      generateError: null,
      changelogModalVisible: false,
    };
  },

  methods: {
    initWorker() {
      modelWorker.worker.onmessage = (event) => {
        if (event.data.type !== 'result') {
          return;
        }
        const jsonLoader = new THREE.ObjectLoader();
        const { meshes } = event.data;
        let i = 0;
        console.log(meshes);
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
              this.isGenerating = false;
            }
          });
        });
      };
    },
    init3d() {
      this.reset3d();
      const container = document.getElementById('container3d');

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.rotation.z = -Math.PI / 2;

      // LIGHTS
      const ambientLight = new THREE.AmbientLight(0x333333);
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
      directionalLight.position.x = -1;
      directionalLight.position.y = 0;
      directionalLight.position.z = 1;
      this.scene.add(ambientLight);
      this.scene.add(directionalLight);

      const grid = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      grid.rotation.x = Math.PI / 2;
      this.scene.add(grid);

      this.camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        1,
        1000,
      );
      this.camera.position.set(0, 0, 200);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    reset3d() {
      clearTimeout(this.animationTimer);
      cancelAnimationFrame(this.animationFrameId);
      this.scene = null;
      this.mesh = null;
      this.camera = null;
      this.scene = null;
      this.renderer = null;
      const elem = document.getElementById('container3d');
      while (elem.lastChild) elem.removeChild(elem.lastChild);
    },
    setup3dObject() {
      modelWorker.send({
        mode: 'QR',
        qrCodeBitMask: this.qrCodeBitMask,
        options: this.options,
      });
    },
    startAnimation() {
      const animate = () => {
        // limit animation to 60 FPS
        this.animationTimer = setTimeout(() => {
          this.animationFrameId = requestAnimationFrame(animate);
        }, 1000 / 60);
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    },
    getSettingsString() {
      let settingsString = '';
      Object.keys(this.options).forEach((topLevelKey) => {
        Object.keys(this.options[topLevelKey]).forEach((subLevelKey) => {
          settingsString += `${topLevelKey}_${subLevelKey}:${this.options[topLevelKey][subLevelKey]} `;
        });
      });
      return settingsString;
    },
    trackGenerateEvent() {
      // eslint-disable-next-line no-underscore-dangle
      window._paq.push(['trackEvent', 'qrcode2stl', 'Generate', this.getSettingsString()]);
    },
    trackExportEvent() {
      // eslint-disable-next-line no-underscore-dangle
      window._paq.push(['trackEvent', 'qrcode2stl', 'Export', this.getSettingsString()]);
    },
    async generate3dModel() {
      this.$emit('generating');
      this.trackGenerateEvent();

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
        const svgLoader = new SVGLoader();
        const svgMarkup = document.querySelector('#icon-preview').contentDocument.querySelector('svg').outerHTML;
        const svgData = svgLoader.parse(svgMarkup);
        const shapes = svgData.paths.map((p) => p.toShapes(true, true)).flat();
        this.options.code.iconShapes = shapes.map((s) => s.toJSON());
      }

      try {
        const qrCodeObject = await qrcode.create(txt, {
          errorCorrectionLevel: this.options.errorCorrectionLevel,
        });
        this.qrCodeBitMask = qrCodeObject.modules.data;
        qrcode.toDataURL(txt, {
          errorCorrectionLevel: this.options.errorCorrectionLevel,
          margin: 1,
        }, (err, url) => {
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

      setTimeout(() => {
        this.init3d();
        this.setup3dObject();
        this.startAnimation();
        console.log(defaultOptions, this.options);
        this.$emit('exportReady', diff(defaultOptions, this.options));
      }, 100);
    },
    exportSTL(stlType, multipleParts) {
      this.trackExportEvent();
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
        const baseSTL = this.exporter.parse(this.baseMesh, { binary: exportAsBinary });
        const qrcodeSTL = this.exporter.parse(this.qrcodeMesh, { binary: exportAsBinary });
        zip.file(filenameBase, baseSTL.buffer);
        zip.file(filenameQrcode, qrcodeSTL.buffer);

        if (this.borderMesh) {
          const borderSTL = this.exporter.parse(this.borderMesh, { binary: exportAsBinary });
          zip.file(filenameBorder, borderSTL.buffer);
        }

        if (this.iconMesh) {
          const iconSTL = this.exporter.parse(this.iconMesh, { binary: exportAsBinary });
          zip.file(filenameIcon, iconSTL.buffer);
        }

        if (this.subtitleMesh) {
          const textSTL = this.exporter.parse(this.subtitleMesh, { binary: exportAsBinary });
          zip.file(filenameText, textSTL.buffer);
        }

        if (this.keychainAttachmentMesh) {
          const kcaSTL = this.exporter.parse(this.keychainAttachmentMesh, { binary: exportAsBinary });
          zip.file(filenameKeychain, kcaSTL.buffer);
        }

        zip.generateAsync({ type: 'blob' })
          .then((content) => {
            this.save(new Blob([content]), `qrcode2stl-${timestamp}.zip`);
          });
      } else {
        const filename = `combined-${timestamp}.stl`;
        const result = this.exporter.parse(this.mesh, { binary: exportAsBinary });
        if (exportAsBinary) {
          this.saveArrayBuffer(result, filename);
        } else {
          this.saveString(result, filename);
        }
      }
    },
    save(blob, filename) {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },
    saveString(text, filename) {
      this.save(new Blob([text], { type: 'text/plain' }), filename);
    },
    saveArrayBuffer(buffer, filename) {
      this.save(
        new Blob([buffer], { type: 'application/octet-stream' }),
        filename,
      );
    },
    wifiQREscape(str) {
      const regex = /([:|\\|;|,|"])/gm;
      const subst = '\\$1';
      const result = str.replace(regex, subst);
      return result;
    },
    getQRText() {
      const vCard = vcardjs();
      let ret = '';
      switch (this.options.activeTabIndex) {
        case 0: // Text
          ret = this.options.text;
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
        default:
          break;
      }

      console.log('QR Code String:', ret);
      return ret;
    },
  },
  async mounted() {
    this.init3d();
    this.initWorker();
    this.exporter = new STLExporter();
    this.startAnimation();
    if (this.initData && this.initData.mode === 'QR') {
      delete this.initData.mode;
      this.options = merge(this.options, this.initData);
      this.generate3dModel();
    }
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
