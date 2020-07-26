<template>
  <div id="main" class="container is-fluid">
    <div class="columns is-multiline">
      <div class="column is-5-widescreen is-5-fullhd is-12">
        <h1 class="title">{{ $t("title") }}</h1>
        <h2 class="subtitle">{{ $t("subtitle") }}</h2>
        <div id="mode-buttons">
          <button class="button is-large" :class="{'is-primary': mode === 'QR'}" @click="mode = 'QR'">
            <span class="icon is-medium">
              <i class="fa fa-qrcode"></i>
            </span>
            <span>QR Code</span>
          </button>
          <button class="button is-large" :class="{'is-primary': mode === 'Spotify'}" @click="mode = 'Spotify'">
            <span class="icon is-medium">
              <i class="fab fa-spotify"></i>
            </span>
            <span>Spotify Code</span>
          </button>
        </div>
        <hr />
        <!-- Menus for modes -->
        <QRCodeMenu v-if="mode === 'QR'" ref="qrcode" @exportReady="showExport = true"/>
        <SpotifyMenu v-if="mode === 'Spotify'" ref="spotifycode" @exportReady="showExport = true"/>

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
    <ChangelogModal v-if="changelogModalVisible"/>
  </div>
</template>

<script>
import ChangelogModal from './ChangelogModal.vue';
import { bus } from '../main';
import QRCodeMenu from './QRCodeMenu.vue';
import SpotifyMenu from './SpotifyMenu.vue';
import PrintGuide from './PrintGuide.vue';

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
  },
  data() {
    return {
      mode: 'QR',
      showExport: true,
      stlType: 'binary',
      multipleParts: false,
      changelogModalVisible: false,
    };
  },
  created() {
    bus.$on('openChangelogModal', () => { this.changelogModalVisible = true; });
    bus.$on('closeChangelogModal', () => { this.changelogModalVisible = false; });
  },
  methods: {
    exportSTL() {
      if (this.mode === 'QR') {
        this.$refs.qrcode.exportSTL(this.stlType, this.multipleParts);
      } else if (this.mode === 'Spotify') {
        this.$refs.spotifycode.exportSTL(this.stlType, this.multipleParts);
      }
    },
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
