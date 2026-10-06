<template>
  <div id="spotifyMenu" class="mode-panel">
    <section class="content-card" :aria-label="$t('spotifyUri')">
      <div class="content-card__head">
        <span class="content-card__title">
          <i class="fab fa-spotify content-card__fa" aria-hidden="true"></i>
          {{ $t('spotifyUri') }}
        </span>
        <transition name="fade" mode="out-in">
          <span v-if="spotifyStatus === 'valid'" key="valid" class="status-pill status-pill--ok">
            <UiIcon name="circle-check" /> Valid Spotify URI
          </span>
          <span v-else-if="spotifyStatus === 'invalid'" key="invalid" class="status-pill status-pill--error">
            <UiIcon name="alert" /> Invalid Spotify URI
          </span>
          <span v-else-if="spotifyStatus === 'loading'" key="loading" class="status-pill">
            <UiIcon name="loader" class="spin" />
          </span>
        </transition>
      </div>
      <input
        v-model="options.spotifyUri"
        class="input input--lg"
        type="text"
        spellcheck="false"
        autocomplete="off"
        placeholder="spotify:track:4uLU6hMCjMI75M1A2tKUQC"
        :aria-label="$t('spotifyUri')"
        title="spotifyUri"
        @input="scheduleDownload"
        @change="downloadSpotifyCode"
      />
      <transition name="rise">
        <figure v-if="spotifyCodeUrl && validSpotifyCode" class="spotify-preview">
          <object
            id="spotify-code-preview"
            type="image/svg+xml"
            :data="spotifyCodeUrl"
            @load="onPreviewLoad"
            @error="onPreviewError"
          ></object>
        </figure>
      </transition>
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
          <div class="notice notice--info">
            <UiIcon name="info" />
            <span>{{ $t('spotifyUriHelp') }}</span>
          </div>
          <p class="field-hint" title="Plz don't sue me Spotify">
            I am not affiliated with Spotify and this tool is not endorsed by Spotify AB. Please follow the
            <a href="https://www.spotifycodes.com/assets/Terms_and_Conditions_for_Spotify_Codes.pdf" target="_blank" rel="nofollow noopener noreferrer">Terms and Conditions</a>
            for Spotify Codes.
          </p>
        </div>
      </div>

      <div v-show="currentTab === 'model'" class="tab-panel" role="tabpanel">
        <SpotifyModelOptionsPanel :options="options" :unit="unit" />
      </div>

      <div v-show="currentTab === 'extras'" class="tab-panel" role="tabpanel">
        <CodeStyleOptions :options="options" :unit="unit" />
      </div>
    </div>
  </div>
</template>

<script>
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import pathThatSvg from 'path-that-svg';
import merge from 'deepmerge';
import menuMixin, { hasValidNumbers } from './menuMixin';
// 3D settings panel
import SpotifyModelOptionsPanel from './SpotifyModelOptionsPanel.vue';
import CodeStyleOptions from './sections/CodeStyleOptions.vue';
import UiIcon from './ui/UiIcon.vue';
import UiTabs from './ui/UiTabs.vue';

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
    textMargin: 4,
    textSize: 10,
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
  mixins: [menuMixin],
  components: {
    SpotifyModelOptionsPanel,
    CodeStyleOptions,
    UiIcon,
    UiTabs,
  },
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
      spotifyCodeUrl: '',
      validSpotifyCode: false,
      spotifyLoaded: false,
      spotifyLoading: false,
      spotifyInvalid: false,
      codeVersion: 0,
      importing: false,
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
        ['spotifyCode', 'qrcode'],
        ['border', 'border'],
        ['subtitle', 'text'],
        ['keychainAttachment', 'attachment'],
      ];
    },
    spotifyStatus() {
      if (this.spotifyLoading) return 'loading';
      if (this.spotifyInvalid) return 'invalid';
      if (this.spotifyLoaded && this.validSpotifyCode) return 'valid';
      return '';
    },
  },
  watch: {
    // Spotify Codes have a fixed aspect ratio of 4:1
    'options.base.width': function syncHeight(width) {
      if (!this.importing && typeof width === 'number') {
        this.options.base.height = width * 0.25;
      }
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.downloadTimer);
  },
  methods: {
    getExportableOptions() {
      return JSON.parse(JSON.stringify(this.options));
    },
    importOptions(newOptions) {
      this.importing = true;
      this.options = merge(this.options, newOptions);
      this.$nextTick(() => {
        this.importing = false;
        if (this.options.spotifyUri) {
          this.downloadSpotifyCode();
        }
      });
    },
    signatureSource() {
      return { ...this.options, codeVersion: this.codeVersion };
    },
    isReadyForAutoUpdate() {
      return hasValidNumbers(this.options, defaultOptions) && this.spotifyLoaded && this.validSpotifyCode;
    },
    async setup3dObject(ticket) {
      try {
        const loader = new SVGLoader();
        const spotifyPreview = document.querySelector('#spotify-code-preview');

        if (!spotifyPreview || !spotifyPreview.contentDocument) {
          throw new Error('Spotify code preview not loaded');
        }

        const svgElement = spotifyPreview.contentDocument.querySelector('svg');
        if (!svgElement) {
          throw new Error('SVG element not found in Spotify code preview');
        }

        let svg = svgElement.outerHTML;
        svg = svg.replace('<rect x="0" y="0" width="400" height="100" fill="#000000"/>', '');

        const pathedSvg = await pathThatSvg(svg);
        const svgData = loader.parse(pathedSvg);

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

        if (processedShapes.length === 0) {
          throw new Error('No valid shapes found in Spotify code');
        }

        await this.requestModel(ticket, {
          mode: 'Spotify',
          spotifyCodeShapes: processedShapes,
          options: this.options,
        });
      } catch (error) {
        console.error('Error processing Spotify code:', error);
        this.failGeneration(ticket, `Failed to process Spotify code: ${error.message}`);
      }
    },
    async generate3dModel() {
      const ticket = this.beginGeneration();
      if (!this.validSpotifyCode || !this.spotifyCodeUrl) {
        this.failGeneration(ticket, this.$t('errorNoSpotify'));
        return;
      }
      await this.setup3dObject(ticket);
    },
    scheduleDownload() {
      window.clearTimeout(this.downloadTimer);
      this.downloadTimer = window.setTimeout(this.downloadSpotifyCode, 700);
    },
    parseSpotifyUri(input) {
      const value = (input || '').trim();
      if (!value) {
        return null;
      }
      if (value.startsWith('spotify:')) {
        return value;
      }
      const regex = /spotify\.com\/(?:.*\/)*([^/]+)\/([^?/]+)/gm;
      const parts = regex.exec(value);
      if (!parts || parts.length !== 3) {
        return null;
      }
      return `spotify:${parts[1]}:${parts[2]}`;
    },
    async downloadSpotifyCode() {
      window.clearTimeout(this.downloadTimer);
      const uri = this.parseSpotifyUri(this.options.spotifyUri);
      if (!uri) {
        if (this.options.spotifyUri.trim()) {
          console.error('Not a valid Spotify URI or Link');
        }
        this.spotifyInvalid = !!this.options.spotifyUri.trim();
        this.validSpotifyCode = false;
        this.spotifyLoaded = false;
        return;
      }
      if (uri === this.loadedUri && this.spotifyLoaded) {
        return;
      }
      this.loadedUri = uri;
      this.spotifyInvalid = false;
      this.spotifyLoading = true;
      this.spotifyLoaded = false;
      try {
        const spotifyCodeSvgUrl = `https://scannables.scdn.co/uri/plain/svg/000000/white/640/${uri}`;
        const response = await fetch(spotifyCodeSvgUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const svgString = await response.text();
        if (uri !== this.loadedUri) {
          return;
        }
        if (this.spotifyCodeUrl) {
          URL.revokeObjectURL(this.spotifyCodeUrl);
        }
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        this.validSpotifyCode = true;
        this.spotifyCodeUrl = URL.createObjectURL(svgBlob);
      } catch (error) {
        console.error('Could not load Spotify code:', error);
        if (uri === this.loadedUri) {
          this.validSpotifyCode = false;
          this.spotifyInvalid = true;
          this.spotifyLoading = false;
        }
      }
    },
    onPreviewLoad() {
      this.validSpotifyCode = true;
      this.spotifyLoading = false;
      this.spotifyLoaded = true;
      this.codeVersion += 1;
    },
    onPreviewError() {
      this.validSpotifyCode = false;
      this.spotifyLoading = false;
      this.spotifyLoaded = false;
      this.spotifyInvalid = true;
    },
  },
};
</script>

<style>
.content-card__fa {
  color: #1db954;
  font-size: 17px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-3);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
}

.status-pill .svg-icon {
  width: 15px;
  height: 15px;
}

.status-pill--ok {
  color: var(--accent-text);
}

.status-pill--error {
  color: var(--danger-text);
}

.spotify-preview {
  margin: 0;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: #000;
}

#spotify-code-preview {
  display: block;
  width: 100%;
  max-width: 100%;
  pointer-events: none;
}
</style>
