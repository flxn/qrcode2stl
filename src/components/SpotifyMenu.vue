<template>
  <div id="spotifyMenu">
    <p class="help content" title="Plz don't sue me Spotify">
      I am not affiliated with Spotify and this tool is not endorsed by Spotify AB. Please follow the <a href="https://www.spotifycodes.com/assets/Terms_and_Conditions_for_Spotify_Codes.pdf" target="_blank" rel="nofollow noopener noreferrer">Terms and Conditions</a> for Spotify Codes.
    </p>
    <!-- Spotify Options -->
    <nav class="panel">
      <p class="panel-heading">{{ $t("spotifyOptions") }}</p>

      <!-- Text -->
      <div class="option-pane">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">{{$t('spotifyUri')}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="spotify:track:4uLU6hMCjMI75M1A2tKUQC"
                  v-model="options.spotifyUri"
                  @change="downloadSpotifyCode"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <p class="help">
            <span class="help-icon icon has-text-info">
              <i class="fas fa-info-circle"></i>
            </span>
            {{$t('spotifyUriHelp')}}
          </p>
        </div>
        <div class="content" v-if="spotifyCodeUrl">
          <figure class="image">
            <object
              type="image/svg+xml"
              id="spotify-code-preview"
              :data="spotifyCodeUrl"
              v-if="validSpotifyCode"
              @load="validSpotifyCode = true"
              @error="validSpotifyCode = false"
            />
            <p class="has-text-weight-bold has-text-success" v-if="validSpotifyCode">
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
              Valid Spotify URI
            </p>
            <p class="has-text-weight-bold has-text-danger" v-if="!validSpotifyCode">
              <span class="icon">
                <i class="fa fa-exclamation-triangle"></i>
              </span>
              Invalid Spotify URI
            </p>
          </figure>
        </div>

      </div>
    </nav>
    <!-- 3D Options -->
    <Spotify3DOptionsPanel :options="options" :unit="unit" />

    <div class="notification is-danger is-light" v-if="generateError" style="margin-top: 20px 0;">
      {{generateError}}
    </div>

    <button
      class="button is-success is-large"
      v-bind:class="{'is-loading': isGenerating}"
      @click="generate3dModel"
      v-if="validSpotifyCode"
    >
      <span class="icon">
        <i class="fa fa-cube"></i>
      </span>
      <span>{{$t('generateButton')}}</span>
    </button>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import pathThatSvg from 'path-that-svg';
import { diff } from 'deep-object-diff';
import merge from 'deepmerge';
import JSZip from 'jszip';
import modelWorker from '@/model-worker';
// 3D settings panel
import Spotify3DOptionsPanel from './Spotify3DOptionsPanel.vue';

const defaultOptions = {
  spotifyUri: '',
  base: {
    shape: 'roundedRectangle',
    width: 100,
    height: 25,
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
    textAlign: 'center',
    hasKeychainAttachment: false,
    keychainPlacement: 'left',
    keychainHoleDiameter: 6,
    mirrorHoles: false,
    hasNfcIndentation: false,
    nfcIndentationShape: 'square',
    nfcIndentationSize: 20,
    nfcIndentationDepth: 1,
    nfcIndentationHidden: false,
  },
  code: {
    depth: 1,
    margin: 5,
    cityMode: false,
    depthMax: 5,
    invert: false,
  },
};

export default {
  name: 'SpotifyMenu',
  props: {
    initData: Object,
  },
  components: {
    Spotify3DOptionsPanel,
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
      spotifyCodeUrl: '',
      validSpotifyCode: false,
      exporter: null,
      unit: 'mm',
      mesh: null,
      baseMesh: null,
      spotifyCodeMesh: null,
      borderMesh: null,
      subtitleMesh: null,
      keychainAttachmentMesh: null,
      stlType: 'binary',
      dualExtrusion: false,
      camera: null,
      scene: null,
      renderer: null,
      animationFrameId: null,
      animationTimer: null,
      isGenerating: false,
      generateError: null,
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
              this.spotifyCodeMesh = meshes.spotifyCode;
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
    async setup3dObject() {
      const loader = new SVGLoader();
      let svg = document.querySelector('#spotify-code-preview').contentDocument.querySelector('svg').outerHTML;
      svg = svg.replace('<rect x="0" y="0" width="400" height="100" fill="#000000"/>', '');
      const pathedSvg = await pathThatSvg(svg);
      const svgData = loader.parse(pathedSvg);
      let shapes = svgData.paths.map((p) => p.toShapes(true, false)).flat();
      shapes = shapes.map((s) => s.toJSON());

      modelWorker.send({
        mode: 'Spotify',
        spotifyCodeShapes: shapes,
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
      this.isGenerating = true;
      this.trackGenerateEvent();

      setTimeout(() => {
        this.init3d();
        this.setup3dObject();
        this.startAnimation();
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
        const filenameText = `text-${timestamp}.stl`;
        const filenameKeychain = `attachment-${timestamp}.stl`;

        const baseSTL = this.exporter.parse(this.baseMesh, { binary: exportAsBinary });
        const qrcodeSTL = this.exporter.parse(this.spotifyCodeMesh, { binary: exportAsBinary });
        zip.file(filenameBase, baseSTL.buffer);
        zip.file(filenameQrcode, qrcodeSTL.buffer);

        if (this.borderMesh) {
          const borderSTL = this.exporter.parse(this.borderMesh, { binary: exportAsBinary });
          zip.file(filenameBorder, borderSTL.buffer);
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
    async downloadSpotifyCode() {
      let uri = this.options.spotifyUri;
      if (!uri.startsWith('spotify:')) {
        const regex = /spotify\.com\/([^/]+)\/([^?/]+)/gm;
        const parts = regex.exec(uri);
        if (parts.length !== 3) {
          console.error('Not a valid Spotify URI or Link');
          return;
        }
        uri = `spotify:${parts[1]}:${parts[2]}`;
      }
      const spotifyCodeSvgUrl = `https://scannables.scdn.co/uri/plain/svg/000000/white/640/${uri}`;
      this.validSpotifyCode = true;
      const response = await fetch(spotifyCodeSvgUrl);
      const utf8Decoder = new TextDecoder('utf-8');
      const reader = response.body.getReader();
      const data = await reader.read();
      const svgString = utf8Decoder.decode(data.value);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      this.spotifyCodeUrl = URL.createObjectURL(svgBlob);
    },
  },
  async mounted() {
    this.initWorker();
    this.init3d();
    this.exporter = new STLExporter();
    this.startAnimation();
    if (this.initData && this.initData.mode === 'Spotify') {
      delete this.initData.mode;
      this.options = merge(this.options, this.initData);
      await this.downloadSpotifyCode();
      this.generate3dModel();
    }
  },
};
</script>

<style scoped>
#notifications {
  margin-top: 10px;
}

.field-label {
  text-align: left;
  flex-grow: 1.5;
  margin-right: 0;
}

#spotify-code-preview {
  max-width: 100%;
}
</style>
