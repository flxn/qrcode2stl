<template>
  <div ref="anchor" class="popover-anchor">
    <slot name="trigger" :open="open" :toggle="toggle" :close="close" />
    <transition name="popover">
      <div
        v-if="open"
        ref="panel"
        class="popover"
        :class="panelClass"
        :style="panelStyle"
        :role="role"
        @keydown="onKeydown"
        @click="onPanelClick"
      >
        <slot :close="close" />
      </div>
    </transition>
  </div>
</template>

<script>
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default {
  name: 'UiPopover',
  props: {
    placement: {
      type: String,
      default: 'bottom-start',
    },
    offset: {
      type: Number,
      default: 8,
    },
    width: {
      type: Number,
      default: null,
    },
    panelClass: {
      type: [String, Array, Object],
      default: '',
    },
    role: {
      type: String,
      default: 'menu',
    },
    closeOnItemClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      open: false,
      panelStyle: {},
    };
  },
  beforeDestroy() {
    this.unbind();
  },
  methods: {
    toggle(event) {
      if (this.open) {
        this.close();
      } else {
        this.show(event && event.detail === 0);
      }
    },
    show(focusFirst = false) {
      this.open = true;
      this.$emit('open');
      document.addEventListener('pointerdown', this.onOutside, true);
      document.addEventListener('keydown', this.onDocumentKeydown);
      window.addEventListener('resize', this.position);
      window.addEventListener('scroll', this.position, true);
      this.$nextTick(() => {
        this.position();
        if (focusFirst) {
          this.focusItem(0);
        }
      });
    },
    close(restoreFocus = false) {
      if (!this.open) {
        return;
      }
      this.open = false;
      this.$emit('close');
      this.unbind();
      if (restoreFocus) {
        const trigger = this.$refs.anchor && this.$refs.anchor.querySelector(FOCUSABLE);
        if (trigger) {
          trigger.focus();
        }
      }
    },
    unbind() {
      document.removeEventListener('pointerdown', this.onOutside, true);
      document.removeEventListener('keydown', this.onDocumentKeydown);
      window.removeEventListener('resize', this.position);
      window.removeEventListener('scroll', this.position, true);
    },
    onOutside(event) {
      const { anchor, panel } = this.$refs;
      if ((anchor && anchor.contains(event.target)) || (panel && panel.contains(event.target))) {
        return;
      }
      this.close();
    },
    onDocumentKeydown(event) {
      if (event.key === 'Escape') {
        this.close(true);
      }
    },
    onPanelClick(event) {
      if (this.closeOnItemClick && event.target.closest('.menu-item')) {
        this.close();
      }
    },
    items() {
      const panel = this.$refs.panel;
      return panel ? Array.from(panel.querySelectorAll('.menu-item, [data-popover-item]')) : [];
    },
    focusItem(index) {
      const items = this.items();
      if (!items.length) {
        const first = this.$refs.panel && this.$refs.panel.querySelector(FOCUSABLE);
        if (first) {
          first.focus();
        }
        return;
      }
      items[(index + items.length) % items.length].focus();
    },
    onKeydown(event) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return;
      }
      const items = this.items();
      if (!items.length) {
        return;
      }
      event.preventDefault();
      const current = items.indexOf(document.activeElement);
      this.focusItem(current + (event.key === 'ArrowDown' ? 1 : -1));
    },
    position() {
      const { anchor, panel } = this.$refs;
      if (!anchor || !panel) {
        return;
      }
      const rect = anchor.getBoundingClientRect();
      const panelWidth = this.width || panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      const [side, align] = this.placement.split('-');
      const margin = 8;

      let left = align === 'end' ? rect.right - panelWidth : rect.left;
      left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));

      let top = side === 'top' ? rect.top - panelHeight - this.offset : rect.bottom + this.offset;
      let originY = side === 'top' ? 'bottom' : 'top';
      if (side !== 'top' && top + panelHeight > window.innerHeight - margin && rect.top - panelHeight - this.offset > margin) {
        top = rect.top - panelHeight - this.offset;
        originY = 'bottom';
      } else if (side === 'top' && top < margin) {
        top = rect.bottom + this.offset;
        originY = 'top';
      }

      this.panelStyle = {
        top: `${Math.max(margin, top)}px`,
        left: `${left}px`,
        width: this.width ? `${this.width}px` : undefined,
        '--popover-origin': `${originY} ${align === 'end' ? 'right' : 'left'}`,
      };
    },
  },
};
</script>

<style>
.popover-anchor {
  position: relative;
  display: inline-flex;
}
</style>
