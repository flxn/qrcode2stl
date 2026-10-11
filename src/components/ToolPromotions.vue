<template>
  <section class="tool-promotions" aria-labelledby="tool-promotions-title">
    <h2 id="tool-promotions-title">{{ t('crossPromo.title') }}</h2>
    <div class="tool-promotions__grid">
      <a
        v-for="tool in tools" :key="tool.id" class="tool-card" :href="tool.url"
        :style="{ '--tool-accent': tool.accent }" target="_blank" rel="noopener"
        data-umami-event="tool-promotion"
        :data-umami-event-source="currentTool"
        :data-umami-event-destination="tool.id"
        data-umami-event-placement="cards"
      >
        <div class="tool-card__preview">
          <img :src="tool.image" alt="" :width="tool.width" :height="tool.height" loading="lazy" decoding="async" />
        </div>
        <div class="tool-card__copy">
          <h3>{{ tool.name }}</h3>
          <p>{{ t(tool.descriptionKey) }}</p>
        </div>
        <UiIcon name="arrow-up-right" class="tool-card__arrow" />
      </a>
    </div>
  </section>
</template>
<script>
import UiIcon from './ui/UiIcon.vue';
import { currentTool, relatedTools } from '../cross-promotion/tools';
export default {
  name: 'ToolPromotions',
  components: { UiIcon },
  data() { return { currentTool, tools: relatedTools }; },
  methods: { t(key) { return this.$t(key); } },
};
</script>
<style>
.tool-promotions { min-width: 0; }
.tool-promotions > h2 { margin: 0 0 16px; color: var(--text); font-size: 20px; font-weight: 650; }
.tool-promotions__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.tool-card {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 16px;
  align-content: start; align-items: center; gap: 16px; min-width: 0; padding: 16px;
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  background: var(--surface); color: var(--text);
  transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease;
}
.tool-card:hover, .tool-card:focus-visible {
  border-color: var(--tool-accent); background: var(--surface-raised); text-decoration: none;
}
.tool-card__preview {
  min-width: 0; overflow: hidden;
  border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface-inset);
}
.tool-card__preview img { display: block; width: 100%; height: auto; }
.tool-card__copy { min-width: 0; }
.tool-card__copy h3 { margin: 0 0 8px; color: var(--text); font-size: 17px; font-weight: 650; overflow-wrap: anywhere; }
.tool-card__copy p { margin: 0; color: var(--text-2); font-size: 14px; line-height: 1.55; }
.tool-card__arrow { align-self: start; margin-top: 3px; color: var(--tool-accent); width: 16px; height: 16px; }
@media (max-width: 800px) {
  .tool-promotions__grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .tool-card { gap: 12px; padding: 12px; }
  .tool-card__copy h3 { font-size: 15px; margin-bottom: 6px; }
  .tool-card__copy p { font-size: 13px; }
}
</style>
