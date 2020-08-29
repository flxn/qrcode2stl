<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/logo.png" />
      </a>

      <p class="is-hidden-mobile navbar-item" v-if="showShareNotice">
        <i class="fa fa-arrow-up shake-vertical"></i>
        <span style="margin: 0 10px;">{{$t('headerShareNotice')}}</span>
        <i class="fa fa-arrow-up shake-vertical"></i>
      </p>

      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': navbarOpen }"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleNavigation"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': navbarOpen }">
      <div class="navbar-end">
        <div class="navbar-item" v-if="showThankYou">
          <div class="notification is-danger">
            <i class="fa fa-heart"></i> <span>{{$t('thankYou')}}</span>
          </div>
        </div>
        <div class="navbar-item">
          <LanguageSelector />
        </div>
        <div class="navbar-item">
          <ShareButtons />
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" href="https://paypal.me/fstein42" target="_blank" @click="showThanks">
              <span class="icon">
                <i class="fab fa-paypal"></i>
              </span>
              <span>{{$t('supportMe')}}</span>
            </a>
          </div>
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" href="https://github.com/flxn/qrcode2stl" target="_blank">
              <span class="icon">
                <i class="fab fa-github"></i>
              </span>
              <span>{{$t('viewOnGithub')}}</span>
            </a>
          </div>
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a :class="{'button': true, 'is-info': newVersion, 'unread': newVersion}" @click="openChangelogModal">
              <span class="icon">
                <i class="fa fa-box"></i>
              </span>
              <span>v{{appVersion}}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import ShareButtons from './ShareButtons.vue';
import LanguageSelector from './LanguageSelector.vue';
import packageJson from '../../package.json';
import { bus } from '../main';

export default {
  name: 'Header',
  components: {
    ShareButtons,
    LanguageSelector,
  },
  data() {
    return {
      navbarOpen: false,
      showThankYou: false,
      appVersion: packageJson.version,
      newVersion: false,
      showShareNotice: false,
    };
  },
  methods: {
    toggleNavigation() {
      this.navbarOpen = !this.navbarOpen;
    },
    showThanks() {
      this.showThankYou = true;
    },
    openChangelogModal() {
      bus.$emit('openChangelogModal');
      window.localStorage.setItem('lastViewedVersion', this.appVersion);
      this.newVersion = false;
    },
  },
  created() {
    const lastViewedVersion = window.localStorage.getItem('lastViewedVersion') || '';
    if (lastViewedVersion !== this.appVersion) {
      this.newVersion = true;
    }
    bus.$on('exportReady', () => { this.showShareNotice = true; });
  },
};
</script>

<style>
#site-title {
  font-style: bold;
}

.unread {
  animation: shake-horizontal 1s cubic-bezier(.645,.045,.355,1.000) 2s 1 both;
}

.shake-vertical {
  animation: shake-vertical 2s linear infinite;
}

@keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-3px);
            transform: translateX(-3px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(3px);
            transform: translateX(3px);
  }
  80% {
    -webkit-transform: translateX(2px);
            transform: translateX(2px);
  }
  90% {
    -webkit-transform: translateX(-2px);
            transform: translateX(-2px);
  }
}

@keyframes shake-vertical {
  0%, 40%{
    -webkit-transform: translateY(0);
            transform: translateY(0);
  }
  10%{
    -webkit-transform: translateY(2px);
            transform: translateY(2px);
  }
  30%{
    -webkit-transform: translateY(-5px);
            transform: translateY(-5px);
  }
}
</style>
