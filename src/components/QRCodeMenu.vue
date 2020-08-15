<template>
  <div id="qrcodeMenu">
    <!-- QR Code Options -->
    <QRCodeOptionsPanel :options="optionsQR" />
    <!-- 3D Options -->
    <QRCode3DOptionsPanel :options="options3d" :unit="unit" />

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

    <canvas id="qr-canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import qrcode from 'qrcode';
import vcardjs from 'vcards-js';
import QRCode3D from '../qrcode3d';
import QRCodeOptionsPanel from './QRCodeOptionsPanel.vue';
// 3D settings panel
import QRCode3DOptionsPanel from './QRCode3DOptionsPanel.vue';

export default {
  name: 'QRCodeMenu',
  props: {
    msg: String,
  },
  components: {
    QRCodeOptionsPanel,
    QRCode3DOptionsPanel,
  },
  data() {
    return {
      optionsQR: {
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
      },
      options3d: {
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
          mirrorHoles: false,
        },
        code: {
          depth: 1,
          margin: 5,
          blockSizeMultiplier: 100,
          iconName: 'none',
          iconSizeRatio: 20,
          cityMode: false,
          depthMax: 5,
          invert: false,
        },
      },
      workCanvas: null,
      exporter: null,
      unit: 'mm',
      mesh: null,
      baseMesh: null,
      qrcodeMesh: null,
      borderMesh: null,
      iconMesh: null,
      subtitleMesh: null,
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
      const qrcodeModel = new QRCode3D(this.workCanvas, this.options3d);
      console.time('3d Model Generation');
      qrcodeModel.generate3dModel();
      console.timeEnd('3d Model Generation');
      this.mesh = qrcodeModel.getCombinedMesh();

      this.baseMesh = qrcodeModel.baseMesh;
      this.qrcodeMesh = qrcodeModel.qrcodeMesh;
      this.borderMesh = qrcodeModel.borderMesh;
      this.iconMesh = qrcodeModel.iconMesh;
      this.subtitleMesh = qrcodeModel.subtitleMesh;

      qrcodeModel.getPartMeshes().forEach((m) => this.scene.add(m));
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
      Object.keys(this.options3d).forEach((topLevelKey) => {
        Object.keys(this.options3d[topLevelKey]).forEach((subLevelKey) => {
          settingsString += `${topLevelKey}_${subLevelKey}:${this.options3d[topLevelKey][subLevelKey]} `;
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
      this.trackGenerateEvent();
      if (this.options3d.code.iconName !== 'none') {
        this.optionsQR.errorCorrectionLevel = 'H';
      }
      this.generateError = null;
      this.isGenerating = true;
      const txt = this.getQRText();
      if (txt === '') {
        this.isGenerating = false;
        this.generateError = 'You have not entered any text.';
        return;
      }

      try {
        await qrcode.toCanvas(document.getElementById('qr-canvas'), txt, {
          margin: 0,
          scale: 1,
          errorCorrectionLevel: this.optionsQR.errorCorrectionLevel,
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
        this.$emit('exportReady');

        this.isGenerating = false;
      }, 100);
    },
    exportSTL(stlType, multipleParts) {
      this.trackExportEvent();
      const timestamp = new Date().getTime();
      const exportAsBinary = (stlType === 'binary');

      if (multipleParts) {
        const filenameBase = `base-${timestamp}.stl`;
        const filenameQrcode = `qrcode-${timestamp}.stl`;
        const filenameBorder = `border-${timestamp}.stl`;
        const filenameIcon = `icon-${timestamp}.stl`;
        const filenameText = `text-${timestamp}.stl`;
        const baseSTL = this.exporter.parse(this.baseMesh, { binary: exportAsBinary });
        const qrcodeSTL = this.exporter.parse(this.qrcodeMesh, { binary: exportAsBinary });
        if (exportAsBinary) {
          this.saveArrayBuffer(baseSTL, filenameBase);
          this.saveArrayBuffer(qrcodeSTL, filenameQrcode);
        } else {
          this.saveString(baseSTL, filenameBase);
          this.saveString(qrcodeSTL, filenameQrcode);
        }

        if (this.borderMesh) {
          const borderSTL = this.exporter.parse(this.borderMesh, { binary: exportAsBinary });
          if (exportAsBinary) {
            this.saveArrayBuffer(borderSTL, filenameBorder);
          } else {
            this.saveString(borderSTL, filenameBorder);
          }
        }

        if (this.iconMesh) {
          const iconSTL = this.exporter.parse(this.iconMesh, { binary: exportAsBinary });
          if (exportAsBinary) {
            this.saveArrayBuffer(iconSTL, filenameIcon);
          } else {
            this.saveString(iconSTL, filenameIcon);
          }
        }

        if (this.subtitleMesh) {
          const textSTL = this.exporter.parse(this.subtitleMesh, { binary: exportAsBinary });
          if (exportAsBinary) {
            this.saveArrayBuffer(textSTL, filenameText);
          } else {
            this.saveString(textSTL, filenameText);
          }
        }
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
      switch (this.optionsQR.activeTabIndex) {
        case 0: // Text
          ret = this.optionsQR.text;
          break;
        case 1: // Wifi
          if (this.optionsQR.wifi.password === '') {
            this.optionsQR.wifi.security = 'nopass';
          }
          if (this.optionsQR.wifi.security === 'nopass') {
            this.optionsQR.wifi.password = '';
          }
          ret = `WIFI:S:${this.wifiQREscape(
            this.optionsQR.wifi.ssid,
          )};T:${this.wifiQREscape(this.optionsQR.wifi.security)};P:${this.wifiQREscape(
            this.optionsQR.wifi.password,
          )};H:${this.optionsQR.wifi.hidden ? 'true' : 'false'};`;
          break;
        case 2: // E-Mail
          ret = `mailto:${this.optionsQR.email.recipient
            .split(',')
            .map((x) => x.trim())
            .join(',')}?subject=${encodeURI(
            this.optionsQR.email.subject,
          )}&body=${encodeURI(this.optionsQR.email.body)}`;
          break;
        case 3: // Contact
          vCard.firstName = this.optionsQR.contact.firstName;
          vCard.lastName = this.optionsQR.contact.lastName;
          vCard.organization = this.optionsQR.contact.organization;
          vCard.url = this.optionsQR.contact.website;
          vCard.role = this.optionsQR.contact.role;

          vCard.homePhone = this.optionsQR.contact.phone;
          vCard.cellPhone = this.optionsQR.contact.cell;
          vCard.homeFax = this.optionsQR.contact.fax;

          vCard.email = this.optionsQR.contact.email;

          vCard.homeAddress.street = this.optionsQR.contact.street;
          vCard.homeAddress.city = this.optionsQR.contact.city;
          vCard.homeAddress.stateProvince = this.optionsQR.contact.state;
          vCard.homeAddress.postalCode = this.optionsQR.contact.postcode;
          vCard.homeAddress.countryRegion = this.optionsQR.contact.country;

          // vCard.socialUrls.facebook = 'https://...';
          // vCard.socialUrls.linkedIn = 'https://...';
          // vCard.socialUrls.twitter = 'https://...';
          // vCard.socialUrls.flickr = 'https://...';
          // vCard.socialUrls.custom = 'https://...';

          vCard.version = '3.0'; // can also support 2.1 and 4.0, certain versions only support certain fields

          ret = vCard.getFormattedString();
          break;
        case 4: // SMS
          ret = `SMSTO:${this.optionsQR.sms.recipient}:${this.optionsQR.sms.message}`;
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
    this.workCanvas = document.getElementById('qr-canvas');
    this.exporter = new STLExporter();
    // await this.handleTextChanged();
    // this.setup3dObject();
    this.startAnimation();
  },
};
</script>

<style scoped>
#main {
  margin-top: 20px;
}

#container3d {
  width: 100%;
  height: 600px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#qr-canvas {
  display: none;
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
