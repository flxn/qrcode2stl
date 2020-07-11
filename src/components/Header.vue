<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/logo.png" />
      </a>

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
      </div>
    </div>
  </nav>
</template>

<script>
import ShareButtons from './ShareButtons.vue';
import LanguageSelector from './LanguageSelector.vue';

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
    };
  },
  methods: {
    toggleNavigation() {
      this.navbarOpen = !this.navbarOpen;
      console.log(this.navbarOpen);
    },
    showThanks() {
      this.showThankYou = true;
    },
  },
};
</script>

<style>
#site-title {
  font-style: bold;
}
</style>
