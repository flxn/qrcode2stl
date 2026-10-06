<script>
import icons from './icons';

export default {
  name: 'UiIcon',
  functional: true,
  props: {
    name: {
      type: String,
      required: true,
    },
    strokeWidth: {
      type: [Number, String],
      default: 2,
    },
  },
  render(h, { props, data }) {
    return h('svg', {
      ...data,
      staticClass: ['svg-icon', data.staticClass].filter(Boolean).join(' '),
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': props.strokeWidth,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
        focusable: 'false',
        ...data.attrs,
      },
      domProps: {
        innerHTML: icons[props.name] || '',
      },
    });
  },
};
</script>
