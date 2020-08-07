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
                  v-model="optionsSpotify.spotifyUri"
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
    <Spotify3DOptionsPanel :options="options3d" :unit="unit" />

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

    <canvas id="qr-canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import SpotifyCode3D from '../spotifyCode3D';
// 3D settings panel
import Spotify3DOptionsPanel from './Spotify3DOptionsPanel.vue';

export default {
  name: 'SpotifyMenu',
  props: {
    msg: String,
  },
  components: {
    Spotify3DOptionsPanel,
  },
  data() {
    return {
      optionsSpotify: {
        spotifyUri: '',
      },
      options3d: {
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
        },
        code: {
          depth: 1,
          margin: 5,
          cityMode: false,
          depthMax: 5,
          invert: false,
        },
      },
      spotifyCodeUrl: '',
      validSpotifyCode: false,
      workCanvas: null,
      exporter: null,
      unit: 'mm',
      mesh: null,
      baseMesh: null,
      spotifyCodeMesh: null,
      borderMesh: null,
      subtitleMesh: null,
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
      const qrcodeModel = new SpotifyCode3D(this.options3d);
      await qrcodeModel.generate3dModel();
      this.baseMesh = qrcodeModel.baseMesh;
      this.spotifyCodeMesh = qrcodeModel.spotifyCodeMesh;
      this.borderMesh = qrcodeModel.borderMesh;
      this.iconMesh = qrcodeModel.iconMesh;
      this.subtitleMesh = qrcodeModel.subtitleMesh;
      this.mesh = qrcodeModel.getCombinedMesh();

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
      this.isGenerating = true;
      this.trackGenerateEvent();

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
        const filenameText = `text-${timestamp}.stl`;
        const baseSTL = this.exporter.parse(this.baseMesh, { binary: exportAsBinary });
        const qrcodeSTL = this.exporter.parse(this.spotifyCodeMesh, { binary: exportAsBinary });
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
    downloadSpotifyCode() {
      let uri = this.optionsSpotify.spotifyUri;
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
      fetch(spotifyCodeSvgUrl)
        .then((response) => {
          const utf8Decoder = new TextDecoder('utf-8');
          const reader = response.body.getReader();
          reader.read().then((data) => {
            const svgString = utf8Decoder.decode(data.value);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            this.spotifyCodeUrl = URL.createObjectURL(svgBlob);
          });
        });
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
