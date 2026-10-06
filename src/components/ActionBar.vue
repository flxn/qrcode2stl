<template>
  <div class="action-bar">
    <div class="action-bar__inner">
      <button
        ref="generate"
        type="button"
        class="btn btn--lg btn--accent-outline generate-button"
        :class="{ 'is-busy': isGenerating, 'is-stale': isStale && !isGenerating, 'is-nudged': nudged }"
        :data-tip="generateTip"
        :aria-busy="isGenerating ? 'true' : 'false'"
        @click="$emit('generate')"
        @animationend="nudged = false"
      >
        <span class="generate-button__icon">
          <transition name="icon-swap" mode="out-in">
            <UiIcon v-if="isGenerating" key="busy" name="loader" class="spin" />
            <UiIcon v-else-if="justFinished" key="done" name="check" class="generate-button__done" />
            <UiIcon v-else key="idle" name="play" />
          </transition>
        </span>
        <span class="generate-button__label">{{ $t('generateButton') }}</span>
        <span v-if="isStale && !isGenerating" class="dot-badge dot-badge--pulse" aria-hidden="true"></span>
      </button>

      <span class="action-divider" aria-hidden="true"></span>

      <div class="action-field">
        <label class="action-field__label" :for="formatId">{{ $t('stlFormat') }}</label>
        <div class="select action-select">
          <select :id="formatId" :value="stlType" @change="$emit('update:stlType', $event.target.value)">
            <option value="binary">{{ $t('stlBinary') }}</option>
            <option value="ASCII">{{ $t('stlAscii') }}</option>
          </select>
          <UiIcon name="chevron-down" class="select__chevron" />
        </div>
        <UiHelp class="action-field__help" :text="$t('exportTypeHelp')" />
      </div>

      <span class="action-divider" aria-hidden="true"></span>

      <div class="action-field">
        <UiToggle
          :value="multipleParts"
          :label="$t('separateParts')"
          class="action-toggle"
          @input="$emit('update:multipleParts', $event)"
        />
        <UiHelp :text="$t('exportSeparatePartsHelp')" />
      </div>

      <span class="action-spacer" aria-hidden="true"></span>

      <div class="action-bar__exports">
        <button
          type="button"
          class="btn btn--lg export-png"
          :class="{ 'is-disabled': !hasModel }"
          :aria-disabled="hasModel ? 'false' : 'true'"
          :data-tip="hasModel ? $t('renderPngTip') : $t('generateFirst')"
          @click="onExport('render-png')"
        >
          <UiIcon name="image" />
          <span class="export-png__label">{{ $t('saveAsImageButton') }}</span>
        </button>
        <button
          type="button"
          class="btn btn--lg btn--primary export-stl"
          :class="{ 'is-disabled': !hasModel }"
          :aria-disabled="hasModel ? 'false' : 'true'"
          :data-tip="hasModel ? exportTip : $t('generateFirst')"
          data-tip-align="end"
          @click="onExport('export-stl')"
        >
          <UiIcon name="download" />
          <span>{{ $t('saveAsButton') }}</span>
        </button>
      </div>

      <span class="action-break" aria-hidden="true"></span>
    </div>
  </div>
</template>

<script>
import UiIcon from './ui/UiIcon.vue';
import UiToggle from './ui/UiToggle.vue';
import UiHelp from './ui/UiHelp.vue';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export default {
  name: 'ActionBar',
  components: { UiIcon, UiToggle, UiHelp },
  props: {
    isGenerating: {
      type: Boolean,
      default: false,
    },
    isStale: {
      type: Boolean,
      default: false,
    },
    hasModel: {
      type: Boolean,
      default: false,
    },
    stlType: {
      type: String,
      default: 'binary',
    },
    multipleParts: {
      type: Boolean,
      default: false,
    },
    completedGenerations: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      nudged: false,
      justFinished: false,
    };
  },
  computed: {
    formatId() {
      return `stl-format-${this._uid}`;
    },
    modifier() {
      return isMac ? '⌘' : 'Ctrl';
    },
    generateTip() {
      if (this.isStale && !this.isGenerating) {
        return `${this.$t('settingsChanged')} · ${this.modifier} ↵`;
      }
      return `${this.$t('generateButton')} · ${this.modifier} ↵`;
    },
    exportTip() {
      return `${this.$t('saveAsButton')} · ${this.modifier} S`;
    },
  },
  watch: {
    // briefly confirm each successful generation with a check mark
    completedGenerations() {
      window.clearTimeout(this.finishedTimer);
      this.justFinished = true;
      this.finishedTimer = window.setTimeout(() => {
        this.justFinished = false;
      }, 1200);
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.finishedTimer);
  },
  methods: {
    onExport(event) {
      if (!this.hasModel) {
        this.nudge();
        this.$emit('need-model');
        return;
      }
      this.$emit(event);
    },
    /** Draws attention to the generate button (e.g. when exporting without a model). */
    nudge() {
      this.nudged = false;
      this.$nextTick(() => {
        this.nudged = true;
      });
    },
  },
};
</script>

<style>
.action-bar {
  container-type: inline-size;
  container-name: actionbar;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
}

.action-bar__inner {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 72px;
  padding: 11px 12px;
}

.action-divider {
  flex-shrink: 0;
  width: 1px;
  height: 32px;
  background: var(--divider);
}

.action-spacer {
  flex: 1 1 auto;
}

.action-break {
  display: none;
}

.action-field {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
}

.action-field__label {
  color: var(--text-2);
  font-size: 14px;
  white-space: nowrap;
}

.action-select select {
  width: 150px;
  height: 42px;
}

.action-toggle .switch__label {
  color: var(--text-2);
  white-space: nowrap;
}

.action-bar__exports {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
}

.action-bar .btn--lg {
  height: 50px;
}

.action-bar .btn.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.action-bar .btn.is-disabled:active {
  transform: none;
}

.export-stl {
  min-width: 190px;
}

.generate-button {
  flex-shrink: 0;
  min-width: 218px;
  border-width: 1.5px;
}

.generate-button__icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
}

.generate-button__done {
  color: var(--accent);
}

.generate-button.is-stale {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring);
}

.generate-button.is-nudged {
  animation: nudge 520ms var(--ease-out);
}

@keyframes nudge {
  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-5px);
  }

  40% {
    transform: translateX(5px);
  }

  60% {
    transform: translateX(-3px);
  }

  80% {
    transform: translateX(2px);
  }
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 120ms ease, transform 160ms var(--ease-out);
}

.icon-swap-enter,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-30deg);
}

@container actionbar (max-width: 1040px) {
  .action-field__label {
    display: none;
  }

  .action-select select {
    width: 136px;
  }
}

@container actionbar (max-width: 940px) {
  .export-png__label {
    display: none;
  }

  .export-png {
    width: 50px;
    padding: 0;
  }

  .generate-button {
    min-width: 0;
  }

  .action-field__help {
    display: none;
  }
}

@container actionbar (max-width: 820px) {
  .action-bar__inner {
    flex-wrap: wrap;
    row-gap: 10px;
  }

  .action-divider,
  .action-spacer {
    display: none;
  }

  /* row 1: generate + exports, row 2: export options */
  .generate-button {
    order: 1;
    flex: 1 1 auto;
  }

  .action-bar__exports {
    order: 2;
  }

  .action-break {
    display: block;
    order: 3;
    flex-basis: 100%;
    height: 0;
  }

  .action-field {
    order: 4;
  }

  .export-stl {
    min-width: 0;
  }
}

@container actionbar (max-width: 560px) {
  .action-bar__inner {
    gap: 10px;
    padding: 10px;
  }

  .action-bar__exports {
    display: contents;
  }

  .action-bar .btn--lg {
    gap: 6px;
    padding: 0 12px;
    font-size: 14px;
  }

  .generate-button,
  .export-stl {
    flex: 1 1 0;
    min-width: 0;
  }

  .generate-button {
    order: 1;
  }

  .export-stl {
    order: 2;
  }

  .export-png {
    order: 5;
    margin-left: auto;
  }

  .action-select select {
    width: 128px;
  }
}

@container actionbar (max-width: 420px) {
  .generate-button__icon,
  .export-stl .svg-icon,
  .action-field .help-tip {
    display: none;
  }

  .action-select select {
    width: 124px;
  }

  .action-bar .export-png {
    width: 44px;
  }
}
</style>
