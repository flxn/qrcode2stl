<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <img src="../assets/logo.png" alt="QR2STL" class="site-footer__logo" width="110" height="22" />
      <p>
        <strong>qrcode2stl</strong> by <a href="https://flxn.de" rel="noopener nofollow" target="_blank">Felix Stein</a>. The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php" rel="noopener nofollow" target="_blank">MIT</a>. The website content
        is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/" rel="noopener nofollow" target="_blank">CC BY NC SA 4.0</a>.
      </p>
      <p>
        If you like my stuff you can follow me on
        <a href="https://twitter.com/flxnde" target="_blank" rel="noopener nofollow"><i class="fab fa-twitter" aria-hidden="true"></i> Twitter</a>
        or on
        <a href="https://github.com/flxn" target="_blank" rel="noopener nofollow"><i class="fab fa-github" aria-hidden="true"></i> Github</a>
        or if you really like it you can even
        <a href="https://paypal.me/fstein42" target="_blank" rel="noopener nofollow">
          💵☕️ buy me a coffee
        </a>
      </p>
      <p>
        If you need help or have some great idea, you can write me a mail:
        <a href="mailto:mail@flxn.de"><i class="fa fa-envelope" aria-hidden="true"></i> mail@flxn.de</a>
      </p>
      <p>
        📢 Check out my latest project "foldericon.app" where you can
        <a href="https://foldericon.app"><i class="fa fa-folder" aria-hidden="true"></i> create customized macOS and Windows folder icons</a>
      </p>
      <ShareButtons class="site-footer__share" />
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
.site-footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.site-footer__inner {
  display: grid;
  justify-items: center;
  gap: 10px;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  color: var(--text-3);
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
}

.site-footer__inner p {
  margin: 0;
}

.site-footer__inner strong {
  color: var(--text-2);
}

.site-footer__logo {
  width: auto;
  height: 22px;
  margin-bottom: 8px;
  opacity: 0.85;
  filter: var(--logo-filter);
}

.site-footer__share {
  justify-content: center;
  margin-top: 10px;
}
</style>
