import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueMarkdown from 'vue-markdown';
import translations from './translations/loader';

import App from './App.vue';

import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';

Vue.config.productionTip = false;

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: window.localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: translations,
});

Vue.use(VueMarkdown);

// eslint-disable-next-line import/prefer-default-export
export const bus = new Vue();

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
