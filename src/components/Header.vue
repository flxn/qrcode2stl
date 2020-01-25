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
        <div class="navbar-item">
          <ShareButtons />
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" href="https://ko-fi.com/flxn256" target="_blank">
              <span class="icon">
                <img
                  src="../assets/cup-border.png"
                  width="24"
                  loading="lazy"
                  alt="Support Me on Ko-Fi"
                />
              </span>
              <span>Support Me</span>
            </a>
          </div>
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" href="https://github.com/flxn/qrcode2stl" target="_blank">
              <span class="icon">
                <i class="fab fa-github"></i>
              </span>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import ShareButtons from './ShareButtons.vue';

export default {
  name: 'Header',
  components: {
    ShareButtons,
  },
  data() {
    return {
      navbarOpen: false,
    };
  },
  methods: {
    toggleNavigation() {
      this.navbarOpen = !this.navbarOpen;
      console.log(this.navbarOpen);
    },
  },
};
</script>

<style>
#site-title {
  font-style: bold;
}
</style>
