<template>
  <section id="faq" class="info-section">
    <header class="info-section__header">
      <span class="info-section__icon"><UiIcon name="help" /></span>
      <div>
        <h2 class="info-section__title">{{ $t('faqTitle') }}</h2>
      </div>
    </header>

    <div class="faq-list">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item"
        :class="{ 'is-open': faq.isOpen }"
      >
        <h3 class="faq-item__heading">
          <button
            :id="`faq-question-${index}`"
            type="button"
            class="faq-item__question"
            :aria-expanded="faq.isOpen ? 'true' : 'false'"
            :aria-controls="`faq-answer-${index}`"
            @click="toggleFaq(index)"
          >
            <span>{{ $t(faq.questionKey) }}</span>
            <span class="faq-item__icon" aria-hidden="true"><UiIcon name="plus" /></span>
          </button>
        </h3>
        <div
          :id="`faq-answer-${index}`"
          class="faq-item__answer"
          role="region"
          :aria-labelledby="`faq-question-${index}`"
        >
          <div class="faq-item__answer-inner">
            <p class="prose" v-html="$t(faq.answerKey)"></p>
          </div>
        </div>
      </div>
    </div>

    <p class="faq-footer">
      {{ $t('faqFooter') }}
      <a href="mailto:qrcode2stl@flxn.de">{{ $t('faqContact') }}</a>
    </p>
  </section>
</template>

<script>
import UiIcon from './ui/UiIcon.vue';

export default {
  name: 'FAQ',
  components: { UiIcon },
  data() {
    return {
      faqs: [
        {
          questionKey: 'faqQuestion1',
          answerKey: 'faqAnswer1',
          isOpen: false,
        },
        {
          questionKey: 'faqQuestion2',
          answerKey: 'faqAnswer2',
          isOpen: false,
        },
        {
          questionKey: 'faqQuestion3',
          answerKey: 'faqAnswer3',
          isOpen: false,
        },
        {
          questionKey: 'faqQuestion4',
          answerKey: 'faqAnswer4',
          isOpen: false,
        },
        {
          questionKey: 'faqQuestion5',
          answerKey: 'faqAnswer5',
          isOpen: false,
        },
        {
          questionKey: 'faqQuestion6',
          answerKey: 'faqAnswer6',
          isOpen: false,
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      this.faqs[index].isOpen = !this.faqs[index].isOpen;
    },
  },
};
</script>

<style>
.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  transition: border-color var(--duration) ease, box-shadow var(--duration) ease;
}

.faq-item:hover {
  border-color: var(--border-strong);
}

.faq-item.is-open {
  border-color: var(--accent-soft-border);
  box-shadow: var(--shadow-sm);
}

.faq-item__heading {
  margin: 0;
}

.faq-item__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 16px 18px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text);
  font-size: 15.5px;
  font-weight: 600;
  text-align: left;
}

.faq-item__question:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.faq-item__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-inset);
  color: var(--text-2);
  transition: transform 300ms var(--ease-out), background-color var(--duration) ease, color var(--duration) ease;
}

.faq-item__icon .svg-icon {
  width: 16px;
  height: 16px;
}

.faq-item.is-open .faq-item__icon {
  background: var(--accent-soft);
  color: var(--accent-text);
  transform: rotate(45deg);
}

.faq-item__answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 320ms var(--ease-out);
}

.faq-item.is-open .faq-item__answer {
  grid-template-rows: 1fr;
}

.faq-item__answer-inner {
  min-height: 0;
  overflow: hidden;
}

.faq-item__answer-inner .prose {
  margin: 0;
  padding: 0 18px 18px;
}

.faq-footer {
  margin: 20px 0 0;
  color: var(--text-3);
  font-size: 14px;
  text-align: center;
}
</style>
