<template>
  <div id="main" class="container is-fluid">
    <div class="columns is-multiline">
      <div class="column is-5-widescreen is-5-fullhd is-12">
        <h1 class="title">{{ $t("title") }}</h1>
        <h2 class="subtitle">{{ $t("subtitle") }}</h2>
        <div id="mode-buttons">
          <button class="button is-large" :class="{'is-primary': mode === 'QR'}" @click="changeMode('QR')">
            <span class="icon is-medium">
              <i class="fa fa-qrcode"></i>
            </span>
            <span>QR Code</span>
          </button>
          <button class="button is-large" :class="{'is-primary': mode === 'Spotify'}" @click="changeMode('Spotify')">
            <span class="icon is-medium">
              <i class="fab fa-spotify"></i>
            </span>
            <span>Spotify Code</span>
          </button>
        </div>
        <hr />
        <!-- Menus for modes -->
        <QRCodeMenu v-if="mode === 'QR'" ref="qrcode" :initData="shareData" @generating="isGenerating = true" @exportReady="exportReady"/>
        <SpotifyMenu v-if="mode === 'Spotify'" ref="spotifycode" :initData="shareData" @generating="isGenerating = true" @exportReady="exportReady"/>

      </div>
      <div class="column is-7-widescreen is-7-fullhd is-12">
        <div class="columns">
          <div class="column">
            <p class="title">{{$t('preview')}}</p>
            <p class="subtitle">{{ $t("controlsHint") }}</p>
          </div>
          <div class="column is-2" v-if="showExport">
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
          <div class="column is-3" v-if="showExport">
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
          <div class="column is-3" style="padding-top: 2rem" v-if="showExport">
            <button class="button export-button is-primary is-medium" @click="exportSTL">
              <span class="icon">
                <i class="fa fa-download"></i>
              </span>
              <span>{{$t('saveAsButton')}}</span>
            </button>
          </div>
        </div>
        <hr />
        <div v-if="isGenerating" class="has-text-centered">
          <p class="title">{{$t('isGenerating')}}</p>
          <hr>
        </div>
        <div id="container3d" :class="{ 'is-loading': isGenerating }"></div>
        <br/>
        <a class="title is-4" href="#printguide"><i class="fa fa-angle-double-down"></i> {{$t('scrollDownForGuide')}}</a>
        <br/>
        <Promotions />
      </div>
    </div>

    <PrintGuide />
    <div class="content container">
      <h2 class="title">Changelog</h2>
      <hr>
      <vue-markdown :source="changelog" class="content"></vue-markdown>
    </div>
    <ChangelogModal v-if="changelogModalVisible"/>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
// eslint-disable-next-line import/no-webpack-loader-syntax
import changelog from 'raw-loader!../../CHANGELOG.md';
import ChangelogModal from './ChangelogModal.vue';
import { bus } from '../main';
import QRCodeMenu from './QRCodeMenu.vue';
import SpotifyMenu from './SpotifyMenu.vue';
import PrintGuide from './PrintGuide.vue';
import Promotions from './Promotions.vue';

const shareHashMarker = '#share';

export default {
  name: 'Main',
  props: {
    msg: String,
  },
  components: {
    QRCodeMenu,
    SpotifyMenu,
    PrintGuide,
    ChangelogModal,
    VueMarkdown,
    Promotions,
  },
  data() {
    return {
      mode: 'QR',
      showExport: true,
      stlType: 'binary',
      multipleParts: false,
      changelogModalVisible: false,
      changelog: changelog.split('\n').slice(3).join('\n'),
      shareData: null,
      isGenerating: false,
    };
  },
  created() {
    bus.$on('openChangelogModal', () => { this.changelogModalVisible = true; });
    bus.$on('closeChangelogModal', () => { this.changelogModalVisible = false; });
    this.parseUrlShareHash();
  },
  methods: {
    changeMode(mode) {
      window.location.hash = '';
      this.shareData = null;
      this.mode = mode;
    },
    exportSTL() {
      if (this.mode === 'QR') {
        this.$refs.qrcode.exportSTL(this.stlType, this.multipleParts);
      } else if (this.mode === 'Spotify') {
        this.$refs.spotifycode.exportSTL(this.stlType, this.multipleParts);
      }
    },
    parseUrlShareHash() {
      if (window.location.hash.startsWith(shareHashMarker)) {
        const rawShareData = window.location.hash.substring(shareHashMarker.length).split('-');
        // eslint-disable-next-line prefer-destructuring
        const mode = rawShareData[0];
        if (mode !== 'Spotify' && mode !== 'QR') {
          return;
        }
        this.mode = mode;
        try {
          this.shareData = Object.assign(JSON.parse(atob(rawShareData[1])), { mode });
        } catch (error) {
          this.shareData = null;
          console.error('Invalid Sharing URL');
          window.location.hash = '';
        }
      }
    },
    exportReady(options) {
      console.log('Options Ready:', options);
      this.showExport = true;
      window.location.hash = `${shareHashMarker}${this.mode}-${btoa(JSON.stringify(options))}`;
      this.isGenerating = false;
      bus.$emit('exportReady');
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
</style>
