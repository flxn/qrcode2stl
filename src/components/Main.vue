<template>
  <div class="app-shell">
    <Header
      :mode="mode"
      :header-ad="headerAd"
      :show-header-ad="!!headerAd && headerAdInHeader"
      @change-mode="changeMode"
      @open-batch="openBatchMode"
    />

    <main id="main" class="workbench">
      <h1 class="sr-only" itemprop="name">{{ $t('title') }}</h1>
      <p class="sr-only" itemprop="description">{{ $t('subtitle') }}</p>

      <aside class="sidebar" :aria-label="$t('settingsPanel')">
        <keep-alive>
          <component
            :is="menuComponent"
            ref="menu"
            :scene="modelScene"
            :exporter="exporter"
            :stl-type="stlType"
            :multiple-parts="multipleParts"
            :tab="activeTab"
            :live-update="liveUpdate"
            @update:tab="activeTab = $event"
            @generating="onGenerating"
            @exportReady="onExportReady"
            @generate-failed="onGenerateFailed"
            @resetScene="resetScene"
            @state="onMenuState"
            @activated="onMenuActivated"
            @qr-image="qrImage = $event"
          />
        </keep-alive>
      </aside>

      <section class="stage" :aria-label="$t('preview')">
        <PreviewViewport
          ref="viewport"
          :theme="themeState.theme"
          :has-model="hasModel"
          :is-generating="isGenerating"
          :is-stale="isStale"
          :live-update="liveUpdate"
          :qr-image="mode === 'QR' ? qrImage : ''"
          :printability-warning="printabilityWarning"
          :empty-hint="emptyHint"
          @update:liveUpdate="setLiveUpdate"
          @generate="generate"
          @ready="onStageReady"
        >
          <template #overlay>
            <ReleaseBanner />
          </template>
        </PreviewViewport>
        <ActionBar
          ref="actionBar"
          :is-generating="isGenerating"
          :is-stale="isStale"
          :has-model="hasModel"
          :stl-type.sync="stlType"
          :multiple-parts.sync="multipleParts"
          :completed-generations="completedGenerations"
          @generate="generate"
          @export-stl="exportSTL"
          @render-png="renderPNG"
          @need-model="onNeedModel"
        />
      </section>
    </main>

    <div class="info-area">
      <div v-if="modelAd" class="ad-slot" v-html="modelAd"></div>
      <div v-if="headerAd && !headerAdInHeader" class="ad-slot" v-html="headerAd"></div>

      <nav class="info-nav" :aria-label="$t('help')">
        <a class="info-nav__link" href="#printguide">
          <UiIcon name="book-open" />
          <span>{{ $t('scrollDownForGuide') }}</span>
        </a>
        <a class="info-nav__link" href="#faq">
          <UiIcon name="help" />
          <span>{{ $t('faqTitle') }}</span>
        </a>
        <a class="info-nav__link" href="#changelog">
          <UiIcon name="scroll-text" />
          <span>Changelog</span>
        </a>
      </nav>

      <PrintGuide />

      <FAQ />

      <section id="changelog" class="info-section">
        <header class="info-section__header">
          <span class="info-section__icon"><UiIcon name="scroll-text" /></span>
          <div>
            <h2 class="info-section__title">Changelog</h2>
            <p class="info-section__subtitle">v{{ appVersion }}</p>
          </div>
        </header>
        <div class="changelog-body" :class="{ 'is-collapsed': !changelogExpanded }">
          <MarkdownRenderer :source="visibleChangelog" class="prose" />
        </div>
        <div class="changelog-toggle">
          <button type="button" class="btn" @click="changelogExpanded = !changelogExpanded">
            <UiIcon :name="changelogExpanded ? 'chevron-up' : 'chevron-down'" />
            <span>{{ changelogExpanded ? $t('showLess') : $t('showFullChangelog') }}</span>
          </button>
        </div>
      </section>
    </div>

    <transition name="modal" :duration="{ enter: 300, leave: 180 }">
      <ChangelogModal v-if="changelogModalVisible" />
    </transition>
    <transition name="modal" :duration="{ enter: 300, leave: 180 }">
      <SettingsModal v-if="settingsModalVisible" />
    </transition>
    <transition name="modal" :duration="{ enter: 300, leave: 180 }">
      <ExportModal
        v-if="exportModal"
        :kind="exportModal"
        @close="exportModal = null"
      />
    </transition>
  </div>
</template>

<script>
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
// eslint-disable-next-line import/no-webpack-loader-syntax
import changelog from '../../CHANGELOG.md?raw';
import packageJson from '../../package.json';
import { bus } from '../main';
import { themeState } from '../theme';
import { getRandomBanner, saveAsArrayBuffer } from '../utils';
import Header from './Header.vue';
import QRCodeMenu from './QRCodeMenu.vue';
import PreviewViewport from './PreviewViewport.vue';
import ActionBar from './ActionBar.vue';
import ChangelogModal from './ChangelogModal.vue';
import ReleaseBanner from './ReleaseBanner.vue';
import UiIcon from './ui/UiIcon.vue';

const LIVE_UPDATE_DELAY = 380;
const EXPORT_DELAY = 5000;
const LIVE_UPDATE_KEY = 'liveUpdate';
const WIDE_HEADER_QUERY = '(min-width: 1780px)';

const readLiveUpdate = () => {
  try {
    return window.localStorage.getItem(LIVE_UPDATE_KEY) !== '0';
  } catch (e) {
    return true;
  }
};

const changelogBody = changelog.split('\n').slice(3).join('\n');
const changelogEntries = changelogBody.split(/\n(?=## )/);

export default {
  name: 'Main',
  components: {
    Header,
    QRCodeMenu,
    SpotifyMenu: () => import('./SpotifyMenu.vue'),
    TextMenu: () => import('./TextMenu.vue'),
    PreviewViewport,
    ActionBar,
    ChangelogModal,
    ReleaseBanner,
    UiIcon,
    SettingsModal: () => import('./SettingsModal.vue'),
    PrintGuide: () => import('./PrintGuide.vue'),
    FAQ: () => import('./FAQ.vue'),
    ExportModal: () => import('./ExportModal.vue'),
    MarkdownRenderer: () => import('./MarkdownRenderer.vue'),
  },
  data() {
    return {
      mode: 'QR',
      activeTab: 'model',
      stlType: 'binary',
      multipleParts: false,
      liveUpdate: readLiveUpdate(),
      isGenerating: false,
      hasModel: false,
      completedGenerations: 0,
      stageReady: false,
      currentSignature: null,
      generatedSignature: null,
      canAutoGenerate: false,
      printabilityWarning: '',
      qrImage: '',
      changelogModalVisible: false,
      settingsModalVisible: false,
      changelogExpanded: false,
      exportModal: null,
      modelAd: '',
      headerAd: '',
      headerAdInHeader: false,
      adblockEnabled: false,
      appVersion: packageJson.version,
      themeState,
    };
  },
  computed: {
    menuComponent() {
      return { QR: 'QRCodeMenu', Spotify: 'SpotifyMenu', Text: 'TextMenu' }[this.mode];
    },
    modelScene() {
      return this.stageReady && this.stage ? this.stage.modelGroup : null;
    },
    isStale() {
      return this.hasModel
        && this.generatedSignature !== null
        && this.currentSignature !== null
        && this.currentSignature !== this.generatedSignature;
    },
    emptyHint() {
      return {
        QR: this.$t('emptyHintQR'),
        Spotify: this.$t('emptyHintSpotify'),
        Text: this.$t('emptyHintText'),
      }[this.mode];
    },
    visibleChangelog() {
      return this.changelogExpanded ? changelogBody : changelogEntries.slice(0, 3).join('\n');
    },
  },
  created() {
    // non-reactive helpers (THREE objects must not become reactive)
    this.exporter = new STLExporter();
    this.stage = null;
    this.autoTimer = null;
    this.exportTimer = null;
    this.autoPending = false;
    this.fitPending = true;
    this.pendingImport = null;
    this.pendingBatch = false;

    bus.$on('openChangelogModal', this.openChangelogModal);
    bus.$on('closeChangelogModal', this.closeChangelogModal);
    bus.$on('openSettingsModal', this.openSettingsModal);
    bus.$on('closeSettingsModal', this.closeSettingsModal);
    bus.$on('requestExportSettings', this.onRequestExportSettings);
    bus.$on('importSettings', this.setActiveMenuOptions);
  },
  mounted() {
    // eslint-disable-next-line camelcase
    if (typeof __google_ad_urls === 'undefined') {
      this.adblockEnabled = true;
      this.modelAd = getRandomBanner('728x90');
    } else {
      this.modelAd = document.getElementById('adsenseloader-model').innerHTML;
    }
    const headerAdSource = document.getElementById('adsenseloader-header');
    this.headerAd = headerAdSource ? headerAdSource.innerHTML : '';

    if (window.matchMedia) {
      this.wideHeaderQuery = window.matchMedia(WIDE_HEADER_QUERY);
      this.onWideHeaderChange();
      if (this.wideHeaderQuery.addEventListener) {
        this.wideHeaderQuery.addEventListener('change', this.onWideHeaderChange);
      }
    }

    window.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    window.clearTimeout(this.autoTimer);
    window.clearTimeout(this.exportTimer);
    window.removeEventListener('keydown', this.onKeydown);
    if (this.wideHeaderQuery && this.wideHeaderQuery.removeEventListener) {
      this.wideHeaderQuery.removeEventListener('change', this.onWideHeaderChange);
    }
    bus.$off('openChangelogModal', this.openChangelogModal);
    bus.$off('closeChangelogModal', this.closeChangelogModal);
    bus.$off('openSettingsModal', this.openSettingsModal);
    bus.$off('closeSettingsModal', this.closeSettingsModal);
    bus.$off('requestExportSettings', this.onRequestExportSettings);
    bus.$off('importSettings', this.setActiveMenuOptions);
  },
  methods: {
    onWideHeaderChange() {
      this.headerAdInHeader = !!(this.wideHeaderQuery && this.wideHeaderQuery.matches);
    },
    onStageReady(stage) {
      this.stage = stage;
      this.stageReady = true;
    },
    changeMode(mode) {
      if (mode === this.mode) {
        return;
      }
      window.clearTimeout(this.autoTimer);
      this.autoPending = false;
      this.mode = mode;
      this.isGenerating = false;
      this.hasModel = false;
      this.generatedSignature = null;
      this.currentSignature = null;
      this.printabilityWarning = '';
      this.qrImage = '';
      this.fitPending = true;
      if (this.$refs.viewport) {
        this.$refs.viewport.clearModel();
      }
    },
    resetScene() {
      if (this.$refs.viewport) {
        this.$refs.viewport.clearModel();
      }
    },
    onGenerating() {
      this.isGenerating = true;
    },
    onExportReady({ signature, restored } = {}) {
      this.isGenerating = false;
      this.generatedSignature = signature || null;
      const first = this.fitPending;
      this.fitPending = false;
      this.hasModel = true;
      if (!restored) {
        this.completedGenerations += 1;
      }
      if (this.$refs.viewport) {
        this.$refs.viewport.modelUpdated({ fit: first, animate: first && !restored });
      }
      if (this.autoPending || this.isStale) {
        this.autoPending = false;
        this.scheduleAutoUpdate();
      }
    },
    onGenerateFailed(message) {
      this.isGenerating = false;
      bus.$emit('toast', { type: 'error', message });
    },
    onMenuState(state) {
      this.currentSignature = state.signature;
      this.canAutoGenerate = state.canAutoGenerate;
      this.printabilityWarning = state.printabilityWarning;
      this.scheduleAutoUpdate();
    },
    onMenuActivated(state) {
      this.onMenuState(state);
      if (this.pendingImport) {
        const options = this.pendingImport;
        this.pendingImport = null;
        this.$nextTick(() => this.applyImport(options));
      }
      if (this.pendingBatch) {
        this.pendingBatch = false;
        this.$nextTick(() => bus.$emit('openBatchMode'));
      }
    },
    setLiveUpdate(value) {
      this.liveUpdate = value;
      try {
        window.localStorage.setItem(LIVE_UPDATE_KEY, value ? '1' : '0');
      } catch (e) {
        // ignore unavailable storage
      }
      bus.$emit('toast', {
        type: 'info',
        icon: 'zap',
        message: value ? this.$t('liveUpdateOn') : this.$t('liveUpdateOff'),
      });
      this.scheduleAutoUpdate();
    },
    scheduleAutoUpdate() {
      window.clearTimeout(this.autoTimer);
      if (!this.liveUpdate || !this.hasModel || !this.isStale || !this.canAutoGenerate) {
        return;
      }
      this.autoTimer = window.setTimeout(() => {
        if (!this.liveUpdate || !this.isStale || !this.canAutoGenerate) {
          return;
        }
        if (this.isGenerating) {
          this.autoPending = true;
          return;
        }
        this.generate();
      }, LIVE_UPDATE_DELAY);
    },
    generate() {
      const { menu } = this.$refs;
      if (!menu || typeof menu.generate3dModel !== 'function') {
        return;
      }
      window.clearTimeout(this.autoTimer);
      this.autoPending = false;
      menu.generate3dModel();
    },
    onNeedModel() {
      bus.$emit('toast', { type: 'info', message: this.$t('generateFirst') });
    },
    exportSTL() {
      if (!this.hasModel) {
        if (this.$refs.actionBar) {
          this.$refs.actionBar.nudge();
        }
        this.onNeedModel();
        return;
      }
      this.startExport('stl');
    },
    renderPNG() {
      if (!this.hasModel) {
        this.onNeedModel();
        return;
      }
      this.startExport('png');
    },
    /** Shows the download dialog; the file is created after the countdown (even if the dialog is closed). */
    startExport(kind) {
      window.clearTimeout(this.exportTimer);
      this.exportModal = kind;
      this.exportTimer = window.setTimeout(() => this.performExport(kind), EXPORT_DELAY);
    },
    performExport(kind) {
      if (kind === 'stl') {
        const { menu } = this.$refs;
        if (!menu || !this.hasModel) {
          return;
        }
        Promise.resolve(menu.exportSTL(this.stlType, this.multipleParts))
          .then(() => bus.$emit('toast', { type: 'success', icon: 'download', message: this.$t('downloadStarted') }))
          .catch((error) => bus.$emit('toast', { type: 'error', message: `${this.$t('exportFailed')}: ${error.message}` }));
      } else if (kind === 'png') {
        if (!this.hasModel) {
          return;
        }
        this.$refs.viewport.renderPNG()
          .then((blob) => {
            saveAsArrayBuffer(blob, `image-${new Date().getTime()}.png`);
            bus.$emit('toast', { type: 'success', icon: 'image', message: this.$t('pngSaved') });
          })
          .catch((error) => bus.$emit('toast', { type: 'error', message: `${this.$t('exportFailed')}: ${error.message}` }));
      }
    },
    openBatchMode() {
      if (this.mode !== 'QR') {
        this.pendingBatch = true;
        this.changeMode('QR');
        bus.$emit('toast', { type: 'info', icon: 'layers', message: this.$t('batchSwitchedToQr') });
        return;
      }
      bus.$emit('openBatchMode');
    },
    openChangelogModal() {
      this.changelogModalVisible = true;
    },
    closeChangelogModal() {
      this.changelogModalVisible = false;
    },
    openSettingsModal() {
      this.settingsModalVisible = true;
    },
    closeSettingsModal() {
      this.settingsModalVisible = false;
    },
    onKeydown(event) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) {
        return;
      }
      if (document.documentElement.classList.contains('has-modal')) {
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        this.generate();
      } else if ((event.key === 's' || event.key === 'S') && !event.shiftKey) {
        event.preventDefault();
        this.exportSTL();
      }
    },
    getActiveMenuOptions() {
      const { menu } = this.$refs;
      return menu ? { mode: this.mode, options: menu.getExportableOptions() } : null;
    },
    onRequestExportSettings() {
      bus.$emit('settingsExported', this.getActiveMenuOptions());
    },
    applyImport(options) {
      const { menu } = this.$refs;
      if (menu && options) {
        menu.importOptions(options);
      }
    },
    setActiveMenuOptions(data) {
      if (!data) {
        return;
      }
      if (data.mode && data.mode !== this.mode && ['QR', 'Spotify', 'Text'].includes(data.mode)) {
        this.pendingImport = data.options;
        this.changeMode(data.mode);
      } else {
        this.applyImport(data.options);
      }
    },
  },
};
</script>

<style>
.app-shell {
  min-height: 100vh;
}

.workbench {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  gap: 16px;
  height: calc(100vh - var(--header-height));
  height: calc(100dvh - var(--header-height));
  min-height: 620px;
  padding: 14px 18px 18px;
}

.sidebar {
  position: relative;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
}

.stage {
  container: stage / inline-size;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 12px;
  min-width: 0;
  min-height: 0;
}

/* ---------- sidebar contents (shared by all modes) ---------- */
.mode-panel {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.content-card {
  display: grid;
  gap: 12px;
  padding: 14px 16px 16px;
  border-bottom: 1px solid var(--border);
}

.content-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 34px;
}

.content-card__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
}

.content-card__title > .svg-icon {
  width: 18px;
  height: 18px;
  color: var(--accent);
}

.mode-tabs {
  position: sticky;
  z-index: 5;
  top: 0;
  background: var(--surface-inset);
}

.tab-panels {
  flex: 1 1 auto;
}

.tab-panel {
  animation: tab-in 260ms var(--ease-out);
}

@keyframes tab-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.tab-panel__body {
  display: grid;
  gap: 14px;
  padding: 16px;
}

.tab-panel__divider {
  height: 1px;
  background: var(--divider);
}

.scan-button {
  height: 44px;
}

.ec-current {
  display: block;
  margin-bottom: 2px;
  color: var(--text-2);
  font-weight: 600;
}

/* ---------- below the workbench ---------- */
.info-area {
  display: grid;
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.ad-slot {
  display: flex;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
}

.ad-slot:empty {
  display: none;
}

.info-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.info-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text-2);
  font-size: 14px;
  font-weight: 500;
  transition: color var(--duration) ease, border-color var(--duration) ease, transform var(--duration-fast) ease;
}

.info-nav__link:hover {
  border-color: var(--accent-soft-border);
  color: var(--accent-text);
  text-decoration: none;
  transform: translateY(-1px);
}

.info-nav__link .svg-icon {
  width: 17px;
  height: 17px;
}

.info-section {
  scroll-margin-top: calc(var(--header-height) + 16px);
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
}

.info-section__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.info-section__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  color: var(--accent-text);
}

.info-section__icon .svg-icon {
  width: 22px;
  height: 22px;
}

.info-section__title {
  margin: 0;
  color: var(--text);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.info-section__subtitle {
  margin: 2px 0 0;
  color: var(--text-3);
  font-size: 15px;
}

.changelog-body {
  position: relative;
}

.changelog-body.is-collapsed::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--surface));
  pointer-events: none;
}

.changelog-toggle {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

/* ---------- responsive ---------- */
@media (max-width: 1240px) {
  .workbench {
    gap: 12px;
    padding: 12px;
  }
}

@media (max-width: 900px) {
  .workbench {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 0;
    padding: 10px;
  }

  .stage {
    display: contents;
  }

  .viewport {
    order: 1;
    height: 58vh;
    min-height: 340px;
  }

  .sidebar {
    order: 2;
    overflow: visible;
  }

  .mode-tabs {
    top: var(--header-height);
  }

  .action-bar {
    position: sticky;
    z-index: 30;
    bottom: 10px;
    order: 3;
    box-shadow: var(--shadow-lg);
  }

  .tool-button__label {
    display: none;
  }

  .info-area {
    padding: 28px 12px 48px;
  }

  .info-section {
    padding: 20px;
  }
}
</style>
