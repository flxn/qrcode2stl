<template>
  <main id="main" class="container is-fluid">
    <article class="columns is-multiline">
      <div class="column is-5-widescreen is-5-fullhd is-12">
        <h1 class="title" itemprop="name">{{ $t("title") }}</h1>
        <h2 class="subtitle" itemprop="description">{{ $t("subtitle") }}</h2>
        <nav id="mode-buttons" aria-label="QR Code type selection">
          <button class="button is-large" :class="{'is-primary': mode === 'QR'}" @click="changeMode('QR')" aria-pressed="mode === 'QR'">
            <span class="icon is-medium" aria-hidden="true">
              <i class="fa fa-qrcode"></i>
            </span>
            <span>QR Code</span>
          </button>
          <button class="button is-large" :class="{'is-primary': mode === 'Spotify'}" @click="changeMode('Spotify')" aria-pressed="mode === 'Spotify'">
            <span class="icon is-medium" aria-hidden="true">
              <i class="fab fa-spotify"></i>
            </span>
            <span>Spotify Code</span>
          </button>
          <button class="button is-large" :class="{'is-primary': mode === 'Text'}" @click="changeMode('Text')" aria-pressed="mode === 'Text'">
            <span class="icon is-medium" aria-hidden="true">
              <i class="fa fa-font"></i>
            </span>
            <span>Text</span>
          </button>
        </nav>
        <hr />
        <!-- Menus for modes -->
        <QRCodeMenu v-if="mode === 'QR'" ref="qrcode" :scene="scene" :exporter="exporter" @generating="isGenerating = true" @exportReady="exportReady" @resetScene="resetScene"/>
        <SpotifyMenu v-if="mode === 'Spotify'" ref="spotifycode" :scene="scene" :exporter="exporter" @generating="isGenerating = true" @exportReady="exportReady" @resetScene="resetScene"/>
        <TextMenu v-if="mode === 'Text'" ref="text" :scene="scene" :exporter="exporter" @generating="isGenerating = true" @exportReady="exportReady" @resetScene="resetScene"/>

      </div>
      <div class="column is-7-widescreen is-7-fullhd is-12">
        <div class="columns">
          <div class="column">
            <h2 class="title">{{$t('preview')}}</h2>
            <p class="subtitle" role="note">{{ $t("controlsHint") }}</p>
          </div>
          <div class="column is-2" v-if="showExport">
            <div class="field">
              <div class="field-label is-normal has-text-left">
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
          <div class="column is-2" v-if="showExport">
            <div class="field">
              <div class="field-label is-normal has-text-left">
                <label class="label" :title="$t('exportSeparatePartsHelp')">
                  {{$t('separateParts')}}?
                  <span class="help-icon icon has-text-info"><i class="fas fa-info-circle"></i></span>
                </label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select">
                      <select v-model="multipleParts">
                        <option v-bind:value="false">{{$t('no')}}</option>
                        <option v-bind:value="true">{{$t('yes')}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-5" style="padding-top: 2rem" v-if="showExport">
            <button class="button export-button is-primary is-medium" @click="exportSTL">
              <span class="icon">
                <i class="fa fa-cube"></i>
              </span>
              <span>{{$t('saveAsButton')}}</span>
            </button>
            <button class="button export-button is-primary is-medium" @click="renderPNG">
              <span class="icon">
                <i class="fa fa-image"></i>
              </span>
              <span>{{$t('saveAsImageButton')}}</span>
            </button>
          </div>
        </div>
        <hr />
        <div v-if="isGenerating" class="has-text-centered" role="status" aria-live="polite">
          <p class="title">{{$t('isGenerating')}}</p>
          <hr>
        </div>
        <div id="container3d" :class="{ 'is-loading': isGenerating }" role="img" :aria-label="$t('preview')"></div>
        <div class="internal-nav-links">
          <a class="title is-4" href="#printguide"><i class="fa fa-angle-double-down"></i> {{$t('scrollDownForGuide')}}</a>
          <a class="title is-4" href="#faq"><i class="fa fa-angle-double-down"></i> {{$t('faqTitle')}}</a>
          <a class="title is-4" href="#changelog"><i class="fa fa-angle-double-down"></i> Changelog</a>
        </div>
        <div v-html="modelAd" class="mt-4 has-text-centered"></div>
      </div>
    </article>

    <section id="printguide">
      <PrintGuide />
    </section>

    <section id="faq">
      <FAQ />
    </section>

    <section id="changelog" class="pt-4 content container">
      <h2 class="title">Changelog</h2>
      <hr>
      <MarkdownRenderer :source="changelog" class="content" />
    </section>
    <ChangelogModal v-if="changelogModalVisible"/>
    <ExportModal v-if="exportModalVisible"/>
  </main>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
// eslint-disable-next-line import/no-webpack-loader-syntax
import changelog from '../../CHANGELOG.md?raw';
import { bus } from '../main';
import { getRandomBanner, saveAsArrayBuffer, trimCanvas } from '../utils';
import ChangelogModal from './ChangelogModal.vue';

export default {
  name: 'Main',
  props: {
    msg: String,
  },
  components: {
    QRCodeMenu: () => import('./QRCodeMenu.vue'),
    SpotifyMenu: () => import('./SpotifyMenu.vue'),
    TextMenu: () => import('./TextMenu.vue'),
    PrintGuide: () => import('./PrintGuide.vue'),
    FAQ: () => import('./FAQ.vue'),
    ChangelogModal,
    ExportModal: () => import('./ExportModal.vue'),
    MarkdownRenderer: () => import('./MarkdownRenderer.vue'),
  },
  data() {
    return {
      mode: 'QR',
      showExport: true,
      stlType: 'binary',
      multipleParts: false,
      changelogModalVisible: false,
      changelog: changelog.split('\n').slice(3).join('\n'),
      exportModalVisible: false,
      isGenerating: false,
      modelAd: '',
      exporter: null,
      camera: null,
      scene: null,
      renderer: null,
      grid: null,
      animationFrameId: null,
      animationTimer: null,
      adblockEnabled: false,
    };
  },
  created() {
    bus.$on('openChangelogModal', () => { this.changelogModalVisible = true; });
    bus.$on('closeChangelogModal', () => { this.changelogModalVisible = false; });
    bus.$on('openExportModal', () => { this.exportModalVisible = true; });
    bus.$on('closeExportModal', () => { this.exportModalVisible = false; });

    // Settings import/export handlers
    bus.$on('requestExportSettings', () => {
      const settings = this.getActiveMenuOptions();
      bus.$emit('settingsExported', settings);
    });
    bus.$on('importSettings', (data) => {
      this.setActiveMenuOptions(data);
    });
  },
  mounted() {
    // eslint-disable-next-line camelcase
    if (typeof __google_ad_urls === 'undefined') {
      this.adblockEnabled = true;
      this.modelAd = getRandomBanner('728x90');
    } else {
      this.modelAd = document.getElementById('adsenseloader-model').innerHTML;
    }
    this.initScene();
    this.startAnimation();
    this.exporter = new STLExporter();
  },
  methods: {
    changeMode(mode) {
      this.mode = mode;
    },
    initLights() {
      // LIGHTS
      const ambientLight = new THREE.AmbientLight(0x333333);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
      directionalLight.position.x = -1;
      directionalLight.position.y = 0;
      directionalLight.position.z = 1;
      this.scene.add(directionalLight);

      const directionalLightBack = new THREE.DirectionalLight(0xaaaaaa, 0.3);
      directionalLightBack.position.x = -0.6;
      directionalLightBack.position.y = 0;
      directionalLightBack.position.z = -1;
      this.scene.add(directionalLightBack);
    },
    initScene() {
      clearTimeout(this.animationTimer);
      cancelAnimationFrame(this.animationFrameId);
      this.scene = null;
      this.mesh = null;
      this.camera = null;
      this.scene = null;
      this.renderer = null;
      this.grid = null;
      const elem = document.getElementById('container3d');
      while (elem.lastChild) elem.removeChild(elem.lastChild);

      const container = document.getElementById('container3d');

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.rotation.z = -Math.PI / 2;

      this.initLights();

      this.grid = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
      this.grid.material.opacity = 0.2;
      this.grid.material.transparent = true;
      this.grid.rotation.x = Math.PI / 2;
      this.scene.add(this.grid);

      this.camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        1,
        10000,
      );
      this.camera.position.set(0, 0, 200);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    resetScene() {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }

      this.initLights();
      this.scene.background = new THREE.Color(0xa0a0a0);
      // reset transparency
      this.renderer.setClearColor(0xa0a0a0, 1);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(document.getElementById('container3d').clientWidth, document.getElementById('container3d').clientHeight);
      this.grid = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
      this.grid.material.opacity = 0.2;
      this.grid.material.transparent = true;
      this.grid.rotation.x = Math.PI / 2;
      this.scene.add(this.grid);
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
    exportSTL() {
      this.exportModalVisible = true;
      setTimeout(() => {
        if (this.mode === 'QR') {
          this.$refs.qrcode.exportSTL(this.stlType, this.multipleParts);
        } else if (this.mode === 'Spotify') {
          this.$refs.spotifycode.exportSTL(this.stlType, this.multipleParts);
        } else if (this.mode === 'Text') {
          this.$refs.text.exportSTL(this.stlType, this.multipleParts);
        }
      }, 5000);
    },
    renderPNG() {
      this.exportModalVisible = true;
      setTimeout(() => {
        const container = document.getElementById('container3d');
        // remove grid from scene
        this.scene.remove(this.grid);
        // remove background color
        this.scene.background = null;
        // make background transparent
        this.renderer.setClearColor(0x000000, 0);
        // set camera to be orthographic for 2D rendering, set position to center and zoom in
        this.camera = new THREE.OrthographicCamera(
          container.clientWidth / -2,
          container.clientWidth / 2,
          container.clientHeight / 2,
          container.clientHeight / -2,
          1,
          10000,
        );
        this.camera.position.set(0, 0, 100);
        this.camera.zoom = 2;
        this.camera.updateProjectionMatrix();
        // scale to 3x resolution
        this.renderer.setPixelRatio(window.devicePixelRatio * 3);
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        // render scene
        this.renderer.render(this.scene, this.camera);

        // renders three.js scene to PNG and triggers download
        const canvas = this.renderer.domElement;
        // copy canvas to new temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);
        trimCanvas(tempCanvas).toBlob((blob) => {
          const filename = `image-${new Date().getTime()}.png`;
          // write to temp
          setTimeout(() => {
            saveAsArrayBuffer(blob, filename);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }, 4000);
        });
      }, 1000);
    },
    exportReady(options) {
      this.showExport = true;
      this.isGenerating = false;
    },
    getActiveMenuOptions() {
      const refMap = { QR: 'qrcode', Spotify: 'spotifycode', Text: 'text' };
      const ref = this.$refs[refMap[this.mode]];
      return ref ? { mode: this.mode, options: ref.getExportableOptions() } : null;
    },
    setActiveMenuOptions(data) {
      if (data.mode && data.mode !== this.mode) {
        this.mode = data.mode;
        this.$nextTick(() => {
          const refMap = { QR: 'qrcode', Spotify: 'spotifycode', Text: 'text' };
          const ref = this.$refs[refMap[this.mode]];
          if (ref && data.options) {
            ref.importOptions(data.options);
          }
        });
      } else {
        const refMap = { QR: 'qrcode', Spotify: 'spotifycode', Text: 'text' };
        const ref = this.$refs[refMap[this.mode]];
        if (ref && data.options) {
          ref.importOptions(data.options);
        }
      }
    },
  },

};
</script>

<style>
#main {
  margin-top: 20px;
  padding-bottom: 20px;
}

#container3d {
  width: 100%;
  height: 600px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  opacity: 1;
}

#container3d.is-loading {
  animation: breathing 2s linear infinite;
}

@keyframes breathing {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.3;
  }
}

.export-button {
  margin: 0 10px;
}

#notifications {
  margin-top: 10px;
}

.field-label {
  text-align: left !important;
}

#mode-buttons>button {
  margin-right: 20px;
}

.highlight {
  position: relative;
  display: inline-block;
  overflow: visible;
}

.highlight>.highlight-text {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 0px 5px;
  background-color: hsl(348, 100%, 61%);
  color: #fff;
  font-weight: bold;
  border-radius: 3px;
  z-index: 30;
}

.subsection {
  border-radius: 6px;
  background: #fbfbfb;
  border: 1px solid #ededed;
  padding: 1rem;
  margin-bottom: 1rem;
}

.internal-nav-links {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}
.internal-nav-links a {
  display: block;
  margin-bottom: 10px;
  color: #3273dc;
  text-decoration: none;
  transition: all 0.3s ease;
}
.internal-nav-links a:hover {
  color: #2366d1;
  transform: translateY(-2px);
}
.internal-nav-links a i {
  margin-right: 10px;
}
</style>
