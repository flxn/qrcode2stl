/**
 * v-autosize: grows a textarea with its content (up to its CSS max-height).
 */
const resize = (el) => {
  if (!el.isConnected) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  el.style.height = 'auto';
  const borders = el.offsetHeight - el.clientHeight;
  const maxHeight = parseFloat(window.getComputedStyle(el).maxHeight) || Infinity;
  let height = el.scrollHeight + borders;
  // Remember the height needed by the (possibly wrapping) placeholder, so the field
  // does not shrink and shift the layout as soon as the user starts typing.
  if (!el.value) {
    // eslint-disable-next-line no-param-reassign
    el.autosizeEmptyHeight = height;
  } else if (el.autosizeEmptyHeight) {
    height = Math.max(height, el.autosizeEmptyHeight);
  }
  // eslint-disable-next-line no-param-reassign
  el.style.height = `${Math.min(height, maxHeight)}px`;
};

export default {
  inserted(el) {
    // eslint-disable-next-line no-param-reassign
    el.autosizeHandler = () => resize(el);
    el.addEventListener('input', el.autosizeHandler);
    window.requestAnimationFrame(() => resize(el));
  },
  componentUpdated(el) {
    resize(el);
  },
  unbind(el) {
    el.removeEventListener('input', el.autosizeHandler);
  },
};
