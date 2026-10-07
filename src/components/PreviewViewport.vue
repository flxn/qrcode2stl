<template>
  <div class="viewport" :class="{ 'has-model': hasModel, 'is-generating': isGenerating }">
    <div ref="canvasHost" class="viewport__canvas" role="img" :aria-label="$t('preview')"></div>

    <!-- dimension rulers (width and height), positioned every frame from the 3D bounds -->
    <svg class="viewport__ruler" aria-hidden="true">
      <g v-for="axis in rulerAxes" :key="axis" ref="rulerGroups" style="display: none">
        <line class="ruler-ext" />
        <line class="ruler-ext" />
        <line class="ruler-line" />
        <polygon class="ruler-arrow" />
        <polygon class="ruler-arrow" />
      </g>
    </svg>
    <div v-for="axis in rulerAxes" :key="'label-' + axis" ref="rulerLabels" class="ruler-label" style="display: none"></div>

    <!-- toolbar -->
    <div class="viewport__toolbar" role="toolbar" :aria-label="$t('viewControls')">
      <UiSegmented
        :value="viewMode"
        variant="accent"
        :options="viewModeOptions"
        :aria-label="$t('viewMode')"
        tip-pos="bottom"
        @input="setViewMode"
      />
      <span class="toolbar-divider toolbar-divider--tools" aria-hidden="true"></span>
      <button
        v-for="tool in tools"
        :key="tool.id"
        type="button"
        class="tool-button tool-button--pointer"
        :class="{ 'is-active': effectivePointerMode === tool.id }"
        :disabled="tool.id === 'rotate' && viewMode === '2d'"
        :aria-pressed="effectivePointerMode === tool.id ? 'true' : 'false'"
        :data-tip="tool.tip"
        data-tip-pos="bottom"
        @click="setPointerMode(tool.id)"
      >
        <UiIcon :name="tool.icon" />
        <span class="tool-button__label">{{ tool.label }}</span>
      </button>
      <span class="toolbar-divider" aria-hidden="true"></span>
      <button type="button" class="tool-button" :data-tip="$t('resetViewTip')" data-tip-pos="bottom" @click="resetView">
        <UiIcon name="rotate-ccw" />
        <span class="tool-button__label">{{ $t('resetView') }}</span>
      </button>
      <span class="toolbar-divider" aria-hidden="true"></span>
      <button
        type="button"
        class="tool-button tool-button--live"
        :class="{ 'is-on': liveUpdate }"
        :aria-pressed="liveUpdate ? 'true' : 'false'"
        :data-tip="$t('liveUpdateTip')"
        data-tip-pos="bottom"
        @click="$emit('update:liveUpdate', !liveUpdate)"
      >
        <UiIcon name="zap" />
        <span class="tool-button__label">{{ $t('liveUpdate') }}</span>
      </button>
    </div>

    <!-- orientation cube -->
    <div class="view-cube" :title="$t('viewCubeTip')">
      <div ref="cube" class="view-cube__cube">
        <button
          v-for="face in cubeFaces"
          :key="face.id"
          type="button"
          class="view-cube__face"
          :class="`view-cube__face--${face.css}`"
          :aria-label="face.label"
          :title="face.label"
          @click="viewFrom(face.id)"
        >{{ face.text }}</button>
      </div>
    </div>

    <!-- status -->
    <transition name="rise">
      <div v-if="isGenerating && hasModel" key="generating" class="viewport__status">
        <span class="chip chip--accent">
          <UiIcon name="loader" class="spin" />
          {{ $t('updatingModel') }}
        </span>
      </div>
      <div v-else-if="isStale && !liveUpdate" key="stale" class="viewport__status">
        <button type="button" class="chip chip--accent chip--action" @click="$emit('generate')">
          <span class="stale-dot" aria-hidden="true"></span>
          {{ $t('settingsChanged') }}
          <strong>{{ $t('updateModel') }}</strong>
          <span class="kbd">{{ shortcutLabel }}</span>
        </button>
      </div>
    </transition>

    <!-- empty / first generation state -->
    <transition name="empty">
      <div v-if="!hasModel" class="viewport__empty">
        <div class="empty-state" :class="{ 'is-busy': isGenerating }">
          <div class="empty-state__icon">
            <UiIcon v-if="isGenerating" name="loader" class="spin" />
            <UiIcon v-else name="box" />
          </div>
          <p class="empty-state__title">{{ isGenerating ? $t('isGenerating') : $t('emptyTitle') }}</p>
          <p v-if="!isGenerating" class="empty-state__hint">
            {{ emptyHint }}
            <span class="empty-state__keys"><span class="kbd">{{ modifierKey }}</span><span class="kbd">↵</span></span>
          </p>
        </div>
      </div>
    </transition>

    <!-- bottom left: plain 2D QR code -->
    <transition name="pop">
      <button
        v-if="qrImage && hasModel"
        type="button"
        class="qr-thumb"
        :class="{ 'is-expanded': qrExpanded }"
        title="A QR Code in 2D? How lame ;)"
        :aria-label="$t('qrThumbLabel')"
        :aria-expanded="qrExpanded ? 'true' : 'false'"
        @click="qrExpanded = !qrExpanded"
      >
        <img id="qr-image" :src="qrImage" alt="" />
        <span class="qr-thumb__caption">
          <UiIcon :name="qrExpanded ? 'x' : 'scan-qr'" />
          {{ qrExpanded ? $t('qrThumbHint') : '2D' }}
        </span>
      </button>
    </transition>

    <slot name="overlay" />

    <!-- bottom right: dimensions and warnings -->
    <div class="viewport__meta">
      <transition-group name="rise" tag="div" class="viewport__warnings">
        <span
          v-for="warning in describedWarnings"
          :key="warning.code"
          class="chip chip--warning"
          :title="warning.help"
          role="status"
        >
          <UiIcon name="alert" />
          {{ warning.label }}
        </span>
      </transition-group>
      <transition name="rise">
        <span v-if="printabilityWarning && hasModel" class="chip chip--warning" :title="printabilityWarning">
          <UiIcon name="alert" />
          {{ $t('printabilityShort') }}
        </span>
      </transition>
      <transition name="rise">
        <span v-if="dimensionsLabel && hasModel" class="chip" :title="$t('modelDimensions')">
          <UiIcon name="ruler" />
          {{ dimensionsLabel }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import PreviewStage from '../preview/PreviewStage';
import UiIcon from './ui/UiIcon.vue';
import UiSegmented from './ui/UiSegmented.vue';
import { describeWarning } from './sections/modelWarnings';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const formatMillimeters = (value) => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

export default {
  name: 'PreviewViewport',
  components: { UiIcon, UiSegmented },
  props: {
    theme: {
      type: String,
      default: 'light',
    },
    hasModel: {
      type: Boolean,
      default: false,
    },
    isGenerating: {
      type: Boolean,
      default: false,
    },
    isStale: {
      type: Boolean,
      default: false,
    },
    liveUpdate: {
      type: Boolean,
      default: true,
    },
    qrImage: {
      type: String,
      default: '',
    },
    printabilityWarning: {
      type: String,
      default: '',
    },
    // adjustments the generator made to the model ({ code, params })
    modelWarnings: {
      type: Array,
      default: () => [],
    },
    emptyHint: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      viewMode: '3d',
      pointerMode: 'rotate',
      // world axes that get a dimension ruler: x = width, y = height
      rulerAxes: ['x', 'y'],
      dimensions: null,
      qrExpanded: false,
    };
  },
  computed: {
    describedWarnings() {
      if (!this.hasModel) {
        return [];
      }
      return this.modelWarnings.map((warning) => describeWarning(this, warning)).filter(Boolean);
    },
    modifierKey() {
      return isMac ? '⌘' : 'Ctrl';
    },
    shortcutLabel() {
      return `${this.modifierKey} ↵`;
    },
    effectivePointerMode() {
      return this.viewMode === '2d' && this.pointerMode === 'rotate' ? 'pan' : this.pointerMode;
    },
    viewModeOptions() {
      return [
        { value: '3d', label: '3D', tip: this.$t('view3dTip') },
        { value: '2d', label: '2D', tip: this.$t('view2dTip') },
      ];
    },
    tools() {
      return [
        { id: 'rotate', icon: 'move', label: this.$t('toolRotate'), tip: this.$t('toolRotateTip') },
        { id: 'pan', icon: 'hand', label: this.$t('toolPan'), tip: this.$t('toolPanTip') },
        { id: 'zoom', icon: 'zoom-in', label: this.$t('toolZoom'), tip: this.$t('toolZoomTip') },
      ];
    },
    cubeFaces() {
      return [
        { id: '+z', css: 'pz', text: 'Z', label: this.$t('viewTop') },
        { id: '-z', css: 'nz', text: 'Z', label: this.$t('viewBottom') },
        { id: '+x', css: 'px', text: 'X', label: this.$t('viewRight') },
        { id: '-x', css: 'nx', text: 'X', label: this.$t('viewLeft') },
        { id: '+y', css: 'py', text: 'Y', label: this.$t('viewBack') },
        { id: '-y', css: 'ny', text: 'Y', label: this.$t('viewFront') },
      ];
    },
    dimensionsLabel() {
      if (!this.dimensions) {
        return '';
      }
      const { x, y, z } = this.dimensions;
      return `${formatMillimeters(x)} × ${formatMillimeters(y)} × ${formatMillimeters(z)} mm`;
    },
  },
  watch: {
    theme(theme) {
      if (this.stage) {
        this.stage.setTheme(theme);
      }
    },
    hasModel(hasModel) {
      if (!hasModel) {
        this.qrExpanded = false;
      }
    },
  },
  mounted() {
    this.stage = new PreviewStage(this.$refs.canvasHost, {
      theme: this.theme,
      onFrame: this.onFrame,
      onViewModeChange: (mode) => {
        this.viewMode = mode;
      },
    });
    if (import.meta.env.DEV) {
      // handy for debugging the preview from the browser console
      window.qr2stlStage = this.stage;
    }
    this.$emit('ready', this.stage);
  },
  beforeDestroy() {
    if (this.stage) {
      this.stage.dispose();
      this.stage = null;
    }
  },
  methods: {
    /** Called by the parent after meshes were added to the stage. */
    modelUpdated({ fit = false, animate = false } = {}) {
      this.stage.updateModel({ fit, animate });
      const size = this.stage.getModelSize();
      this.dimensions = size ? { x: size.x, y: size.y, z: size.z } : null;
    },
    clearModel() {
      this.stage.clearModel();
      this.dimensions = null;
    },
    setViewMode(mode) {
      this.viewMode = mode;
      this.stage.setViewMode(mode);
    },
    setPointerMode(mode) {
      this.pointerMode = mode;
      this.stage.setPointerMode(mode);
    },
    resetView() {
      this.stage.resetView();
    },
    viewFrom(face) {
      this.stage.viewFrom(face);
    },
    onFrame({ cube, rulers }) {
      if (this.$refs.cube) {
        this.$refs.cube.style.transform = cube;
      }
      const groups = this.$refs.rulerGroups || [];
      const labels = this.$refs.rulerLabels || [];
      this.rulerAxes.forEach((axis, index) => {
        const ruler = (rulers || []).find((item) => item.axis === axis);
        this.updateRuler(groups[index], labels[index], ruler);
      });
    },
    updateRuler(group, label, ruler) {
      if (!group || !label) {
        return;
      }
      if (!ruler) {
        group.style.display = 'none';
        label.style.display = 'none';
        return;
      }
      group.style.display = '';
      label.style.display = '';
      const [extA, extB, dimLine] = group.querySelectorAll('line');
      const [arrowA, arrowB] = group.querySelectorAll('polygon');
      const setLine = (el, a, b) => {
        el.setAttribute('x1', a.x);
        el.setAttribute('y1', a.y);
        el.setAttribute('x2', b.x);
        el.setAttribute('y2', b.y);
      };
      setLine(extA, ruler.extA0, ruler.extA1);
      setLine(extB, ruler.extB0, ruler.extB1);
      setLine(dimLine, ruler.start, ruler.end);

      // arrow heads pointing outwards at both ends
      const dx = ruler.end.x - ruler.start.x;
      const dy = ruler.end.y - ruler.start.y;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length;
      const uy = dy / length;
      const arrow = (tip, direction) => {
        const size = 9;
        const spread = 4;
        const bx = tip.x - ux * size * direction;
        const by = tip.y - uy * size * direction;
        return `${tip.x},${tip.y} ${bx - uy * spread},${by + ux * spread} ${bx + uy * spread},${by - ux * spread}`;
      };
      arrowA.setAttribute('points', arrow(ruler.start, -1));
      arrowB.setAttribute('points', arrow(ruler.end, 1));

      const text = `${formatMillimeters(ruler.value)} mm`;
      if (label.textContent !== text) {
        label.textContent = text;
      }
      label.style.transform = `translate(${ruler.label.x}px, ${ruler.label.y}px) translate(-50%, -50%) rotate(${ruler.angle}deg)`;
    },
    renderPNG() {
      return this.stage.renderPNG();
    },
  },
};
</script>

<style>
.viewport {
  position: relative;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--viewport-border);
  border-radius: var(--radius-lg);
  background: var(--viewport-bg);
  overflow: hidden;
  isolation: isolate;
}

.viewport__canvas {
  position: absolute;
  inset: 0;
}

.preview-canvas {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  touch-action: none;
}

.viewport__canvas[data-pointer-mode="rotate"] .preview-canvas {
  cursor: grab;
}

.viewport__canvas[data-pointer-mode="pan"] .preview-canvas {
  cursor: move;
}

.viewport__canvas[data-pointer-mode="zoom"] .preview-canvas {
  cursor: ns-resize;
}

.viewport__canvas.is-dragging[data-pointer-mode="rotate"] .preview-canvas {
  cursor: grabbing;
}

/* ---------- toolbar ---------- */
.viewport__toolbar {
  position: absolute;
  z-index: 3;
  top: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 2px;
  max-width: calc(100% - 130px);
  padding: 5px;
  border: 1px solid var(--viewport-chrome-border);
  border-radius: var(--radius-md);
  background: var(--viewport-chrome);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.viewport__toolbar .segmented {
  padding: 2px;
  border: 0;
  background: transparent;
}

.viewport__toolbar .segmented__item {
  min-width: 44px;
  height: 32px;
  font-size: 13.5px;
  font-weight: 600;
}

.toolbar-divider {
  flex-shrink: 0;
  width: 1px;
  height: 22px;
  margin: 0 6px;
  background: var(--border-strong);
}

.tool-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-2);
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color var(--duration) ease, color var(--duration) ease, transform var(--duration-fast) ease;
}

.tool-button:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text);
}

.tool-button:active:not(:disabled) {
  transform: scale(0.96);
}

.tool-button.is-active {
  background: var(--surface-active);
  color: var(--text);
}

.tool-button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.tool-button .svg-icon {
  width: 18px;
  height: 18px;
}

.tool-button--live.is-on {
  color: var(--accent-text);
}

.tool-button--live.is-on .svg-icon {
  fill: currentColor;
  fill-opacity: 0.25;
}

@container stage (max-width: 860px) {
  .tool-button__label {
    display: none;
  }

  .tool-button {
    padding: 0 9px;
  }
}

/* touch screens use gestures (one finger rotates, two fingers pan and zoom) */
@media (max-width: 600px) {
  .tool-button--pointer,
  .toolbar-divider--tools {
    display: none;
  }

  .view-cube {
    top: 12px;
    right: 10px;
    transform: scale(0.85);
  }
}

/* ---------- view cube ---------- */
.view-cube {
  position: absolute;
  z-index: 3;
  top: 18px;
  right: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  perspective: 320px;
}

.view-cube__cube {
  position: relative;
  width: 50px;
  height: 50px;
  transform-style: preserve-3d;
}

.view-cube__face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--cube-edge);
  border-radius: 3px;
  background: var(--cube-face);
  color: var(--cube-text);
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: background-color var(--duration) ease, color var(--duration) ease;
}

.view-cube__face:hover,
.view-cube__face:focus-visible {
  outline: none;
  background: var(--accent);
  color: #fff;
}

.view-cube__face--pz {
  background: var(--cube-face-top);
  transform: translateZ(25px);
}

.view-cube__face--nz {
  background: var(--cube-face-shade);
  transform: rotateY(180deg) translateZ(25px);
}

.view-cube__face--px {
  background: var(--cube-face-side);
  transform: rotateY(90deg) translateZ(25px) rotateZ(-90deg);
}

.view-cube__face--nx {
  background: var(--cube-face-side);
  transform: rotateY(-90deg) translateZ(25px) rotateZ(90deg);
}

.view-cube__face--py {
  transform: rotateX(90deg) translateZ(25px) rotateZ(180deg);
}

.view-cube__face--ny {
  transform: rotateX(-90deg) translateZ(25px);
}

/* ---------- ruler ---------- */
.viewport__ruler {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.ruler-line,
.ruler-ext {
  stroke: var(--ruler);
  stroke-linecap: round;
}

.ruler-line {
  stroke-width: 2;
}

.ruler-ext {
  stroke-width: 1.25;
  opacity: 0.75;
}

.ruler-arrow {
  fill: var(--ruler);
}

.ruler-label {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--ruler-label-bg);
  color: var(--ruler);
  font-size: 15px;
  font-weight: 650;
  letter-spacing: 0.01em;
  white-space: nowrap;
  pointer-events: none;
  will-change: transform;
}

/* ---------- status + overlays ---------- */
.viewport__status {
  position: absolute;
  z-index: 4;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
}

.chip--action {
  height: 34px;
  gap: 8px;
  padding: 0 8px 0 12px;
  cursor: pointer;
  transition: transform var(--duration-fast) ease, box-shadow var(--duration) ease;
}

.chip--action:hover {
  box-shadow: var(--shadow-md);
}

.chip--action:active {
  transform: scale(0.97);
}

.chip--action strong {
  color: var(--text);
  font-weight: 600;
}

.stale-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.stale-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--accent);
  animation: ui-ping 1.6s var(--ease-out) infinite;
}

.viewport__empty {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  pointer-events: none;
}

.empty-enter-active {
  transition: opacity 260ms ease 120ms;
}

.empty-leave-active {
  transition: opacity 120ms ease, transform 160ms ease;
}

.empty-enter,
.empty-leave-to {
  opacity: 0;
}

.empty-leave-to {
  transform: scale(0.96);
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 10px;
  max-width: 440px;
  text-align: center;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 6px;
  border: 1px solid var(--viewport-chrome-border);
  border-radius: 20px;
  background: var(--viewport-chrome);
  color: var(--accent-text);
  box-shadow: var(--shadow-md);
}

.empty-state__icon .svg-icon {
  width: 28px;
  height: 28px;
}

.empty-state:not(.is-busy) .empty-state__icon {
  animation: empty-float 4s ease-in-out infinite;
}

@keyframes empty-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.empty-state__title {
  margin: 0;
  color: var(--text);
  font-size: 17px;
  font-weight: 600;
}

.empty-state__hint {
  margin: 0;
  color: var(--text-3);
  font-size: 14px;
  line-height: 1.5;
}

.empty-state__keys {
  display: inline-flex;
  gap: 3px;
  margin-left: 4px;
  vertical-align: 1px;
}

.qr-thumb {
  position: absolute;
  z-index: 3;
  bottom: 14px;
  left: 14px;
  display: grid;
  gap: 6px;
  width: 92px;
  padding: 8px;
  border: 1px solid var(--viewport-chrome-border);
  border-radius: var(--radius-md);
  background: var(--viewport-chrome);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: width 300ms var(--ease-out), box-shadow var(--duration) ease;
}

.qr-thumb:hover {
  box-shadow: var(--shadow-lg);
}

.qr-thumb.is-expanded {
  width: 232px;
}

.qr-thumb img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4px;
  background: #fff;
  image-rendering: pixelated;
}

.qr-thumb__caption {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: var(--text-2);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.qr-thumb__caption .svg-icon {
  width: 14px;
  height: 14px;
}

.viewport__meta {
  position: absolute;
  z-index: 3;
  right: 14px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.viewport__warnings {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.viewport__warnings:empty {
  display: none;
}

.viewport__warnings .chip {
  cursor: help;
}
</style>
