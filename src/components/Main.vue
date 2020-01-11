<template>
  <div id="main" class="container is-fluid">
    <div class="columns">
      <div class="column is-4">
        <h1 class="title">QR Code Generator</h1>
        <h2 class="subtitle">Export your QR code as STL for 3D printing</h2>
        <hr />
        <nav class="panel">
          <p class="panel-heading">QR Code Options</p>
          <div id="option-tabs" class="panel-tabs tabs">
            <ul>
              <li v-bind:class="{ 'is-active': activeTabIndex === 0 }" @click="setActiveTab(0)">
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-font" aria-hidden="true"></i>
                  </span>
                  <span>Text</span>
                </a>
              </li>
              <li v-bind:class="{ 'is-active': activeTabIndex === 1 }" @click="setActiveTab(1)">
                <a>
                  <span class="icon is-small">
                    <i class="fas fa-wifi" aria-hidden="true"></i>
                  </span>
                  <span>Wifi</span>
                </a>
              </li>
              <li v-bind:class="{ 'is-active': activeTabIndex === 2 }" @click="setActiveTab(2)">
                <a>
                  <span class="icon is-small">
                    <i class="far fa-envelope" aria-hidden="true"></i>
                  </span>
                  <span>E-Mail</span>
                </a>
              </li>
              <li v-bind:class="{ 'is-active': activeTabIndex === 3 }" @click="setActiveTab(3)">
                <a>
                  <span class="icon is-small">
                    <i class="far fa-address-card" aria-hidden="true"></i>
                  </span>
                  <span>Contact</span>
                </a>
              </li>
              <li v-bind:class="{ 'is-active': activeTabIndex === 4 }" @click="setActiveTab(4)">
                <a>
                  <span class="icon is-small">
                    <i class="far fa-comment" aria-hidden="true"></i>
                  </span>
                  <span>SMS</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="option-pane" v-if="activeTabIndex === 0">
            <textarea
              class="textarea"
              placeholder="The text for your QR code e.g. Hello world"
              v-model="text"
              style="width: 100%"
            ></textarea>
          </div>
          <div class="option-pane" v-if="activeTabIndex === 1">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">SSID</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="The name of the Wifi network"
                      v-model="wifi.ssid"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Password</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="The password of the Wifi network"
                      v-model="wifi.password"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Security</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <select v-model="wifi.security">
                        <option>WPA</option>
                        <option>WEP</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Security</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                      <input type="checkbox" v-model="wifi.hidden">
                      Hidden
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>


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

        <nav class="panel">
          <p class="panel-heading">3D Model Options</p>
          <div class="panel-block">
            <div class="columns">
              <div class="column">
                <div class="model-options-title">
                  <div class="title is-size-5">Base</div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-small">
                    <label class="label">Width</label>
                  </div>
                  <div class="field-body">
                    <div class="field has-addons">
                      <div class="control">
                        <input class="input is-small" type="number" v-model.number="base.width" />
                      </div>
                      <p class="control">
                        <a class="button is-static is-small">{{unit}}</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-small">
                    <label class="label">Height</label>
                  </div>
                  <div class="field-body">
                    <div class="field has-addons">
                      <div class="control">
                        <input class="input is-small" type="number" v-model.number="base.height" />
                      </div>
                      <p class="control">
                        <a class="button is-static is-small">{{unit}}</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-small">
                    <label class="label">Depth</label>
                  </div>
                  <div class="field-body">
                    <div class="field has-addons">
                      <div class="control">
                        <input class="input is-small" type="number" v-model.number="base.depth" />
                      </div>
                      <p class="control">
                        <a class="button is-static is-small">{{unit}}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="model-options-title">
                  <div class="title is-size-5">QR Code</div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-small">
                    <label class="label">Depth</label>
                  </div>
                  <div class="field-body">
                    <div class="field has-addons">
                      <div class="control">
                        <input class="input is-small" type="number" v-model.number="code.depth" />
                      </div>
                      <p class="control">
                        <a class="button is-static is-small">{{unit}}</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-small">
                    <label class="label">Margin</label>
                  </div>
                  <div class="field-body">
                    <div class="field has-addons">
                      <div class="control">
                        <input class="input is-small" type="number" v-model.number="code.margin" />
                      </div>
                      <p class="control">
                        <a class="button is-static is-small">{{unit}}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <button class="button is-success is-medium" @click="generate3dModel">Generate 3D Model</button>

        <p>{{outputText}}</p>
        <canvas id="qr-canvas"></canvas>
      </div>
      <div class="column">
        <div class="is-pulled-right">
          <button class="button export-button is-primary is-medium" @click="exportASCII">
            <span class="icon">
              <i class="fa fa-download"></i>
            </span>
            <span>Save As STL (ASCII)</span>
          </button>
          <button class="button export-button is-primary is-medium" @click="exportBinary">
            <span class="icon">
              <i class="fa fa-download"></i>
            </span>
            <span>Save As STL (binary)</span>
          </button>
        </div>
        <div>
          <p class="title">Preview</p>
          <p class="subtitle">Use your mouse to rotate.</p>
        </div>
        <hr />
        <div id="container3d"></div>
        <div id="notifications">
          <div class="notification is-warning is-light" v-if="(blockWidth && blockHeight) && (blockWidth < 2 || blockHeight < 2)"><strong>Warning for 3D printing:</strong> At least one edge of the smallest cube in 3D model is very small {{Number(blockWidth).toFixed(1)}}mm x {{Number(blockHeight).toFixed(1)}}mm.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import qrcode from 'qrcode';

export default {
  name: 'Main',
  props: {
    msg: String,
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
      outputText: '',
      workCanvas: null,
      exporter: null,
      unit: 'mm',
      mesh: null,
      base: {
        width: 100,
        height: 100,
        depth: 3,
      },
      code: {
        depth: 2,
        margin: 3,
      },
      camera: null,
      scene: null,
      renderer: null,
      animationFrameId: null,
      animationTimer: null,
      blockWidth: null,
      blockHeight: null,
    };
  },

  methods: {
    init3d() {
      this.reset3d();
      const container = document.getElementById('container3d');

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.rotation.z = -Math.PI / 2;

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
      hemiLight.position.set(0, 200, 0);
      this.scene.add(hemiLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 200, 100);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.top = 180;
      directionalLight.shadow.camera.bottom = -100;
      directionalLight.shadow.camera.left = -120;
      directionalLight.shadow.camera.right = 120;
      directionalLight.rotation.x = Math.PI / 2;
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
      const modelBase = new THREE.BoxGeometry(
        this.base.width,
        this.base.height,
        this.base.depth,
      );
      const materialBase = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const materialBlock = new THREE.MeshBasicMaterial({ color: 0x000000 });

      const baseMesh = new THREE.Mesh(modelBase, materialBase);
      baseMesh.position.set(0, 0, this.base.depth / 2);
      this.scene.add(baseMesh);

      const combinedGeometry = new THREE.Geometry();
      baseMesh.updateMatrix();
      combinedGeometry.merge(baseMesh.geometry, baseMesh.matrix);

      const canvasWidth = this.workCanvas.width;
      const canvasHeight = this.workCanvas.height;
      const availableWidth = this.base.width - 2 * this.code.margin;
      this.blockWidth = availableWidth / canvasWidth;
      const availableHeight = this.base.height - 2 * this.code.margin;
      this.blockHeight = availableHeight / canvasHeight;

      const ctx = this.workCanvas.getContext('2d');
      for (let y = 0; y < canvasHeight; y += 1) {
        for (let x = 0; x < canvasWidth; x += 1) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const isBlack = pixel[0] === 0;
          if (isBlack) {
            const qrBlock = new THREE.BoxGeometry(
              this.blockWidth,
              this.blockHeight,
              this.code.depth,
            );
            const qrBlockMesh = new THREE.Mesh(qrBlock, materialBlock);

            let blockX = (x / canvasWidth) * availableWidth;
            blockX -= availableWidth / 2;
            blockX += this.blockWidth / 2;

            let blockY = (y / canvasHeight) * availableHeight;
            blockY -= availableHeight / 2;
            blockY += this.blockHeight / 2;

            const blockZ = this.base.depth + this.code.depth / 2;

            qrBlockMesh.position.set(blockX, blockY, blockZ);
            this.scene.add(qrBlockMesh);
            qrBlockMesh.updateMatrix();
            combinedGeometry.merge(qrBlockMesh.geometry, qrBlockMesh.matrix);
          }
        }
      }

      this.mesh = new THREE.Mesh(combinedGeometry, materialBase);
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
    async generate3dModel() {
      await qrcode.toCanvas(document.getElementById('qr-canvas'), this.getQRText(), {
        margin: 0,
        scale: 1,
        errorCorrectionLevel: this.errorCorrectionLevel,
      });

      this.init3d();
      this.setup3dObject();
      this.startAnimation();
    },
    exportASCII() {
      const result = this.exporter.parse(this.mesh);
      this.saveString(result, 'qrcode.stl');
    },
    exportBinary() {
      const result = this.exporter.parse(this.mesh, { binary: true });
      this.saveArrayBuffer(result, 'qrcode.stl');
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
    setActiveTab(tabIdx) {
      this.activeTabIndex = tabIdx;
    },
    wifiQREscape(str) {
      const regex = /([:|\\|;|,|"])/gm;
      const subst = '\\$1';
      const result = str.replace(regex, subst);
      return result;
    },
    getQRText() {
      let ret = '';
      switch (this.activeTabIndex) {
        case 0:
          ret = this.text;
          break;
        case 1:
          ret = `WIFI:S:${this.wifiQREscape(this.wifi.ssid)};T:${this.wifiQREscape(this.wifi.security)};P:${this.wifiQREscape(this.wifi.password)};H:${this.wifi.hidden ? 'true' : 'false'};`;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

.model-options-title {
  margin: 0 0 10px 5px;
  padding-bottom: 7px;
  border-bottom: 2px solid whitesmoke;
}

.export-button {
  margin: 0 10px;
}

#option-tabs {
  margin-bottom: 0;
}

.field {
  width: 100%;
  display: block;
}

.option-pane {
  padding: 10px;
}

#notifications {
  margin-top: 10px;
}
</style>
