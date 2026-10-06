<template>
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <transition-group name="toast" tag="div" class="toast-host__stack">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        role="status"
        @mouseenter="pause(toast)"
        @mouseleave="resume(toast)"
      >
        <UiIcon :name="toast.icon || icons[toast.type]" class="toast__icon" />
        <span class="toast__message">{{ toast.message }}</span>
        <button type="button" class="toast__close" :aria-label="$t('close')" @click="dismiss(toast.id)">
          <UiIcon name="x" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { bus } from '../main';
import UiIcon from './ui/UiIcon.vue';

let nextId = 1;

export default {
  name: 'ToastHost',
  components: { UiIcon },
  data() {
    return {
      toasts: [],
      icons: {
        success: 'circle-check',
        error: 'circle-x',
        warning: 'alert',
        info: 'info',
      },
    };
  },
  created() {
    bus.$on('toast', this.push);
  },
  beforeDestroy() {
    bus.$off('toast', this.push);
    this.toasts.forEach((toast) => window.clearTimeout(toast.timer));
  },
  methods: {
    push(payload) {
      const options = typeof payload === 'string' ? { message: payload } : payload;
      const toast = {
        id: nextId,
        type: options.type || 'info',
        icon: options.icon,
        message: options.message,
        timeout: options.timeout || (options.type === 'error' ? 6000 : 3200),
        timer: null,
      };
      nextId += 1;
      // collapse identical messages instead of stacking duplicates
      const duplicate = this.toasts.find((existing) => existing.message === toast.message);
      if (duplicate) {
        this.dismiss(duplicate.id);
      }
      this.toasts.push(toast);
      if (this.toasts.length > 4) {
        this.dismiss(this.toasts[0].id);
      }
      this.resume(toast);
    },
    dismiss(id) {
      const index = this.toasts.findIndex((toast) => toast.id === id);
      if (index !== -1) {
        window.clearTimeout(this.toasts[index].timer);
        this.toasts.splice(index, 1);
      }
    },
    pause(toast) {
      window.clearTimeout(toast.timer);
    },
    resume(toast) {
      window.clearTimeout(toast.timer);
      // eslint-disable-next-line no-param-reassign
      toast.timer = window.setTimeout(() => this.dismiss(toast.id), toast.timeout);
    },
  },
};
</script>

<style>
.toast-host {
  position: fixed;
  z-index: 120;
  bottom: 160px;
  /* centered over the preview area, right of the settings sidebar */
  left: calc(50% + var(--sidebar-width) / 2);
  width: min(440px, calc(100vw - 24px));
  transform: translateX(-50%);
  pointer-events: none;
}

.toast-host__stack {
  display: grid;
  gap: 8px;
}

@media (max-width: 900px) {
  .toast-host {
    bottom: 132px;
    left: 50%;
  }
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 10px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  color: var(--text);
  font-size: 14px;
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
}

.toast__icon {
  width: 19px;
  height: 19px;
}

.toast--success .toast__icon {
  color: var(--accent);
}

.toast--error .toast__icon {
  color: var(--danger);
}

.toast--warning .toast__icon {
  color: var(--warning);
}

.toast--info .toast__icon {
  color: var(--info-text);
}

.toast__message {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.4;
}

.toast__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--text-3);
}

.toast__close:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.toast__close .svg-icon {
  width: 16px;
  height: 16px;
}

.toast-enter-active {
  transition: opacity 200ms ease, transform 320ms var(--ease-spring);
}

.toast-leave-active {
  position: absolute;
  width: 100%;
  transition: opacity 160ms ease, transform 160ms ease;
}

.toast-move {
  transition: transform 240ms var(--ease-out);
}

.toast-enter {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
