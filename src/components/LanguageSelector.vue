<template>
  <UiPopover placement="bottom-end" :width="240">
    <template #trigger="{ toggle, open }">
      <button
        type="button"
        class="btn btn--ghost language-button"
        :class="{ 'is-open': open }"
        aria-haspopup="menu"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-label="$t('changeLanguage')"
        :data-tip="open ? '' : $t('changeLanguage')"
        data-tip-pos="bottom"
        @click="toggle"
      >
        <img class="language-flag" :src="'flags/gif/' + currentLocale + '.gif'" alt="" />
        <UiIcon name="chevron-down" class="language-button__chevron" />
      </button>
    </template>
    <div class="menu-heading">{{ $t('changeLanguage') }}</div>
    <button
      v-for="locale in locales"
      :key="locale"
      type="button"
      class="menu-item"
      :class="{ 'is-active': locale === currentLocale }"
      @click="changeLanguage(locale)"
    >
      <img class="language-flag" :src="'flags/gif/' + locale + '.gif'" alt="" />
      <span class="menu-item__label">{{ $i18n.messages[locale]['languageLocalName'] }}</span>
      <UiIcon v-if="locale === currentLocale" name="check" />
    </button>
    <div class="menu-divider"></div>
    <a
      href="https://github.com/flxn/qrcode2stl#contribute-a-translation"
      class="menu-item"
      rel="nofollow noopener"
      target="_blank"
    >
      <i class="fab fa-github language-menu__fa" aria-hidden="true"></i>
      <span class="menu-item__label">{{ $t('contributeTranslation') }}</span>
    </a>
  </UiPopover>
</template>

<script>
import UiIcon from './ui/UiIcon.vue';
import UiPopover from './ui/UiPopover.vue';

export default {
  name: 'LanguageSelector',
  components: { UiIcon, UiPopover },
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
      document.documentElement.setAttribute('lang', locale);
      window.localStorage.setItem('locale', locale);
      return false;
    },
  },
};
</script>

<style>
.language-button {
  gap: 6px;
  height: 42px;
  padding: 0 8px 0 10px;
}

.language-button.is-open {
  background: var(--surface-hover);
}

.language-button__chevron {
  width: 15px !important;
  height: 15px !important;
  color: var(--text-3);
}

.language-flag {
  width: 22px;
  height: 15px;
  border-radius: 3px;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.language-menu__fa {
  width: 22px;
  color: var(--text-3);
  font-size: 16px;
  text-align: center;
}
</style>
