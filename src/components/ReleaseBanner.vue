<template>
  <transition name="release-banner">
    <div v-if="visible" class="release-banner" role="status">
      <button type="button" class="release-banner__main" @click="openWhatsNew">
        <span class="release-banner__badge">
          <UiIcon name="sparkles" />
          {{ release }}
        </span>
        <span class="release-banner__text">{{ $t('releaseBanner') }}</span>
        <span class="release-banner__cta">
          {{ $t('releaseBannerCta') }}
          <UiIcon name="chevron-right" />
        </span>
      </button>
      <button
        type="button"
        class="release-banner__close"
        :aria-label="$t('releaseBannerDismiss')"
        :title="$t('releaseBannerDismiss')"
        @click="dismiss"
      >
        <UiIcon name="x" />
      </button>
    </div>
  </transition>
</template>

<script>
import packageJson from '../../package.json';
import { bus } from '../main';
import UiIcon from './ui/UiIcon.vue';

const STORAGE_KEY = 'releaseBannerDismissed';
// major.minor, so patch releases do not bring the banner back
const RELEASE = packageJson.version.split('.').slice(0, 2).join('.');

const readDismissed = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === RELEASE;
  } catch (e) {
    return false;
  }
};

export default {
  name: 'ReleaseBanner',
  components: { UiIcon },
  data() {
    return {
      visible: false,
      release: RELEASE,
    };
  },
  mounted() {
    // appear shortly after load so it reads as news rather than part of the layout
    this.showTimer = window.setTimeout(() => {
      this.visible = !readDismissed();
    }, 700);
  },
  beforeDestroy() {
    window.clearTimeout(this.showTimer);
  },
  methods: {
    dismiss() {
      this.visible = false;
      try {
        window.localStorage.setItem(STORAGE_KEY, RELEASE);
      } catch (e) {
        // storage unavailable: the banner just hides for this session
      }
    },
    openWhatsNew() {
      bus.$emit('openWhatsNew');
      this.dismiss();
    },
  },
};
</script>

<style>
.release-banner {
  position: absolute;
  z-index: 4;
  bottom: 14px;
  left: 50%;
  display: flex;
  align-items: center;
  /* leaves room for the 2D QR thumbnail and the size chip */
  max-width: calc(100% - 400px);
  padding: 4px;
  border: 1px solid var(--accent-soft-border);
  border-radius: 999px;
  background: var(--viewport-chrome);
  box-shadow: var(--shadow-md);
  transform: translateX(-50%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.release-banner__main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0 6px 0 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  white-space: nowrap;
}

.release-banner__badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--accent-fill);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.release-banner__badge .svg-icon {
  width: 14px;
  height: 14px;
}

.release-banner__text {
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
}

.release-banner__cta {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
  color: var(--accent-text);
  font-weight: 600;
}

.release-banner__cta .svg-icon {
  width: 15px;
  height: 15px;
  transition: transform var(--duration) var(--ease-out);
}

.release-banner__main:hover .release-banner__cta .svg-icon {
  transform: translateX(3px);
}

.release-banner__main:focus-visible,
.release-banner__close:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.release-banner__close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text-3);
  transition: background-color var(--duration) ease, color var(--duration) ease;
}

.release-banner__close:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.release-banner__close .svg-icon {
  width: 15px;
  height: 15px;
}

.release-banner-enter-active {
  transition: opacity 260ms ease, transform 420ms var(--ease-spring);
}

.release-banner-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.release-banner-enter,
.release-banner-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px) scale(0.96);
}

@container stage (max-width: 980px) {
  .release-banner__cta {
    display: none;
  }
}

/* phones: below the toolbar instead of between the bottom chips */
@media (max-width: 900px) {
  .release-banner {
    top: 96px;
    bottom: auto;
    max-width: calc(100% - 24px);
  }

  .release-banner__cta {
    display: none;
  }

  .release-banner-enter,
  .release-banner-leave-to {
    transform: translate(-50%, -10px) scale(0.96);
  }
}
</style>
