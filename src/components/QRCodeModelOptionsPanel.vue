<template>
  <div class="model-options">
    <BaseOptions :options="options" :unit="unit" :width-help="$t('widthHelpSquare')" />

    <UiSection title="QR Code" default-open>
      <UiNumberField
        v-model="options.code.depth"
        :label="$t('labelCodeDepth')"
        :unit="unit"
        :min="0.1"
        :step="0.5"
        :help="$t('labelCodeDepthHelp')"
        :title="'code.depth — ' + $t('labelCodeDepth')"
      />
      <UiNumberField
        v-model="options.code.margin"
        :label="$t('margin')"
        :unit="unit"
        :min="0"
        :step="0.5"
        :help="$t('codeMarginHelp')"
        :warning="modelWarning('marginLimited', 'quietZone')"
        :title="'code.margin — ' + $t('margin')"
      />

      <!-- Icon Settings -->
      <UiField :label="$t('icon')" :title="'code.iconName — ' + $t('icon')">
        <UiPopover placement="bottom-end" :width="300" role="dialog" panel-class="icon-picker" :close-on-item-click="false">
          <template #trigger="{ toggle, open }">
            <button
              type="button"
              class="select-trigger"
              :class="{ 'is-open': open }"
              aria-haspopup="dialog"
              :aria-expanded="open ? 'true' : 'false'"
              :title="'code.iconName — ' + $t('icon')"
              @click="toggle"
            >
              <span v-if="options.code.iconName !== 'none'" class="icon-chip" :class="{ 'is-custom': isCustomIcon }">
                <img :src="getIconPreviewUrl()" alt="" />
              </span>
              <span class="select-trigger__label">{{ iconLabel }}</span>
              <UiIcon name="chevron-down" class="select-trigger__chevron" />
            </button>
          </template>
          <template #default="{ close }">
            <div class="icon-picker__upload">
              <label class="file-drop file-drop--compact">
                <input
                  ref="customIconInput"
                  type="file"
                  accept=".svg"
                  @change="handleCustomIconUpload($event, close)"
                />
                <span class="file-drop__icon"><UiIcon name="upload" /></span>
                <span class="file-drop__text">
                  <span class="file-drop__title">{{ $t('uploadCustomIcon') }}</span>
                  <span>{{ $t('selectSvgFile') }}</span>
                </span>
              </label>
            </div>
            <div class="icon-picker__grid" role="listbox" :aria-label="$t('icon')">
              <button
                type="button"
                class="icon-tile icon-tile--none"
                :class="{ 'is-active': options.code.iconName === 'none' }"
                role="option"
                :aria-selected="options.code.iconName === 'none' ? 'true' : 'false'"
                :title="$t('noIcon')"
                data-popover-item
                @click="iconSelected('none', close)"
              >
                <UiIcon name="x" />
              </button>
              <button
                v-for="(customIcon, index) in customIcons"
                :key="'custom-' + index"
                type="button"
                class="icon-tile is-custom"
                :class="{ 'is-active': options.code.iconName === 'custom-' + index }"
                role="option"
                :aria-selected="options.code.iconName === 'custom-' + index ? 'true' : 'false'"
                :title="customIcon.name"
                data-popover-item
                @click="iconSelected('custom-' + index, close)"
              >
                <img :src="customIcon.dataUrl" alt="" />
              </button>
              <button
                v-for="icon in icons"
                :key="icon"
                type="button"
                class="icon-tile"
                :class="{ 'is-active': options.code.iconName === icon }"
                role="option"
                :aria-selected="options.code.iconName === icon ? 'true' : 'false'"
                :title="icon"
                data-popover-item
                @click="iconSelected(icon, close)"
              >
                <img :src="'icons/' + icon + '.svg'" alt="" loading="lazy" />
              </button>
            </div>
          </template>
        </UiPopover>
      </UiField>

      <UiCollapse :open="options.code.iconName !== 'none'">
        <UiNumberField
          v-model="options.code.iconSizeRatio"
          :label="$t('icon') + ' ' + $t('size')"
          unit="%"
          :min="1"
          :help="$t('iconSizeHelp')"
          :title="'code.iconSizeRatio — ' + $t('icon') + ' ' + $t('size')"
        />
        <div class="icon-notes">
          <p class="field-hint">
            <template v-if="!isCustomIcon">
              Icons by Fontawesome
              <a href="https://fontawesome.com/license/free" target="_blank" rel="noopener">CC BY 4.0</a>
            </template>
            <template v-else>Custom uploaded icon</template>
          </p>
          <div class="notice notice--warning">
            <UiIcon name="alert" />
            <span>Error Correction will be set to high if you use icons. Please make sure to test the scannability of your QR code before printing!</span>
          </div>
          <div v-if="isCustomIcon" class="notice notice--info">
            <UiIcon name="info" />
            <span>{{ $t('monochromeLogoInfo') }}</span>
          </div>
          <div v-if="showIconCompatibilityWarning" class="notice notice--info">
            <UiIcon name="info" />
            <span>{{ iconCompatibilityMessage }}</span>
          </div>
        </div>
      </UiCollapse>

      <transition name="rise">
        <div v-if="printabilityWarning" class="notice notice--warning">
          <UiIcon name="alert" />
          <span>{{ printabilityWarning }}</span>
        </div>
      </transition>
    </UiSection>

    <TitleOptions :options="options" :unit="unit" />
    <KeychainOptions :options="options" :unit="unit" />
    <NfcOptions :options="options" :unit="unit" />
    <MagnetOptions :options="options" :unit="unit" />
  </div>
</template>

<script>
import { bus } from '../main';
import BaseOptions from './sections/BaseOptions.vue';
import TitleOptions from './sections/TitleOptions.vue';
import KeychainOptions from './sections/KeychainOptions.vue';
import NfcOptions from './sections/NfcOptions.vue';
import MagnetOptions from './sections/MagnetOptions.vue';
import UiSection from './ui/UiSection.vue';
import UiField from './ui/UiField.vue';
import UiNumberField from './ui/UiNumberField.vue';
import UiPopover from './ui/UiPopover.vue';
import UiCollapse from './ui/UiCollapse.vue';
import UiIcon from './ui/UiIcon.vue';
import modelWarnings from './sections/modelWarnings';

export default {
  name: 'QRCodeModelOptionsPanel',
  mixins: [modelWarnings],
  components: {
    BaseOptions,
    TitleOptions,
    KeychainOptions,
    NfcOptions,
    MagnetOptions,
    UiSection,
    UiField,
    UiNumberField,
    UiPopover,
    UiCollapse,
    UiIcon,
  },
  props: {
    options: Object,
    unit: String,
    iconCompatibilityStatus: Object,
    printabilityWarning: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icons: [
        'wifi',
        'user',
        'user-plus',
        'key',
        'mouse-pointer',
        'globe',
        'bookmark',
        'bubble',
        'marker',
        'map',
        'envelope',
        'facebook',
        'instagram',
        'whatsapp',
        'linkedin',
        'twitter',
        'google',
        'snapchat',
        'youtube',
        'tiktok',
        'patreon',
        'spotify',
        'soundcloud',
        'paypal',
        'share',
        'share-alt',
        'calendar',
        'phone',
        'music',
        'play',
        'exclamation',
        'info',
        'home',
        'heart',
        'check',
        'lightbulb',
        'star',
        'thumbs-up',
        'thumbs-down',
        'bolt',
        'moon',
      ],
      customIcons: [],
    };
  },
  computed: {
    isCustomIcon() {
      return this.options.code.iconName.startsWith('custom-');
    },
    iconLabel() {
      const name = this.options.code.iconName;
      if (name === 'none') {
        return this.$t('noIcon');
      }
      if (this.isCustomIcon) {
        const icon = this.customIcons[parseInt(name.replace('custom-', ''), 10)];
        return icon ? icon.name : this.$t('customIcon');
      }
      return name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    },
    showIconCompatibilityWarning() {
      // Show warning whenever compatibility mode is active with icons
      return this.iconCompatibilityStatus
        && this.iconCompatibilityStatus.hasIcon
        && this.iconCompatibilityStatus.isCompatibilityMode;
    },
    iconCompatibilityMessage() {
      if (!this.showIconCompatibilityWarning) return '';

      const messages = [];

      // Always mention compatibility mode is active
      messages.push(this.$t('iconCompatibleProcessing'));

      if (this.iconCompatibilityStatus.wasSimplified) {
        messages.push(this.$t('iconShapesSimplified'));
      }
      if (this.iconCompatibilityStatus.holesRemoved) {
        messages.push(this.$t('iconHolesRemoved'));
      }

      return `${this.$t('iconCompatibilityWarning')}: ${messages.join(', ')}.`;
    },
  },
  methods: {
    showUploadNotification(type, message) {
      bus.$emit('toast', { type: type === 'is-success' ? 'success' : 'error', message });
    },
    iconSelected(icon, close) {
      this.options.code.iconName = icon;
      if (close) {
        close();
      }
    },
    handleCustomIconUpload(event, close) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
        this.showUploadNotification('is-danger', this.$t('invalidSvgFile'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const svgContent = e.target.result;

          // Basic SVG validation
          if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
            this.showUploadNotification('is-danger', this.$t('invalidSvgFile'));
            return;
          }

          // Additional SVG validation - check for proper XML structure
          try {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const parseError = svgDoc.querySelector('parsererror');
            if (parseError) {
              throw new Error('Invalid SVG structure');
            }
          } catch (error) {
            this.showUploadNotification('is-danger', this.$t('invalidSvgFile'));
            return;
          }

          // Create a centered version for preview
          // Use encodeURIComponent to safely handle non-latin1 characters in SVG
          const centeredSvgContent = this.centerSvgForPreview(svgContent);
          const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(centeredSvgContent)}`;

          // Store custom icon (use original content for 3D processing, centered for preview)
          const customIcon = {
            name: file.name,
            content: svgContent, // Original for 3D processing
            previewContent: centeredSvgContent, // Centered for preview
            dataUrl,
          };

          // Limit to 10 custom icons to prevent memory issues
          if (this.customIcons.length >= 10) {
            this.customIcons.shift(); // Remove oldest icon
          }

          this.customIcons.push(customIcon);

          // Auto-select the uploaded icon
          const iconIndex = this.customIcons.length - 1;
          this.iconSelected(`custom-${iconIndex}`, close);

          this.showUploadNotification('is-success', this.$t('customIconUploaded'));

          // Clear the file input
          if (this.$refs.customIconInput) {
            this.$refs.customIconInput.value = '';
          }
        } catch (error) {
          console.error('Error processing SVG file:', error);
          this.showUploadNotification('is-danger', this.$t('iconUploadError'));
        }
      };

      reader.onerror = () => {
        this.showUploadNotification('is-danger', this.$t('iconUploadError'));
      };

      reader.readAsText(file);
    },
    getIconPreviewUrl() {
      if (this.isCustomIcon) {
        const index = parseInt(this.options.code.iconName.replace('custom-', ''), 10);
        if (this.customIcons[index]) {
          return this.customIcons[index].dataUrl;
        }
      }
      return `icons/${this.options.code.iconName}.svg`;
    },
    getCustomIconContent(iconName) {
      if (iconName.startsWith('custom-')) {
        const index = parseInt(iconName.replace('custom-', ''), 10);
        if (this.customIcons[index]) {
          return this.customIcons[index].content;
        }
      }
      return null;
    },
    centerSvgForPreview(svgContent) {
      try {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');

        if (!svgElement) return svgContent;

        // Get original viewBox
        const viewBox = svgElement.getAttribute('viewBox');
        if (!viewBox) return svgContent;

        const [, , width, height] = viewBox.split(' ').map(Number);

        // Calculate actual content bounds for better centering
        const contentBounds = this.calculateSvgContentBounds(svgElement);

        // Use standard FontAwesome viewBox format (512x512)
        const standardSize = 512;
        const newViewBox = `0 0 ${standardSize} ${standardSize}`;

        // Calculate scaling based on actual content bounds, not viewBox
        const contentWidth = contentBounds.maxX - contentBounds.minX;
        const contentHeight = contentBounds.maxY - contentBounds.minY;

        if (contentWidth === 0 || contentHeight === 0) {
          // Fallback to viewBox-based scaling
          const scaleX = standardSize / width;
          const scaleY = standardSize / height;
          const scale = Math.min(scaleX, scaleY) * 0.7;

          const scaledWidth = width * scale;
          const scaledHeight = height * scale;
          const offsetX = (standardSize - scaledWidth) / 2;
          const offsetY = (standardSize - scaledHeight) / 2;

          return this.createCenteredSvg(svgDoc, svgContent, scale, offsetX, offsetY, newViewBox);
        }

        // Use content-based scaling for better positioning
        const scaleX = (standardSize * 0.7) / contentWidth;
        const scaleY = (standardSize * 0.7) / contentHeight;
        const scale = Math.min(scaleX, scaleY);

        // Calculate centering offset based on content bounds
        const scaledContentWidth = contentWidth * scale;
        const scaledContentHeight = contentHeight * scale;
        const offsetX = (standardSize - scaledContentWidth) / 2 - (contentBounds.minX * scale);
        const offsetY = (standardSize - scaledContentHeight) / 2 - (contentBounds.minY * scale);

        return this.createCenteredSvg(svgDoc, svgContent, scale, offsetX, offsetY, newViewBox);
      } catch (error) {
        console.warn('Error formatting SVG to standard format:', error);
        return svgContent; // Return original if processing fails
      }
    },
    calculateSvgContentBounds(svgElement) {
      const tempSvg = svgElement.cloneNode(true);
      tempSvg.style.position = 'absolute';
      tempSvg.style.visibility = 'hidden';
      tempSvg.style.pointerEvents = 'none';
      document.body.appendChild(tempSvg);

      try {
        const visualElements = tempSvg.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, g, text');
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        visualElements.forEach((element) => {
          try {
            const bbox = element.getBBox();
            if (bbox && bbox.width > 0 && bbox.height > 0) {
              minX = Math.min(minX, bbox.x);
              minY = Math.min(minY, bbox.y);
              maxX = Math.max(maxX, bbox.x + bbox.width);
              maxY = Math.max(maxY, bbox.y + bbox.height);
            }
          } catch (e) {
            // Skip elements that don't support getBBox
          }
        });

        if (minX === Infinity) {
          const rect = tempSvg.getBoundingClientRect();
          minX = 0;
          minY = 0;
          maxX = rect.width;
          maxY = rect.height;
        }

        return {
          minX, minY, maxX, maxY,
        };
      } finally {
        document.body.removeChild(tempSvg);
      }
    },
    createCenteredSvg(svgDoc, originalSvgContent, scale, offsetX, offsetY, newViewBox) {
      try {
        const newSvg = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newSvg.setAttribute('viewBox', newViewBox);
        newSvg.setAttribute('role', 'img');
        newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        newSvg.setAttribute('aria-hidden', 'true');
        newSvg.setAttribute('focusable', 'false');

        const group = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${offsetX}, ${offsetY}) scale(${scale})`);

        const parser = new DOMParser();
        const originalSvgDoc = parser.parseFromString(originalSvgContent, 'image/svg+xml');
        const originalSvg = originalSvgDoc.querySelector('svg');
        if (originalSvg) {
          const allElements = originalSvg.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, g, defs, style, linearGradient, radialGradient, stop');

          allElements.forEach((element) => {
            if (element.tagName === 'path') {
              const newPath = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path');
              newPath.setAttribute('d', element.getAttribute('d'));

              const originalFill = element.getAttribute('fill');
              if (originalFill && originalFill !== 'none') {
                newPath.setAttribute('fill', originalFill);
              } else {
                newPath.setAttribute('fill', 'currentColor');
              }

              if (element.getAttribute('stroke')) {
                newPath.setAttribute('stroke', element.getAttribute('stroke'));
                newPath.setAttribute('stroke-width', element.getAttribute('stroke-width') || '1');
              }

              group.appendChild(newPath);
            } else if (element.tagName === 'g') {
              const clonedGroup = element.cloneNode(true);
              group.appendChild(clonedGroup);
            } else if (['defs', 'style', 'linearGradient', 'radialGradient', 'stop'].includes(element.tagName)) {
              const clonedElement = element.cloneNode(true);
              newSvg.appendChild(clonedElement);
            } else {
              const clonedElement = element.cloneNode(true);
              if (!clonedElement.getAttribute('fill') || clonedElement.getAttribute('fill') === 'none') {
                clonedElement.setAttribute('fill', 'currentColor');
              }
              group.appendChild(clonedElement);
            }
          });
        }

        newSvg.appendChild(group);

        const result = new XMLSerializer().serializeToString(newSvg);
        return result;
      } catch (error) {
        console.warn('Error creating centered SVG:', error);
        return originalSvgContent;
      }
    },
  },
};
</script>

<style>
.select-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: var(--control-height);
  padding: 0 10px 0 12px;
  border: 1px solid var(--input-border);
  border-radius: var(--radius-sm);
  background: var(--input-bg);
  color: var(--text);
  font-size: 14px;
  text-align: left;
  transition: border-color var(--duration) ease, box-shadow var(--duration) ease;
}

.select-trigger:hover {
  border-color: var(--input-border-hover);
}

.select-trigger.is-open,
.select-trigger:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--focus-ring);
}

.select-trigger__label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-trigger__chevron {
  width: 16px;
  height: 16px;
  color: var(--text-3);
  transition: transform var(--duration) var(--ease-out);
}

.select-trigger.is-open .select-trigger__chevron {
  transform: rotate(180deg);
}

.icon-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.icon-chip img {
  width: 16px;
  height: 16px;
}

.icon-picker {
  padding: 10px;
}

.icon-picker__upload {
  margin-bottom: 10px;
}

.file-drop--compact {
  padding: 10px 12px;
}

.file-drop--compact .file-drop__icon {
  width: 32px;
  height: 32px;
}

.file-drop--compact .file-drop__icon .svg-icon {
  width: 17px;
  height: 17px;
}

.icon-picker__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}

.icon-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-2);
  transition: border-color var(--duration) ease, background-color var(--duration) ease, transform var(--duration-fast) ease;
}

.icon-tile:hover,
.icon-tile:focus-visible {
  outline: none;
  border-color: var(--accent-soft-border);
  background: var(--accent-soft);
  transform: translateY(-1px);
}

.icon-tile.is-active {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: inset 0 0 0 1px var(--accent);
}

.icon-tile img {
  width: 18px;
  height: 18px;
}

.icon-tile .svg-icon {
  width: 16px;
  height: 16px;
}

[data-theme="dark"] .icon-tile:not(.is-custom) img {
  filter: invert(1);
}

.icon-tile.is-custom img {
  padding: 2px;
  border-radius: 4px;
  background: #fff;
}

.icon-notes {
  display: grid;
  gap: 8px;
}
</style>
