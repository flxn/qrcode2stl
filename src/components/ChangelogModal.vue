<template>
  <div :class="{'modal': true, 'is-active': true}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Changelog <span class="tag is-info">v{{version}}</span></p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <vue-markdown :source="changelog" class="content"></vue-markdown>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close">OK</button>
      </footer>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
// eslint-disable-next-line import/no-webpack-loader-syntax
import changelog from 'raw-loader!../../CHANGELOG.md';
import packageJson from '../../package.json';
import { bus } from '../main';

export default {
  name: 'ChangelogModal',
  components: {
    VueMarkdown,
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
