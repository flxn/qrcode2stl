<template>
  <div id="main" class="container is-fluid">
    <div class="columns is-multiline">
      <div class="column is-5-widescreen is-5-fullhd is-12">
        <h1 class="title">QR Code Generator</h1>
        <h2 class="subtitle">Export your QR code as STL for 3D printing</h2>
        <hr />
        <nav class="panel">
          <p class="panel-heading">QR Code Options</p>

          <!-- QR Code settings tabs -->
          <TabsQR :active-tab-index="activeTabIndex" @tabChanged="setActiveTab" />

          <!-- Text -->
          <div class="option-pane" v-if="activeTabIndex === 0">
            <textarea
              class="textarea"
              placeholder="The text for your QR code e.g. Hello World or https://flxn.de"
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
                <label class="label">Error Correction</label>
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
                    <p class="help">The higher the error correction level, the denser the QR code.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <!-- 3D Options -->
        <Panel3dOptions :options="options3d" :unit="unit" />

        <button
          class="button is-success is-large"
          v-bind:class="{'is-loading': isGenerating}"
          @click="generate3dModel"
        >
          <span class="icon">
            <i class="fa fa-cube"></i>
          </span>
          <span>Generate 3D Model</span>
        </button>

        <p>{{outputText}}</p>
        <canvas id="qr-canvas"></canvas>
      </div>
      <div class="column is-7-widescreen is-7-fullhd is-12">
        <div class="columns">
          <div class="column">
            <p class="title">Preview</p>
            <p class="subtitle">Use your mouse to rotate.</p>
          </div>
          <div class="column is-2" v-if="mesh">
            <div class="field">
              <div class="field-label is-normal">
                <label class="label"
                    title="Just leave this as 'binary' to keep file size low.
If your software has issues with the generated file, you can try to change this option.">
                  STL file
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
                <label class="label" title="If set to 'yes' the base and the qr code will be saved as two separate parts
for printers with dual extrusion printing.
Your browser may ask for permissions to download multiple files.">
                  Separate parts?
                  <span class="help-icon icon has-text-info"><i class="fas fa-info-circle"></i></span>
                </label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <select v-model="dualExtrusion">
                        <option v-bind:value="false">no</option>
                        <option v-bind:value="true">yes</option>
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
              <span>Save As STL</span>
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
            <strong>Warning for 3D printability:</strong>
            At least one edge of the smallest element in the 3D model is very small: {{Number(blockWidth).toFixed(1)}}mm x {{Number(blockHeight).toFixed(1)}}mm.
            Depending on your setup, this could make printing harder.
          </div>
        </div>
        <br/>
        <a class="title is-4" href="#printguide"><i class="fa fa-angle-double-down"></i> Scroll down for a guide on how to print your QR code.</a>
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
      outputText: '',
      options3d: {
        base: {
          width: 100,
          depth: 3,
          hasBorder: false,
          borderWidth: 2,
          borderDepth: 1,
        },
        code: {
          depth: 1,
          margin: 5,
          qrcodeBlockStyle: 'square',
          blockSizeMultiplier: 100,
          iconName: 'none',
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
    };
  },

  methods: {
    init3d() {
      this.reset3d();
      const container = document.getElementById('container3d');

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.rotation.z = -Math.PI / 2;

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
      this.mesh = qrcodeModel.combinedMesh;

      this.scene.add(this.baseMesh);
      this.scene.add(this.qrcodeMesh);
      this.scene.add(this.borderMesh);
      this.scene.add(this.iconMesh);
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
    trackGenerateEvent() {
      const settingsString = JSON.stringify(this.options3d, null, 4);
      // eslint-disable-next-line no-underscore-dangle
      window._paq.push(['trackEvent', 'Generate', settingsString]);
    },
    async generate3dModel() {
      this.trackGenerateEvent();

      this.isGenerating = true;
      const txt = this.getQRText();
      if (txt === '') {
        this.isGenerating = false;
        return;
      }
      await qrcode.toCanvas(document.getElementById('qr-canvas'), txt, {
        margin: 0,
        scale: 1,
        errorCorrectionLevel: this.errorCorrectionLevel,
      });
      setTimeout(() => {
        this.init3d();
        this.setup3dObject();
        this.startAnimation();

        this.isGenerating = false;
      }, 100);
    },
    exportSTL() {
      const timestamp = new Date().getTime();
      const exportAsBinary = (this.stlType === 'binary');

      if (this.dualExtrusion) {
        const filenameBase = `base-${timestamp}.stl`;
        const filenameQrcode = `qrcode-${timestamp}.stl`;
        const filenameBorder = `border-${timestamp}.stl`;
        const baseSTL = this.exporter.parse(this.baseMesh, { binary: exportAsBinary });
        const qrcodeSTL = this.exporter.parse(this.qrcodeMesh, { binary: exportAsBinary });
        if (exportAsBinary) {
          this.saveArrayBuffer(baseSTL, filenameBase);
          this.saveArrayBuffer(qrcodeSTL, filenameQrcode);
        } else {
          this.saveString(baseSTL, filenameBase);
          this.saveString(qrcodeSTL, filenameQrcode);
        }

        if (this.options3d.base.hasBorder) {
          const borderSTL = this.exporter.parse(this.borderMesh, { binary: exportAsBinary });
          if (exportAsBinary) {
            this.saveArrayBuffer(borderSTL, filenameBorder);
          } else {
            this.saveString(borderSTL, filenameBorder);
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
          ret = `WIFI:S:${this.wifiQREscape(
            this.wifi.ssid,
          )};T:${this.wifiQREscape(this.wifi.security)};P:${this.wifiQREscape(
            this.wifi.password,
          )};H:${this.wifi.hidden ? 'true' : 'false'};`;
          break;
        case 2: // E-Mail
          ret = `mailto:${this.email.recipient
            .split(',')
            .map(x => x.trim())
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
