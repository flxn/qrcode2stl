/**
 * Google AdSense helpers.
 *
 * adsbygoogle.js is loaded once in index.html; its onload / onerror handlers set
 * window.__adsLoaded / window.__adsBlocked so we can tell whether ads can be shown at all.
 */

export const AD_CLIENT = 'ca-pub-1287245576045785';

// fixed AdSense ad units (slot ids from the AdSense dashboard)
export const AD_UNITS = {
  header: { slot: '4448940344', width: 468, height: 60 },
  model: { slot: '6004011232', width: 728, height: 90 },
  export: { slot: '9808244086', width: 300, height: 250 },
};

// how long we wait for adsbygoogle.js before treating it as blocked
const LOAD_TIMEOUT = 10000;

/**
 * Test ads (not billed or counted) on localhost and with ?adtest in the URL,
 * so layouts can be checked without generating real impressions.
 */
export const isAdTestMode = () => {
  if (typeof window === 'undefined') return false;
  const { hostname, search } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1' || new URLSearchParams(search).has('adtest');
};

let readyPromise = null;

/** Resolves with 'loaded' once adsbygoogle.js is available, or 'blocked' if it failed to load. */
export const whenAdsReady = () => {
  if (!readyPromise) {
    readyPromise = new Promise((resolve) => {
      const started = Date.now();
      const check = () => {
        if (window.__adsLoaded || (window.adsbygoogle && window.adsbygoogle.loaded)) {
          resolve('loaded');
        } else if (window.__adsBlocked || Date.now() - started > LOAD_TIMEOUT) {
          resolve('blocked');
        } else {
          window.setTimeout(check, 200);
        }
      };
      check();
    });
  }
  return readyPromise;
};

/** Asks AdSense to fill the next unfilled ad unit on the page. */
export const requestAd = () => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    return true;
  } catch (error) {
    console.warn('AdSense request failed:', error);
    return false;
  }
};
