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

    <!-- qrcode2stl Header -->
    <div v-html="headerAd"></div>

      <div class="navbar-end">
        <div class="navbar-item">
          <LanguageSelector />
        </div>
        <div class="navbar-item">
          <ShareButtons />
        </div>
        <div class="navbar-item" v-if="showThankYou">
          <div class="buttons">
            <a class="button is-danger" href="https://paypal.me/fstein42" target="_blank" @click="showThanks">
              <span class="icon">
                <i class="fa fa-heart"></i>
              </span>
              <span>Thank You!</span>
            </a>
          </div>
        </div>
        <div class="navbar-item" v-if="!showThankYou">
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
      headerAd: '',
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
  mounted() {
    this.headerAd = document.getElementById('adsenseloader-header').innerHTML;
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
  animation: shake-horizontal 1s cubic-bezier(.645,.045,.355,1.000) 1.5s 4;
}

.shake-vertical {
  animation: shake-vertical 2s linear infinite;
}

@keyframes shake-horizontal {
  0%,
  50% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  5%,
  15%,
  25%,
  35% {
    -webkit-transform: translateX(-3px);
            transform: translateX(-3px);
  }
  10%,
  20%,
  30% {
    -webkit-transform: translateX(3px);
            transform: translateX(3px);
  }
  40% {
    -webkit-transform: translateX(2px);
            transform: translateX(2px);
  }
  45% {
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
