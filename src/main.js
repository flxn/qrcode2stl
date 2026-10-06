import Vue from 'vue';
import VueI18n from 'vue-i18n';
import translations from './translations/loader';
import autosize from './directives/autosize';
import './theme';

import App from './App.vue';

import '@fortawesome/fontawesome-free/css/all.css';
import './main.css';

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.directive('autosize', autosize);

const locale = window.localStorage.getItem('locale') || 'en';
document.documentElement.setAttribute('lang', locale);

const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages: translations,
  // most locales fall back to English for newer strings; that is expected
  silentFallbackWarn: true,
});

// eslint-disable-next-line import/prefer-default-export
export const bus = new Vue();

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
