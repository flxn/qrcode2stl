<template>
  <div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
        <span><img :src="'flags/gif/' + currentLocale + '.gif'"/> {{$t("changeLanguage")}}</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a href="#" class="dropdown-item" v-for="locale in locales" :key="locale" @click="changeLanguage(locale)">
          <img :src="'flags/gif/' + locale + '.gif'"/> {{ locale }}
        </a>
        <hr class="dropdown-divider">
        <a href="#" class="dropdown-item" rel="nofollow noopener" target="_blank">
          {{$t('contributeTranslation')}}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguageSelector',
  data() {
    return {
      currentLocale: this.$i18n.locale,
      locales: this.$i18n.availableLocales,
    };
  },
  methods: {
    changeLanguage(locale) {
      this.$i18n.locale = locale;
      this.currentLocale = locale;
      window.localStorage.setItem('locale', locale);
    },
  },
};
</script>

<style>

</style>
