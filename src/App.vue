<template>
  <div id="app">
    <Main />
    <Footer />
    <ToastHost />
  </div>
</template>

<script>
import Main from './components/Main.vue';
import Footer from './components/Footer.vue';
import ToastHost from './components/ToastHost.vue';

export default {
  name: 'app',
  components: {
    Main,
    Footer,
    ToastHost,
  },
};
</script>
