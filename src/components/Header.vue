<template>
  <header class="app-header">
    <div ref="inner" class="app-header__inner">
      <a class="brand" href="/" aria-label="QR2STL">
        <img src="../assets/logo.png" alt="QR2STL" class="brand__logo" width="152" height="30" />
      </a>

      <nav class="mode-switch" aria-label="QR Code type selection">
        <UiSegmented
          :value="mode"
          variant="accent"
          size="lg"
          :options="modeOptions"
          aria-label="QR Code type selection"
          tip-pos="bottom"
          @input="$emit('change-mode', $event)"
        />
      </nav>

      <div v-if="showHeaderAd" class="header-ad" v-html="headerAd"></div>

      <div class="app-header__spacer"></div>

      <div class="app-header__actions">
        <button
          type="button"
          class="btn header-btn"
          :data-tip="$t('importExportSettings')"
          data-tip-pos="bottom"
          @click="openSettingsModal"
        >
          <UiIcon name="settings" />
          <span class="header-btn__label">{{ $t('importExportSettings') }}</span>
        </button>
        <button
          type="button"
          class="btn header-btn"
          :data-tip="mode === 'QR' ? $t('batchMode') : $t('batchModeQrOnly')"
          data-tip-pos="bottom"
          @click="$emit('open-batch')"
        >
          <UiIcon name="layers" />
          <span class="header-btn__label">{{ $t('batchMode') }}</span>
        </button>

        <UiPopover placement="bottom-end" :width="300" panel-class="help-menu">
          <template #trigger="{ toggle, open }">
            <button
              type="button"
              class="btn btn--ghost header-btn"
              :class="{ 'is-open': open }"
              aria-haspopup="menu"
              :aria-expanded="open ? 'true' : 'false'"
              @click="toggle"
            >
              <UiIcon name="help" />
              <span class="header-btn__label">{{ $t('help') }}</span>
              <span v-if="newVersion" class="dot-badge" aria-hidden="true"></span>
            </button>
          </template>
          <div class="menu-heading">{{ $t('help') }}</div>
          <button type="button" class="menu-item" @click="scrollTo('printguide')">
            <UiIcon name="book-open" />
            <span class="menu-item__label">{{ $t('printGuideTitle') }}</span>
          </button>
          <button type="button" class="menu-item" @click="scrollTo('faq')">
            <UiIcon name="help" />
            <span class="menu-item__label">{{ $t('faqTitle') }}</span>
          </button>
          <button type="button" class="menu-item" @click="openChangelogModal">
            <UiIcon name="scroll-text" />
            <span class="menu-item__label">Changelog</span>
            <span v-if="newVersion" class="badge">{{ $t('new') }}</span>
            <span class="menu-item__meta">v{{ appVersion }}</span>
          </button>

          <div class="menu-divider"></div>
          <div class="menu-heading">{{ $t('shortcuts') }}</div>
          <div class="shortcut-row">
            <span>{{ $t('generateButton') }}</span>
            <span class="shortcut-keys"><span class="kbd">{{ modifier }}</span><span class="kbd">↵</span></span>
          </div>
          <div class="shortcut-row">
            <span>{{ $t('saveAsButton') }}</span>
            <span class="shortcut-keys"><span class="kbd">{{ modifier }}</span><span class="kbd">S</span></span>
          </div>
          <div class="shortcut-row">
            <span>{{ $t('scrubHint') }}</span>
            <span class="shortcut-keys"><span class="kbd">⇧</span><span class="kbd">↑↓</span></span>
          </div>

          <div class="menu-divider"></div>
          <a class="menu-item" href="https://github.com/flxn/qrcode2stl" target="_blank" rel="noopener">
            <i class="fab fa-github menu-item__fa" aria-hidden="true"></i>
            <span class="menu-item__label">{{ $t('viewOnGithub') }}</span>
            <UiIcon name="arrow-up-right" />
          </a>
          <a
            class="menu-item support-item"
            :class="{ 'is-thanked': showThankYou }"
            href="https://paypal.me/fstein42"
            target="_blank"
            rel="noopener"
            @click="showThanks"
          >
            <UiIcon name="heart" />
            <span class="menu-item__label">{{ showThankYou ? 'Thank You!' : $t('supportMe') }}</span>
            <UiIcon name="arrow-up-right" />
          </a>
          <div class="menu-divider"></div>
          <div class="menu-heading">{{ $t('shareButtonTitle') }}</div>
          <ShareButtons class="help-menu__share" />
        </UiPopover>

        <LanguageSelector />

        <button
          type="button"
          class="btn btn--ghost btn--icon theme-toggle"
          :aria-label="themeLabel"
          :data-tip="themeLabel"
          data-tip-pos="bottom"
          data-tip-align="end"
          @click="toggleTheme"
        >
          <transition name="icon-swap" mode="out-in">
            <UiIcon :key="themeState.theme" :name="themeState.theme === 'dark' ? 'sun' : 'moon'" />
          </transition>
        </button>
      </div>
    </div>

  </header>
</template>

<script>
import ShareButtons from './ShareButtons.vue';
import LanguageSelector from './LanguageSelector.vue';
import UiIcon from './ui/UiIcon.vue';
import UiSegmented from './ui/UiSegmented.vue';
import UiPopover from './ui/UiPopover.vue';
import packageJson from '../../package.json';
import { bus } from '../main';
import { themeState, toggleTheme } from '../theme';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export default {
  name: 'Header',
  components: {
    ShareButtons,
    LanguageSelector,
    UiIcon,
    UiSegmented,
    UiPopover,
  },
  props: {
    mode: {
      type: String,
      default: 'QR',
    },
    headerAd: {
      type: String,
      default: '',
    },
    showHeaderAd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showThankYou: false,
      appVersion: packageJson.version,
      newVersion: false,
      themeState,
    };
  },
  computed: {
    modeOptions() {
      return [
        { value: 'QR', label: 'QR Code', icon: 'qr-code' },
        { value: 'Spotify', label: 'Spotify Code', fa: 'fab fa-spotify' },
        { value: 'Text', label: 'Text', icon: 'letter-a' },
      ];
    },
    modifier() {
      return isMac ? '⌘' : 'Ctrl';
    },
    themeLabel() {
      return this.themeState.theme === 'dark' ? this.$t('themeLight') : this.$t('themeDark');
    },
  },
  created() {
    const lastViewedVersion = window.localStorage.getItem('lastViewedVersion') || '';
    if (lastViewedVersion !== this.appVersion) {
      this.newVersion = true;
    }
  },
  mounted() {
    bus.$on('openWhatsNew', this.openChangelogModal);
    this.fitHeader();
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.fitHeader());
      this.resizeObserver.observe(this.$el);
    }
    this.unwatchLocale = this.$watch(() => this.$i18n.locale, () => {
      this.$nextTick(this.fitHeader);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.fitHeader());
    }
  },
  beforeDestroy() {
    bus.$off('openWhatsNew', this.openChangelogModal);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.unwatchLocale) {
      this.unwatchLocale();
    }
  },
  methods: {
    showThanks() {
      this.showThankYou = true;
    },
    openChangelogModal() {
      bus.$emit('openChangelogModal');
      window.localStorage.setItem('lastViewedVersion', this.appVersion);
      this.newVersion = false;
    },
    openSettingsModal() {
      // rendered by Main: fixed overlays must not live inside the blurred sticky header
      bus.$emit('openSettingsModal');
    },
    scrollTo(id) {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    toggleTheme() {
      toggleTheme();
    },
    /** Hides the button labels only when they would not fit (labels differ a lot per language). */
    fitHeader() {
      const { inner } = this.$refs;
      if (!inner) {
        return;
      }
      inner.classList.remove('is-compact');
      const overflows = inner.scrollWidth > inner.clientWidth + 1;
      inner.classList.toggle('is-compact', overflows);
    },
  },
};
</script>

<style>
.app-header {
  position: sticky;
  z-index: 50;
  top: 0;
  height: var(--header-height);
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: saturate(1.4) blur(14px);
  -webkit-backdrop-filter: saturate(1.4) blur(14px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 18px;
  height: 100%;
  padding: 0 18px;
}

.brand {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  margin-right: 6px;
  padding: 6px 4px;
  border-radius: var(--radius-sm);
}

.brand__logo {
  width: auto;
  height: 28px;
  filter: var(--logo-filter);
}

.mode-switch {
  flex-shrink: 0;
}

.mode-switch .segmented {
  gap: 4px;
  padding: 3px;
  border-color: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface-inset);
}

.mode-switch .segmented__indicator {
  border-radius: calc(var(--radius-md) - 3px);
}

.mode-switch .segmented__item {
  height: 40px;
  padding: 0 18px;
  gap: 10px;
  border-radius: calc(var(--radius-md) - 3px);
  font-size: 15px;
}

.mode-switch .segmented__item .svg-icon,
.mode-switch .segmented__item .fab {
  width: 20px;
  height: 20px;
  font-size: 19px;
}

.header-ad {
  display: flex;
  align-items: center;
  max-height: 60px;
  overflow: hidden;
}

.app-header__spacer {
  flex: 1 1 auto;
}

.app-header__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
}

.header-btn {
  height: 42px;
}

.header-btn.is-open {
  background: var(--surface-hover);
  color: var(--text);
}

.theme-toggle {
  width: 42px;
  height: 42px;
}

.help-menu .menu-item__fa {
  width: 17px;
  color: var(--text-3);
  font-size: 16px;
  text-align: center;
}

.help-menu .menu-item > .svg-icon:last-child:not(:first-child) {
  width: 14px;
  height: 14px;
}

.support-item.is-thanked,
.support-item.is-thanked > .svg-icon:first-child {
  color: var(--danger);
}

.support-item.is-thanked > .svg-icon:first-child {
  fill: currentColor;
}

.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
  padding: 0 10px;
  color: var(--text-2);
  font-size: 13px;
}

.shortcut-keys {
  display: inline-flex;
  gap: 3px;
}

.help-menu__share {
  padding: 2px 6px 6px;
}

.app-header__inner.is-compact .header-btn__label {
  display: none;
}

.app-header__inner.is-compact .header-btn {
  width: 42px;
  padding: 0;
}

@media (max-width: 1080px) {
  .mode-switch .segmented__item {
    padding: 0 12px;
    font-size: 14px;
  }
}

@media (max-width: 760px) {
  .app-header__inner {
    gap: 10px;
    padding: 0 12px;
  }

  .header-btn__label {
    display: none;
  }

  .brand__logo {
    height: 22px;
  }

  .mode-switch .segmented__item span {
    display: none;
  }

  .mode-switch .segmented__item {
    width: 46px;
    padding: 0;
  }

  .app-header__actions {
    gap: 2px;
  }

  .app-header__actions .header-btn,
  .app-header__actions .theme-toggle {
    width: 38px;
    border-color: transparent;
    background: transparent;
  }
}

@media (max-width: 520px) {
  .brand {
    display: none;
  }

  .app-header__inner {
    gap: 8px;
    padding: 0 8px;
  }

  .mode-switch .segmented__item {
    width: 42px;
  }

  .app-header__actions .header-btn,
  .app-header__actions .theme-toggle {
    width: 34px;
  }

  .language-button {
    padding: 0 6px;
  }

  .language-button__chevron {
    display: none;
  }
}
</style>
