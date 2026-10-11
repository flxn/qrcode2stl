<template>
  <UiPopover placement="bottom-start" :width="300" panel-class="tool-menu">
    <template #trigger="{ toggle, open }">
      <button
        type="button" class="btn btn--ghost tool-switcher"
        :aria-label="t('crossPromo.moreTools')" :data-tip="t('crossPromo.moreTools')"
        aria-haspopup="menu" :aria-expanded="open ? 'true' : 'false'" @click="toggle"
      >
        <UiIcon name="box" />
        <span class="tool-switcher__label">{{ t('crossPromo.moreTools') }}</span>
        <UiIcon name="chevron-down" class="tool-switcher__chevron" />
      </button>
    </template>
    <a
      v-for="tool in tools" :key="tool.id" class="menu-item tool-menu__item"
      :href="tool.url" role="menuitem" target="_blank" rel="noopener"
        data-umami-event="tool-promotion"
        :data-umami-event-source="currentTool"
        :data-umami-event-destination="tool.id"
        data-umami-event-placement="header"
    >
      <img :src="tool.icon" alt="" width="36" height="36" />
      <span class="tool-menu__copy">
        <strong>{{ tool.name }}</strong>
        <span>{{ t(tool.descriptionKey) }}</span>
      </span>
      <UiIcon name="arrow-up-right" />
    </a>
    <div class="menu-divider"></div>
    <a
      class="menu-item" href="https://printer.tools" role="menuitem" target="_blank" rel="noopener"
      data-umami-event="tool-promotion" :data-umami-event-source="currentTool"
      data-umami-event-destination="printer.tools" data-umami-event-placement="header"
    >
      <span class="menu-item__label">{{ t('crossPromo.allTools') }}</span>
      <UiIcon name="arrow-up-right" />
    </a>
  </UiPopover>
</template>
<script>
import UiPopover from './ui/UiPopover.vue';
import UiIcon from './ui/UiIcon.vue';
import { currentTool, relatedTools } from '../cross-promotion/tools';
export default {
  name: 'ToolSwitcher',
  components: { UiPopover, UiIcon },
  data() { return { currentTool, tools: relatedTools }; },
  methods: { t(key) { return this.$t(key); } },
};
</script>
<style>
.brand-group { display: inline-flex; align-items: center; flex-shrink: 0; gap: 2px; }
.brand-group .brand { margin-right: 0; }
.tool-switcher { height: 36px; gap: 6px; padding: 0 8px; white-space: nowrap; }
.tool-switcher__chevron { width: 12px; height: 12px; }
.tool-menu { max-width: calc(100vw - 16px); }
.tool-menu__item { align-items: center; gap: 12px; padding: 12px 10px; white-space: normal; }
.tool-menu__item img { flex: none; object-fit: contain; }
.tool-menu__copy { display: grid; flex: 1; gap: 3px; min-width: 0; }
.tool-menu__copy strong { font-size: 14px; color: var(--text); font-weight: 600; }
.tool-menu__copy > span { color: var(--text-2); font-size: 12px; line-height: 1.45; }
.tool-menu__item > .svg-icon { width: 14px; height: 14px; flex: none; }
.app-header__inner.is-compact .tool-switcher__label,
.app-header__inner.is-compact .tool-switcher__chevron { display: none; }
@media (max-width: 1100px) {
  .tool-switcher__label, .tool-switcher__chevron { display: none; }
  .tool-switcher { width: 32px; padding: 0; }
}
</style>
