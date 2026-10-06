import Vue from 'vue';

const STORAGE_KEY = 'theme';
const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const readStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch (e) {
    return null;
  }
};

const systemTheme = () => (media && media.matches ? 'dark' : 'light');

/**
 * Reactive theme state shared by the header toggle and the 3D preview.
 * The initial attribute is already set by the inline script in index.html to avoid a flash.
 */
export const themeState = Vue.observable({
  theme: document.documentElement.getAttribute('data-theme') || readStoredTheme() || systemTheme(),
  explicit: readStoredTheme() !== null,
});

const applyTheme = (theme, animate) => {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 320);
  }
  root.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#12181c' : '#ffffff');
  }
  themeState.theme = theme;
};

export const setTheme = (theme) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // storage might be unavailable (private mode); the theme still applies for this session
  }
  themeState.explicit = true;
  applyTheme(theme, true);
};

export const toggleTheme = () => setTheme(themeState.theme === 'dark' ? 'light' : 'dark');

if (media) {
  const onSystemChange = () => {
    if (!themeState.explicit) {
      applyTheme(systemTheme(), true);
    }
  };
  if (media.addEventListener) {
    media.addEventListener('change', onSystemChange);
  } else if (media.addListener) {
    media.addListener(onSystemChange);
  }
}

applyTheme(themeState.theme, false);
