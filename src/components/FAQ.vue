<template>
  <section class="container" id="faq">
    <h2 class="title">{{ $t('faqTitle') }}</h2>
    <hr>

    <div class="faq-container">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item"
      >
        <div
          class="faq-question"
          @click="toggleFaq(index)"
          :aria-expanded="faq.isOpen"
          :aria-controls="`faq-answer-${index}`"
          role="button"
          tabindex="0"
          @keydown.enter="toggleFaq(index)"
          @keydown.space.prevent="toggleFaq(index)"
        >
          <h3 class="subtitle is-5">
            <span class="icon faq-icon" :class="{ 'is-rotated': faq.isOpen }">
              <i class="fas fa-chevron-right"></i>
            </span>
            {{ $t(faq.questionKey) }}
          </h3>
        </div>

        <div
          :id="`faq-answer-${index}`"
          class="faq-answer"
          :class="{ 'is-open': faq.isOpen }"
          role="region"
          :aria-labelledby="`faq-question-${index}`"
        >
          <div class="faq-answer-content">
            <p v-html="$t(faq.answerKey)"></p>
          </div>
        </div>
      </div>
    </div>

    <p class="has-text-centered mt-5">
      {{ $t('faqFooter') }}
      <a href="mailto:qrcode2stl@flxn.de" class="has-text-link">
        {{ $t('faqContact') }}
      </a>
    </p>
  </section>
</template>

<script>
export default {
  name: 'FAQ',
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

<style scoped>
.faq-container {
  margin: 0 auto;
}

.faq-item {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.faq-question {
  background-color: #f8f8f8;
  padding: 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid #e1e1e1;
  user-select: none;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: #f0f0f0;
}

.faq-question:focus {
  outline: 2px solid #3273dc;
  outline-offset: -2px;
}

.faq-question .subtitle {
  margin: 0;
  display: flex;
  align-items: center;
}

.faq-icon {
  margin-right: 0.75rem;
  transition: transform 0.3s ease;
}

.faq-icon.is-rotated {
  transform: rotate(90deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: white;
}

.faq-answer.is-open {
  max-height: 500px;
}

.faq-answer-content {
  padding: 1.25rem;
  border-top: none;
}

.faq-answer-content p {
  margin: 0;
  line-height: 1.6;
}

.faq-answer-content a {
  color: #3273dc;
  text-decoration: underline;
}

.faq-answer-content a:hover {
  color: #2366d1;
}

@media (max-width: 768px) {
  .faq-question {
    padding: 1rem;
  }

  .faq-answer-content {
    padding: 1rem;
  }

  .faq-question .subtitle {
    font-size: 1.1rem;
  }
}
</style>
