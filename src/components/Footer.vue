<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>qrcode2stl</strong> by <a href="https://flxn.de" rel="noopener nofollow" target="_blank">Felix Stein</a>. The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php" rel="noopener nofollow" target="_blank">MIT</a>. The website content
        is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/" rel="noopener nofollow" target="_blank">CC BY NC SA 4.0</a>.
      </p>
      <p>
        If you like my stuff you can follow me on
        <a href="https://twitter.com/flxnde" target="_blank" rel="noopener nofollow"><i class="fab fa-twitter"></i> Twitter</a>
        or on
        <a href="https://github.com/flxn" target="_blank" rel="noopener nofollow"><i class="fab fa-github"></i> Github</a>
        or if you really like it you can even
        <a href="https://paypal.me/fstein42" target="_blank" rel="noopener nofollow">
          💵☕️ buy me a coffee
        </a>
      </p>
      <p>
        If you need help or have some great idea, you can write me a mail:
        <a href="mailto:mail@flxn.de"><i class="fa fa-envelope"></i> mail@flxn.de</a>
      </p>
      <p>
        📢 Check out my latest project "foldericon.app" where you can
          <a href="https://foldericon.app"><i class="fa fa-folder"></i> create customized macOS and Windows folder icons</a>
      </p>
      <ShareButtons/>
    </div>
  </footer>
</template>

<script>
import ShareButtons from './ShareButtons.vue';

export default {
  name: 'Footer',
  components: {
    ShareButtons,
  },
};
</script>

<style>

</style>
