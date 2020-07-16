<template>
  <ul class="share-buttons">
    <li>
      <a
        :href="facebookLink"
        target="_blank"
        title="Share on Facebook"
      >
        <i class="fab fa-facebook-square fa-2x" aria-hidden="true"></i>
        <span class="sr-only">Share on Facebook</span>
      </a>
    </li>
    <li>
      <a
        :href="twitterLink"
        target="_blank"
        title="Tweet"
      >
        <i class="fab fa-twitter-square fa-2x" aria-hidden="true"></i>
        <span class="sr-only">Tweet</span>
      </a>
    </li>
    <li>
      <a
        :href="pinterestLink"
        target="_blank"
        title="Pin it">
          <i class="fab fa-pinterest-square fa-2x" aria-hidden="true"></i>
          <span class="sr-only">Pin it</span>
      </a>
    </li>
    <li>
      <a
        :href="redditLink"
        target="_blank"
        title="Submit to Reddit"
      >
        <i class="fab fa-reddit-square fa-2x" aria-hidden="true"></i>
        <span class="sr-only">Submit to Reddit</span>
      </a>
    </li>
    <li>
      <a
        :href="mailLink"
        target="_blank"
        title="Send email"
      >
        <i class="fas fa-envelope-square fa-2x" aria-hidden="true"></i>
        <span class="sr-only">Send email</span>
      </a>
    </li>
    <li>
      <a
        :href="pocketLink"
        target="_blank"
        title="Add to Pocket">
          <i class="fab fab fa-get-pocket fa-2x" aria-hidden="true"></i>
          <span class="sr-only">Add to Pocket</span>
      </a>
    </li>
  </ul>
</template>

<script>
const url = 'https://flxn.de/qrcode2stl/';
const title = 'Generate 3d printable QR codes';
const text = 'With this web app you can create QR codes and directly download them as a file for 3d printing';
const imageUrl = 'https://flxn.de/qrcode2stl/img/generate_code.9da711b0.gif';
const fullText = `${text}: ${url}`;
const twitterHandle = 'flxnde';

export default {
  name: 'Header',
  data() {
    return {
      mailLink: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullText)}`,
      facebookLink: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(fullText)}`,
      twitterLink: `https://twitter.com/intent/tweet?source=${encodeURIComponent(url)}&text=${encodeURIComponent(fullText)}&via=${twitterHandle}`,
      redditLink: `http://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      pinterestLink: `http://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(text)}`,
      pocketLink: `https://getpocket.com/save?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };
  },
};
</script>

<style scoped>
ul.share-buttons {
  list-style: none;
  padding: 0;
}

ul.share-buttons li {
  display: inline;
  margin: 0 5px;
}

ul.share-buttons .title {
  margin-bottom: 2px;
  margin-left: 5px;
}

ul.share-buttons li a {
  color: #363636;
}

ul.share-buttons li a:hover {
  color: #4a4a4a;
}

ul.share-buttons .sr-only {
  position: absolute;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
</style>
