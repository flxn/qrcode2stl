<template>
  <ul class="share-buttons">
    <li v-for="link in links" :key="link.title">
      <a
        :href="link.href"
        target="_blank"
        rel="noopener"
        :title="link.title"
        :aria-label="link.title"
        class="share-buttons__link"
      >
        <i :class="link.icon" aria-hidden="true"></i>
      </a>
    </li>
  </ul>
</template>

<script>
const url = 'https://qrcode2stl.printer.tools/';
const title = 'Generate 3d printable QR codes';
const text = 'With this web app you can create QR codes and directly download them as a file for 3d printing';
const imageUrl = 'https://flxn.de/qrcode2stl/img/generate_code.9da711b0.gif';
const fullText = `${text}: ${url}`;
const twitterHandle = 'flxnde';

export default {
  name: 'ShareButtons',
  data() {
    return {
      links: [
        {
          title: 'Share on Facebook',
          icon: 'fab fa-facebook-f',
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(fullText)}`,
        },
        {
          title: 'Tweet',
          icon: 'fab fa-twitter',
          href: `https://twitter.com/intent/tweet?source=${encodeURIComponent(url)}&text=${encodeURIComponent(fullText)}&via=${twitterHandle}`,
        },
        {
          title: 'Pin it',
          icon: 'fab fa-pinterest-p',
          href: `http://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(text)}`,
        },
        {
          title: 'Submit to Reddit',
          icon: 'fab fa-reddit-alien',
          href: `http://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        },
        {
          title: 'Send email',
          icon: 'fas fa-envelope',
          href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullText)}`,
        },
        {
          title: 'Add to Pocket',
          icon: 'fab fa-get-pocket',
          href: `https://getpocket.com/save?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        },
      ],
    };
  },
};
</script>

<style>
.share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.share-buttons__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-2);
  font-size: 15px;
  transition: color var(--duration) ease, border-color var(--duration) ease, background-color var(--duration) ease, transform var(--duration-fast) ease;
}

.share-buttons__link:hover {
  border-color: var(--accent-soft-border);
  background: var(--accent-soft);
  color: var(--accent-text);
  text-decoration: none;
  transform: translateY(-1px);
}
</style>
