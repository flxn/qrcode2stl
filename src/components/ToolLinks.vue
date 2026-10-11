<template>
  <nav class="sibling-tools" :aria-label="t('crossPromo.moreTools')">
    <span>{{ t('crossPromo.footer') }}</span>
    <a v-for="tool in tools" :key="tool.id" :href="tool.url" target="_blank" rel="noopener"
        data-umami-event="tool-promotion"
        :data-umami-event-source="currentTool"
        :data-umami-event-destination="tool.id"
        data-umami-event-placement="footer">
      <img :src="tool.icon" alt="" width="22" height="22" loading="lazy" />
      {{ tool.name }}
    </a>
  </nav>
</template>
<script>

import { currentTool, relatedTools } from '../cross-promotion/tools';
export default {
  name: 'ToolLinks',
  components: {  },
  data() { return { currentTool, tools: relatedTools }; },
  methods: { t(key) { return this.$t(key); } },
};
</script>
<style>
.sibling-tools { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px 18px; }
.sibling-tools a { display: inline-flex; align-items: center; gap: 6px; color: var(--text-2); font-weight: 500; }
.sibling-tools img { object-fit: contain; flex: none; }
.sibling-tools a:hover { color: var(--accent-text); }
</style>
