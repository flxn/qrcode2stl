<template>
  <div v-html="renderedMarkdown" class="markdown-content"></div>
</template>

<script>
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default {
  name: 'MarkdownRenderer',
  props: {
    source: {
      type: String,
      default: '',
    },
  },
  computed: {
    renderedMarkdown() {
      return md.render(this.source);
    },
  },
};
</script>
