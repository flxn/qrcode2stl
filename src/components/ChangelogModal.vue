<template>
  <div :class="{'modal': true, 'is-active': true}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Changelog <span class="tag is-info">v{{version}}</span></p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <p class="content">
          Regularly check back on this page, I have many more features planned for the future.
          Or <a href="https://twitter.com/flxnde" target="_blank" rel="noopener nofollow"><i class="fab fa-twitter"></i> follow me on Twitter</a> where I tweet about updates and new projects.
        </p>
        <hr>
        <MarkdownRenderer :source="changelog" class="content"></MarkdownRenderer>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close">OK</button>
      </footer>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-webpack-loader-syntax
import changelog from '../../CHANGELOG.md?raw';
import packageJson from '../../package.json';
import { bus } from '../main';
import MarkdownRenderer from './MarkdownRenderer.vue';

export default {
  name: 'ChangelogModal',
  components: {
    MarkdownRenderer,
  },
  data() {
    return {
      changelog: changelog.split('\n').slice(3).join('\n'),
      version: packageJson.version,
    };
  },
  methods: {
    close() {
      bus.$emit('closeChangelogModal');
    },
  },
};
</script>
