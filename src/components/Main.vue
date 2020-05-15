<template>
  <div id="main" class="container is-fluid">
    <div class="notification is-warning">
      <i class="fa fa-exclamation-triangle"></i>
      I am investigating an issue where <strong>slicing with Cura does not work correctly when using a border</strong>. PrusaSlicer/Slic3r repairs the file automatically and does not seem to be affected.<br/>
      As a temporary workaround you can repair the stl file with Netfabb: <a href="https://service.netfabb.com/" target="_blank" rel="noopener noreferrer">https://service.netfabb.com/</a>.<br/>
      Another easy way for Windows 10 users is to repair the file with <a href="https://www.microsoft.com/en-us/p/3d-builder/9wzdncrfj3t6?activetab=pivot:overviewtab" target="_blank" rel="noopener noreferrer">3D Builder</a>:
      Just open the file and click on the popup in the bottom right corner to repair it. You can then save the file again and it should be printable now.
    </div>
    <div class="columns is-multiline">
      <div class="column is-5-widescreen is-5-fullhd is-12">
        <h1 class="title">{{ $t("title") }}</h1>
        <h2 class="subtitle">{{ $t("subtitle") }}</h2>
        <hr />
        <nav class="panel">
          <p class="panel-heading">{{ $t("qrCodeOptionsTitle") }}</p>
          <!-- QR Code settings tabs -->
          <TabsQR :active-tab-index="activeTabIndex" @tabChanged="setActiveTab" />

          <!-- Text -->
          <div class="option-pane" v-if="activeTabIndex === 0">
            <textarea
              class="textarea"
              :placeholder="$t('qrCodeTextPlaceholder')"
              v-model="text"
              style="width: 100%"
            ></textarea>
          </div>

          <!-- Wifi -->
          <div class="option-pane" v-if="activeTabIndex === 1">
            <WifiForm :wifi="wifi" />
          </div>

          <!-- E-Mail -->
          <div class="option-pane" v-if="activeTabIndex === 2">
            <EmailForm :email="email" />
          </div>

          <!-- Contact -->
          <div class="option-pane" v-if="activeTabIndex === 3">
            <ContactForm :contact="contact" />
          </div>

          <!-- SMS -->
          <div class="option-pane" v-if="activeTabIndex === 4">
            <SMSForm :sms="sms" />
          </div>

          <!-- Error Correction -->
          <div class="option-pane">
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('errorCorrection')}}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select is-small">
                      <select v-model="errorCorrectionLevel">
                        <option value="L">L (Low, 7% redundant)</option>
                        <option value="M">M (Medium, 15% redundant)</option>
                        <option value="Q">Q (Quartile, 25% redundant)</option>
                        <option value="H">H (High, 30% redundant)</option>
                      </select>
                    </div>
                    <p class="help">{{$t('errorCorrectionHelp')}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <!-- 3D Options -->
        <Panel3dOptions :options="options3d" :unit="unit" />

        <div class="notification is-danger is-light" v-if="generateError" style="margin-top: 20px 0;">
          {{generateError}}
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
      <div class="column is-7-widescreen is-7-fullhd is-12">
        <div class="columns">
          <div class="column">
            <p class="title">{{$t('preview')}}</p>
            <p class="subtitle">{{ $t("controlsHint") }}</p>
          </div>
          <div class="column is-2" v-if="mesh">
            <div class="field">
              <div class="field-label is-normal">
                <label class="label" :title="$t('exportTypeHelp')">
                  STL {{ $t('file') }}
                  <span class="help-icon icon has-text-info"><i class="fas fa-info-circle"></i></span>
                </label>

              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <select v-model="stlType">
                        <option>binary</option>
                        <option>ASCII</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-3" v-if="mesh">
            <div class="field">
              <div class="field-label is-normal">
                <label class="label" :title="$t('exportSeparatePartsHelp')">
                  {{$t('separateParts')}}?
                  <span class="help-icon icon has-text-info"><i class="fas fa-info-circle"></i></span>
                </label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <select v-model="dualExtrusion">
                        <option v-bind:value="false">{{$t('no')}}</option>
                        <option v-bind:value="true">{{$t('yes')}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-3" style="padding-top: 2rem" v-if="mesh">
            <button class="button export-button is-primary is-medium" @click="exportSTL">
              <span class="icon">
                <i class="fa fa-download"></i>
              </span>
              <span>{{$t('saveAsButton')}}</span>
            </button>
          </div>
        </div>
        <hr />
        <div id="container3d"></div>
        <div id="notifications">
          <div
            class="notification is-warning is-light"
            v-if="(blockWidth && blockHeight) && (blockWidth < 2 || blockHeight < 2)"
          >
            <strong>{{$t('printabilityWarning')}}:</strong>
            {{$t('printabilityWarningBody', { dimensions: `${Number(blockWidth).toFixed(1)}mm x ${Number(blockHeight).toFixed(1)}mm` })}}
          </div>
        </div>
        <br/>
        <a class="title is-4" href="#printguide"><i class="fa fa-angle-double-down"></i> {{$t('scrollDownForGuide')}}</a>
      </div>
    </div>

    <PrintGuide />
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import qrcode from 'qrcode';
import vcardjs from 'vcards-js';

import QRCode3D from '../qrcode3d';

// QR Code settings tabs
import TabsQR from './TabsQR.vue';

// QR Code settings forms
import WifiForm from './forms/Wifi.vue';
import EmailForm from './forms/Email.vue';
import ContactForm from './forms/Contact.vue';
import SMSForm from './forms/SMS.vue';

// 3D settings panel
import Panel3dOptions from './Panel3dOptions.vue';
// Print Guide
import PrintGuide from './PrintGuide.vue';

export default {
  name: 'Main',
  props: {
    msg: String,
  },
  components: {
    WifiForm,
    EmailForm,
    ContactForm,
    SMSForm,
    Panel3dOptions,
    TabsQR,
    PrintGuide,
  },
  data() {
    return {
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
      options3d: {
        base: {
          shape: 'rectangle',
          width: 100,
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
        },
        code: {
          depth: 1,
          margin: 5,
          qrcodeBlockStyle: 'square',
          blockSizeMultiplier: 100,
          iconName: 'none',
          iconSizeRatio: 20,
          cityMode: false,
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
      textMesh: null,
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
      this.baseMesh = qrcodeModel.baseMesh;
      this.qrcodeMesh = qrcodeModel.qrcodeMesh;
      this.borderMesh = qrcodeModel.borderMesh;
      this.iconMesh = qrcodeModel.iconMesh;
      this.textMesh = qrcodeModel.textMesh;
      this.mesh = qrcodeModel.combinedMesh;

      this.scene.add(this.baseMesh);
      this.scene.add(this.qrcodeMesh);
      this.scene.add(this.borderMesh);
      this.scene.add(this.iconMesh);
      this.scene.add(this.textMesh);
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
        this.errorCorrectionLevel = 'H';
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
          errorCorrectionLevel: this.errorCorrectionLevel,
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

        this.isGenerating = false;
      }, 100);
    },
    exportSTL() {
      this.trackExportEvent();
      const timestamp = new Date().getTime();
      const exportAsBinary = (this.stlType === 'binary');

      if (this.dualExtrusion) {
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

        if (this.textMesh) {
          const textSTL = this.exporter.parse(this.textMesh, { binary: exportAsBinary });
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
      switch (this.activeTabIndex) {
        case 0: // Text
          ret = this.text;
          break;
        case 1: // Wifi
          if (this.wifi.password === '') {
            this.wifi.security = 'nopass';
          }
          if (this.wifi.security === 'nopass') {
            this.wifi.password = '';
          }
          ret = `WIFI:S:${this.wifiQREscape(
            this.wifi.ssid,
          )};T:${this.wifiQREscape(this.wifi.security)};P:${this.wifiQREscape(
            this.wifi.password,
          )};H:${this.wifi.hidden ? 'true' : 'false'};`;
          break;
        case 2: // E-Mail
          ret = `mailto:${this.email.recipient
            .split(',')
            .map((x) => x.trim())
            .join(',')}?subject=${encodeURI(
            this.email.subject,
          )}&body=${encodeURI(this.email.body)}`;
          break;
        case 3: // Contact
          vCard.firstName = this.contact.firstName;
          vCard.lastName = this.contact.lastName;
          vCard.organization = this.contact.organization;
          vCard.url = this.contact.website;
          vCard.role = this.contact.role;

          vCard.homePhone = this.contact.phone;
          vCard.cellPhone = this.contact.cell;
          vCard.homeFax = this.contact.fax;

          vCard.email = this.contact.email;

          vCard.homeAddress.street = this.contact.street;
          vCard.homeAddress.city = this.contact.city;
          vCard.homeAddress.stateProvince = this.contact.state;
          vCard.homeAddress.postalCode = this.contact.postcode;
          vCard.homeAddress.countryRegion = this.contact.country;

          // vCard.socialUrls.facebook = 'https://...';
          // vCard.socialUrls.linkedIn = 'https://...';
          // vCard.socialUrls.twitter = 'https://...';
          // vCard.socialUrls.flickr = 'https://...';
          // vCard.socialUrls.custom = 'https://...';

          vCard.version = '3.0'; // can also support 2.1 and 4.0, certain versions only support certain fields

          ret = vCard.getFormattedString();
          break;
        case 4: // SMS
          ret = `SMSTO:${this.sms.recipient}:${this.sms.message}`;
          break;
        default:
          break;
      }

      console.log('QR Code String:', ret);
      return ret;
    },
    setActiveTab(idx) {
      this.activeTabIndex = idx;
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

#option-tabs {
  margin-bottom: 0;
}

.option-pane {
  padding: 10px;
}

#notifications {
  margin-top: 10px;
}

.field-label {
  text-align: left;
}
</style>
