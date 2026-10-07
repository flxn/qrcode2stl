import * as THREE from 'three';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import fontInterSemiBold from './assets/fonts/Inter_SemiBold.json';
import fontInterSemiBoldItalic from './assets/fonts/Inter_SemiBold_Italic.json';
import fontInterExtraBold from './assets/fonts/Inter_ExtraBold.json';
import fontInterExtraBoldItalic from './assets/fonts/Inter_ExtraBold_Italic.json';
import {
  getRoundedRectShape, subtractMesh, unionMesh,
} from './utils';

// baseline-to-baseline distance as a multiple of the text size
const LINE_HEIGHT = 1.3;
// material that must remain above a pocket on the underside (mm)
const MIN_FLOOR = 0.6;
// distance kept between rounded corners and the code / title (mm)
const CORNER_CLEARANCE = 0.5;

const toNumber = (value, fallback, min = -Infinity, max = Infinity) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
};

const insetRect = (rect, inset) => ({
  minX: rect.minX + inset,
  maxX: rect.maxX - inset,
  minY: rect.minY + inset,
  maxY: rect.maxY - inset,
});

/** true if (x, y) lies inside `rect` with rounded corners of `radius` */
const insideRoundedRect = (x, y, rect, radius) => {
  if (x < rect.minX - 1e-6 || x > rect.maxX + 1e-6 || y < rect.minY - 1e-6 || y > rect.maxY + 1e-6) {
    return false;
  }
  const cx = Math.min(Math.max(x, rect.minX + radius), rect.maxX - radius);
  const cy = Math.min(Math.max(y, rect.minY + radius), rect.maxY - radius);
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius * radius + 1e-6;
};

/**
 * Base tag: plate, border, title text, keychain attachment, NFC and magnet pockets.
 *
 * Coordinates of the generated parts: X runs from the top (-X) to the bottom (+X) of the tag,
 * Y from left (-Y) to right (+Y), Z up. The preview rotates the scene so this reads upright.
 */
class BaseTag3D {
  constructor(options) {
    const defaultOptions = {
      baseColor: 0xfafafa,
      qrcodeColor: 0x111111,
    };

    this.options = { ...defaultOptions, ...options };
    this.options.code = this.options.code || {};
    // problems found while generating, shown in the UI ({ code, params })
    this.warnings = [];
    this.sanitizeOptions();

    // default material for the base
    this.materialBase = new THREE.MeshBasicMaterial({
      color: this.options.baseColor,
    });
    // default material for qr code, border, etc.
    this.materialDetail = new THREE.MeshBasicMaterial({
      color: this.options.qrcodeColor,
    });

    // total available width without margin and borders for the inner part
    this.availableWidth = this.options.base.width - 2 * this.options.code.margin;
    if (this.options.base.hasBorder) {
      // subtract border width
      this.availableWidth -= 2 * this.options.base.borderWidth;
    }

    // reset meshes
    this.baseMesh = null;
    this.borderMesh = null;
    this.subtitleMesh = null;
    this.keychainAttachmentMesh = null;
    this.combinedMesh = null;
    this.exportedMeshes = {};
    this.layout = null;
  }

  warn(code, params = {}) {
    if (!this.warnings.some((warning) => warning.code === code)) {
      this.warnings.push({ code, params });
    }
  }

  getWarnings() {
    return this.warnings;
  }

  /**
   * Keeps numeric options in a range that produces a valid, printable model.
   * Values typed into the UI can be empty, negative or far too large.
   */
  sanitizeOptions() {
    const base = this.options.base;
    const code = this.options.code;

    base.width = toNumber(base.width, 100, 5);
    base.height = toNumber(base.height, base.width, 5);
    base.depth = toNumber(base.depth, 3, 0.4);
    base.cornerRadius = toNumber(base.cornerRadius, 0, 0);

    const smallestSide = Math.min(base.width, base.height);
    base.borderWidth = toNumber(base.borderWidth, 2, 0, Math.max(0, (smallestSide - 5) / 2));
    base.borderDepth = toNumber(base.borderDepth, 1, 0);
    if (base.hasBorder && (base.borderWidth <= 0 || base.borderDepth <= 0)) {
      base.hasBorder = false;
    }

    const border = base.hasBorder ? base.borderWidth : 0;
    const requestedMargin = toNumber(code.margin, 0, 0);
    // always leave at least 5 mm for the code itself
    const maxMargin = Math.max(0, (smallestSide - 2 * border - 5) / 2);
    code.margin = Math.min(requestedMargin, maxMargin);
    if (requestedMargin > maxMargin + 1e-6) {
      this.warn('marginLimited', { value: Math.round(code.margin * 10) / 10 });
    }
    code.depth = toNumber(code.depth, 1, 0.1);
    code.depthMax = toNumber(code.depthMax, code.depth, 0.1);
    code.blockSizeMultiplier = toNumber(code.blockSizeMultiplier, 100, 10, 200);
    code.iconSizeRatio = toNumber(code.iconSizeRatio, 20, 1, 100);

    base.textSize = toNumber(base.textSize, 10, 0);
    base.textMargin = toNumber(base.textMargin, 4, 0);
    base.textSpacing = toNumber(base.textSpacing, 5, 0);
    base.textDepth = toNumber(base.textDepth, 1, 0.1);
    base.textMessage = typeof base.textMessage === 'string' ? base.textMessage : String(base.textMessage ?? '');

    base.keychainHoleDiameter = toNumber(base.keychainHoleDiameter, 6, 0.5);
    base.keychainMaterialThickness = toNumber(base.keychainMaterialThickness, 1.5, 0.4);
    base.keychainOffset = toNumber(base.keychainOffset, 3, 0);

    base.nfcIndentationSize = toNumber(base.nfcIndentationSize, 0, 0);
    base.nfcIndentationDepth = toNumber(base.nfcIndentationDepth, 0, 0);
    base.magnetPocketSize = toNumber(base.magnetPocketSize, 0, 0);
    base.magnetPocketDepth = toNumber(base.magnetPocketDepth, 0, 0);
    base.magnetPocketOffset = toNumber(base.magnetPocketOffset, 0, 0);
  }

  /** Whether a title / text is rendered at all (an empty text adds nothing). */
  hasTitle() {
    const base = this.options.base;
    return !!base.hasText && base.textSize > 0 && base.textMessage.trim() !== '';
  }

  /**
   * Area occupied by the code (QR modules, Spotify code) in part coordinates, or null.
   * Subclasses override this; the title is laid out around it.
   */
  getCodeRect() {
    return null;
  }

  getBorderInset() {
    return this.options.base.hasBorder ? this.options.base.borderWidth : 0;
  }

  /* ------------------------------------------------------------------ */
  /* Text                                                                */
  /* ------------------------------------------------------------------ */

  getFonts() {
    if (!this.fonts) {
      this.fonts = [
        new Font(fontInterSemiBold),
        new Font(fontInterSemiBoldItalic),
        new Font(fontInterExtraBold),
        new Font(fontInterExtraBoldItalic),
      ];
    }
    return this.fonts;
  }

  /** "*a*" = italic, "**a**" = bold, "***a***" = bold italic */
  static parseEmphasis(line) {
    let text = line;
    let emphasis = 0;
    while (emphasis < 3 && text.length > 1 && text[0] === '*' && text[text.length - 1] === '*') {
      text = text.substr(1, text.length - 2);
      emphasis += 1;
    }
    return { text, emphasis };
  }

  /** Advance width of a string in mm, as used by the font layout. */
  measureTextWidth(text, emphasis) {
    const font = this.getFonts()[emphasis];
    const { data } = font;
    const scale = this.options.base.textSize / data.resolution;
    let width = 0;
    Array.from(text).forEach((char) => {
      const glyph = data.glyphs[char] || data.glyphs['?'];
      if (glyph) {
        width += glyph.ha * scale;
      }
    });
    return width;
  }

  /**
   * Wraps one line at word boundaries so it fits `maxWidth`.
   * Words longer than the line are split as a last resort.
   */
  wrapLine(line, maxWidth) {
    const { text, emphasis } = BaseTag3D.parseEmphasis(line);
    if (!Number.isFinite(maxWidth) || this.measureTextWidth(text, emphasis) <= maxWidth) {
      return [{ text, emphasis }];
    }
    const result = [];
    let current = '';
    const pushWordInPieces = (word) => {
      let piece = '';
      Array.from(word).forEach((char) => {
        if (piece && this.measureTextWidth(piece + char, emphasis) > maxWidth) {
          result.push({ text: piece, emphasis });
          piece = char;
        } else {
          piece += char;
        }
      });
      return piece;
    };
    text.split(/\s+/).filter(Boolean).forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (this.measureTextWidth(candidate, emphasis) <= maxWidth) {
        current = candidate;
        return;
      }
      if (current) {
        result.push({ text: current, emphasis });
      }
      current = this.measureTextWidth(word, emphasis) <= maxWidth ? word : pushWordInPieces(word);
    });
    if (current) {
      result.push({ text: current, emphasis });
    }
    return result;
  }

  /**
   * Builds the geometry of every text line (unpositioned) together with its bounds.
   * Bounds are in text space: x = reading direction, y = up, baseline at y = 0.
   */
  buildTextLines(maxWidth) {
    const base = this.options.base;
    const sourceLines = base.textMessage.replace(/\r/g, '').trim().split('\n');
    const lines = [];
    sourceLines.forEach((line) => {
      const wrapped = line.trim() === '' ? [{ text: '', emphasis: 0 }] : this.wrapLine(line.trim(), maxWidth);
      wrapped.forEach((entry) => lines.push(entry));
    });
    if (lines.length > sourceLines.length) {
      this.warn('titleWrapped', { lines: lines.length });
    }
    const fonts = this.getFonts();
    return lines.map(({ text, emphasis }) => {
      if (!text) {
        return { geometry: null, bounds: null };
      }
      const geometry = new TextGeometry(text, {
        font: fonts[emphasis],
        size: base.textSize,
        depth: base.textDepth,
      });
      geometry.computeBoundingBox();
      const { min, max } = geometry.boundingBox;
      return {
        geometry,
        bounds: { minX: min.x, maxX: max.x, minY: min.y, maxY: max.y },
      };
    });
  }

  /**
   * Vertical extent of a stack of lines relative to the first baseline (+ = further down).
   */
  static stackExtent(lines, lineAdvance) {
    let top = Infinity;
    let bottom = -Infinity;
    lines.forEach((line, index) => {
      if (!line.bounds) return;
      const baseline = index * lineAdvance;
      top = Math.min(top, baseline - line.bounds.maxY);
      bottom = Math.max(bottom, baseline - line.bounds.minY);
    });
    if (top === Infinity) {
      return { top: 0, bottom: 0 };
    }
    return { top, bottom };
  }

  /**
   * Computes the plate outline, the title placement and the effective corner radius.
   * Everything else (base, border, pockets, keychain, inverted code) uses this layout.
   */
  computeLayout() {
    const base = this.options.base;
    const border = this.getBorderInset();
    const plate = {
      minX: -base.height / 2,
      maxX: base.height / 2,
      minY: -base.width / 2,
      maxY: base.width / 2,
    };
    const code = this.getCodeRect();
    const layout = {
      plate, title: null, titleRect: null, cornerRadius: 0,
    };

    if (this.hasTitle()) {
      const placement = base.textPlacement || 'bottom';
      const margin = base.textMargin;
      const spacing = base.textSpacing;
      const lineAdvance = base.textSize * LINE_HEIGHT;
      const horizontal = placement === 'top' || placement === 'bottom' || placement === 'center';
      const interior = insetRect(plate, border);
      const maxWidth = horizontal ? interior.maxY - interior.minY - 2 * margin : Infinity;
      const lines = this.buildTextLines(maxWidth);
      const extent = BaseTag3D.stackExtent(lines, lineAdvance);
      const blockHeight = extent.bottom - extent.top;
      const lineWidths = lines.map((line) => (line.bounds ? line.bounds.maxX - line.bounds.minX : 0));
      const blockWidth = Math.max(0, ...lineWidths);

      let blockTop;
      const positions = [];
      if (placement === 'bottom' || placement === 'top') {
        const codeEdge = code ? code.maxX : base.height / 2 - border - margin;
        const codeTop = code ? code.minX : -codeEdge;
        if (placement === 'bottom') {
          blockTop = codeEdge + spacing;
          plate.maxX = Math.max(plate.maxX, blockTop + blockHeight + margin + border);
        } else {
          blockTop = codeTop - spacing - blockHeight;
          plate.minX = Math.min(plate.minX, blockTop - margin - border);
        }
      } else if (placement === 'center') {
        blockTop = -blockHeight / 2;
        // grow the plate rather than letting the text hang over its edge
        const needed = blockHeight / 2 + margin + border;
        if (needed > plate.maxX + 1e-6) {
          plate.minX = -needed;
          plate.maxX = needed;
          this.warn('plateEnlarged', { value: Math.round(2 * needed * 10) / 10 });
        }
      } else {
        // left / right: the block sits beside the code, textAlign picks top / center / bottom
        const codeRect = code || insetRect(plate, border + margin);
        if (base.textAlign === 'left') {
          blockTop = codeRect.minX;
        } else if (base.textAlign === 'right') {
          blockTop = codeRect.maxX - blockHeight;
        } else {
          blockTop = (codeRect.minX + codeRect.maxX) / 2 - blockHeight / 2;
        }
        let blockLeft;
        if (placement === 'right') {
          blockLeft = codeRect.maxY + spacing;
          plate.maxY = Math.max(plate.maxY, blockLeft + blockWidth + margin + border);
        } else {
          blockLeft = codeRect.minY - spacing - blockWidth;
          plate.minY = Math.min(plate.minY, blockLeft - margin - border);
        }
        // grow the plate if a tall text block does not fit beside the code
        plate.minX = Math.min(plate.minX, blockTop - margin - border);
        plate.maxX = Math.max(plate.maxX, blockTop + blockHeight + margin + border);
        lines.forEach((line, index) => {
          if (!line.bounds) return;
          const lineWidth = line.bounds.maxX - line.bounds.minX;
          positions[index] = blockLeft + (blockWidth - lineWidth) / 2 - line.bounds.minX;
        });
      }

      const firstBaseline = blockTop - extent.top;
      if (horizontal) {
        const inner = insetRect(plate, border);
        const left = inner.minY + margin;
        const right = inner.maxY - margin;
        lines.forEach((line, index) => {
          if (!line.bounds) return;
          const lineWidth = line.bounds.maxX - line.bounds.minX;
          if (lineWidth > right - left + 0.5) {
            this.warn('textOverflow');
          }
          if (base.textAlign === 'left') {
            // line up with the code when the line fits next to it
            const start = code && code.minY + lineWidth <= right ? Math.max(left, code.minY) : left;
            positions[index] = start - line.bounds.minX;
          } else if (base.textAlign === 'right') {
            const end = code && code.maxY - lineWidth >= left ? Math.min(right, code.maxY) : right;
            positions[index] = end - line.bounds.maxX;
          } else {
            positions[index] = -(line.bounds.minX + line.bounds.maxX) / 2;
          }
        });
      }

      layout.title = {
        lines, positions, firstBaseline, lineAdvance,
      };
      let minY = Infinity;
      let maxY = -Infinity;
      lines.forEach((line, index) => {
        if (!line.bounds) return;
        minY = Math.min(minY, positions[index] + line.bounds.minX);
        maxY = Math.max(maxY, positions[index] + line.bounds.maxX);
      });
      layout.titleRect = {
        minX: blockTop, maxX: blockTop + blockHeight, minY, maxY,
      };
    }

    layout.cornerRadius = this.computeCornerRadius(plate, [code, layout.titleRect].filter(Boolean));
    this.layout = layout;
    return layout;
  }

  /**
   * Largest usable corner radius: never more than half the plate and never so large
   * that the rounded corners cut into the code or the title.
   */
  computeCornerRadius(plate, keepRects) {
    const base = this.options.base;
    if (base.shape !== 'roundedRectangle') {
      return 0;
    }
    const requested = base.cornerRadius;
    const geometricMax = Math.min(plate.maxX - plate.minX, plate.maxY - plate.minY) / 2 - 0.01;
    let radius = Math.min(requested, geometricMax);
    const border = this.getBorderInset();
    const fits = (r) => {
      const inner = insetRect(plate, border);
      const innerRadius = Math.max(0, r - border);
      // keep a little clearance, but never more than the space up to the straight edges
      const clampX = (x) => Math.min(Math.max(x, inner.minX), inner.maxX);
      const clampY = (y) => Math.min(Math.max(y, inner.minY), inner.maxY);
      return keepRects.every((rect) => {
        const corners = [
          [rect.minX - CORNER_CLEARANCE, rect.minY - CORNER_CLEARANCE],
          [rect.minX - CORNER_CLEARANCE, rect.maxY + CORNER_CLEARANCE],
          [rect.maxX + CORNER_CLEARANCE, rect.minY - CORNER_CLEARANCE],
          [rect.maxX + CORNER_CLEARANCE, rect.maxY + CORNER_CLEARANCE],
        ];
        return corners.every(([x, y]) => insideRoundedRect(clampX(x), clampY(y), inner, innerRadius));
      });
    };
    if (!fits(radius)) {
      let low = 0;
      let high = radius;
      for (let i = 0; i < 30; i += 1) {
        const middle = (low + high) / 2;
        if (fits(middle)) {
          low = middle;
        } else {
          high = middle;
        }
      }
      radius = low;
    }
    if (requested - radius > 0.05) {
      this.warn('radiusLimited', { value: Math.round(radius * 10) / 10 });
    }
    return Math.max(0, radius);
  }

  getLayout() {
    return this.layout || this.computeLayout();
  }

  getCornerRadius() {
    return this.getLayout().cornerRadius;
  }

  /** Outline of the plate (optionally inset), as a THREE.Shape */
  getPlateShape(inset = 0) {
    const { plate, cornerRadius } = this.getLayout();
    const rect = insetRect(plate, inset);
    return getRoundedRectShape(
      rect.minX,
      rect.minY,
      rect.maxX - rect.minX,
      rect.maxY - rect.minY,
      Math.max(0, cornerRadius - inset),
    );
  }

  /** Inner area of the plate (inside the border); used for inverted codes. */
  getInnerAreaShape() {
    return this.getPlateShape(this.getBorderInset());
  }

  /**
   * @return {THREE.Mesh} the mesh of the base
   */
  getBaseMesh() {
    const base = this.options.base;
    const { plate } = this.getLayout();
    const modelBase = new THREE.ExtrudeGeometry(this.getPlateShape(), {
      steps: 1,
      depth: base.depth,
      bevelEnabled: false,
    });

    let baseMesh = new THREE.Mesh(modelBase, this.materialBase);
    baseMesh.position.set(0, 0, 0);
    baseMesh.updateMatrix();

    const plateWidth = plate.maxY - plate.minY;
    const plateHeight = plate.maxX - plate.minX;

    if (base.hasNfcIndentation) {
      // keep 2 mm walls around the pocket and a printable floor above it
      const maxSize = Math.max(0, Math.min(plateWidth, plateHeight) - 4);
      const size = Math.min(base.nfcIndentationSize, maxSize);
      const bottom = base.nfcIndentationHidden ? 1 : 0;
      const maxDepth = Math.max(0, base.depth - bottom - MIN_FLOOR);
      const depth = Math.min(base.nfcIndentationDepth, maxDepth);
      if (size < base.nfcIndentationSize - 1e-6 || depth < base.nfcIndentationDepth - 1e-6) {
        this.warn('nfcLimited', { size: Math.round(size * 10) / 10, depth: Math.round(depth * 10) / 10 });
      }

      if (size > 0.1 && depth > 0.1) {
        let holeMesh;
        if (base.nfcIndentationShape === 'round') {
          holeMesh = new THREE.Mesh(new THREE.CylinderGeometry(size / 2, size / 2, depth, 32), this.materialBase);
          holeMesh.rotation.x = -Math.PI / 2;
        } else {
          holeMesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, depth), this.materialBase);
        }
        holeMesh.position.set(
          (plate.minX + plate.maxX) / 2,
          (plate.minY + plate.maxY) / 2,
          bottom + depth / 2,
        );
        holeMesh.updateMatrix();

        baseMesh = subtractMesh(baseMesh, holeMesh);
        baseMesh.updateMatrix();
      }
    }

    if (base.hasMagnetPockets) {
      const pocketSize = base.magnetPocketSize;
      const pocketRadius = pocketSize / 2;
      const maxDepth = Math.max(0, base.depth - MIN_FLOOR);
      const pocketDepth = Math.min(maxDepth, base.magnetPocketDepth);
      if (base.magnetPocketDepth > maxDepth + 1e-6) {
        this.warn('magnetLimited', { depth: Math.round(pocketDepth * 10) / 10 });
      }
      const pocketOffset = base.magnetPocketOffset;

      if (pocketRadius > 0 && pocketDepth > 0) {
        const minX = plate.minX + pocketRadius;
        const maxX = plate.maxX - pocketRadius;
        const minY = plate.minY + pocketRadius;
        const maxY = plate.maxY - pocketRadius;

        const leftX = THREE.MathUtils.clamp(plate.minX + pocketOffset + pocketRadius, minX, maxX);
        const rightX = THREE.MathUtils.clamp(plate.maxX - pocketOffset - pocketRadius, minX, maxX);
        const topY = THREE.MathUtils.clamp(plate.minY + pocketOffset + pocketRadius, minY, maxY);
        const bottomY = THREE.MathUtils.clamp(plate.maxY - pocketOffset - pocketRadius, minY, maxY);

        [
          [leftX, topY],
          [rightX, topY],
          [leftX, bottomY],
          [rightX, bottomY],
        ].forEach(([x, y]) => {
          const holeMesh = new THREE.Mesh(new THREE.CylinderGeometry(
            pocketRadius,
            pocketRadius,
            pocketDepth,
            32,
          ), this.materialBase);
          holeMesh.rotation.x = -Math.PI / 2;
          holeMesh.position.set(x, y, pocketDepth / 2);
          holeMesh.updateMatrix();
          baseMesh = subtractMesh(baseMesh, holeMesh);
          baseMesh.updateMatrix();
        });
      }
    }

    return baseMesh;
  }

  /**
   * @return {THREE.Mesh} the mesh of the title text
   */
  getSubtitleMesh() {
    const { title } = this.getLayout();
    const geometries = [];
    title.lines.forEach((line, index) => {
      if (!line.geometry) return;
      const lineMesh = new THREE.Mesh(line.geometry, this.materialDetail);
      // text space (x right, y up) -> part space (x down, y right)
      lineMesh.rotation.set(0, 0, Math.PI / 2);
      lineMesh.position.set(title.firstBaseline + index * title.lineAdvance, title.positions[index], this.options.base.depth);
      lineMesh.updateMatrix();
      const geometry = line.geometry.clone();
      geometry.applyMatrix4(lineMesh.matrix);
      geometries.push(geometry.index !== null ? geometry.toNonIndexed() : geometry);
    });
    const textGeometry = geometries.length ? BufferGeometryUtils.mergeGeometries(geometries) : new THREE.BufferGeometry();
    return new THREE.Mesh(textGeometry, this.materialDetail);
  }

  /**
   * @return {THREE.Mesh} the mesh of the border
   */
  getBorderMesh() {
    const base = this.options.base;
    const fullShapeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(this.getPlateShape(), {
      steps: 1,
      depth: base.borderDepth,
      bevelEnabled: false,
    }), this.materialDetail);
    fullShapeMesh.updateMatrix();

    const holeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(this.getPlateShape(base.borderWidth), {
      steps: 1,
      depth: base.borderDepth,
      bevelEnabled: false,
    }), this.materialDetail);
    holeMesh.updateMatrix();

    const borderMesh = subtractMesh(fullShapeMesh, holeMesh);
    borderMesh.position.z = base.depth;
    borderMesh.updateMatrix();

    return borderMesh;
  }

  /**
   * One keychain tab: a bar with a rounded end around the hole.
   * Built pointing outwards along local -Y with the plate edge at local y = 0.
   */
  buildKeychainTab() {
    const base = this.options.base;
    const holeRadius = base.keychainHoleDiameter / 2;
    const ringWidth = base.keychainHoleDiameter + 2 * base.keychainMaterialThickness;
    // overlap into the plate so the tab is always solidly connected
    const overlap = Math.max(2, ringWidth / 2);
    // keychainOffset = distance between the plate edge and the hole
    const outside = base.keychainOffset + 2 * holeRadius + base.keychainMaterialThickness;

    // bar from inside the plate to the hole, ending in a half circle around it
    const ringRadius = ringWidth / 2;
    const ringCenter = -outside + ringRadius;
    const shape = new THREE.Shape();
    shape.moveTo(-ringRadius, overlap);
    shape.lineTo(-ringRadius, ringCenter);
    shape.absarc(0, ringCenter, ringRadius, Math.PI, 2 * Math.PI, false);
    shape.lineTo(ringRadius, overlap);
    shape.lineTo(-ringRadius, overlap);
    const tabMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: base.depth,
      bevelEnabled: false,
    }), this.materialBase);
    tabMesh.updateMatrix();

    const holeMesh = new THREE.Mesh(new THREE.CylinderGeometry(holeRadius, holeRadius, base.depth * 3, 32), this.materialBase);
    holeMesh.rotation.x = -Math.PI / 2;
    holeMesh.position.set(0, ringCenter, base.depth / 2);
    holeMesh.updateMatrix();

    return subtractMesh(tabMesh, holeMesh);
  }

  /**
   * @return {THREE.Mesh} the mesh of the keychain attachment (plus the mirrored one)
   */
  getKeychainAttachmentMesh() {
    const base = this.options.base;
    const { plate, cornerRadius } = this.getLayout();
    const centerX = (plate.minX + plate.maxX) / 2;
    const centerY = (plate.minY + plate.maxY) / 2;
    // distance between the bounding-box corner and the rounded outline along the diagonal
    const cornerInset = (Math.SQRT2 - 1) * cornerRadius / Math.SQRT2;

    // anchor point on the plate edge and the outward rotation for each placement
    const anchors = {
      left: { x: centerX, y: plate.minY, rotation: 0 },
      top: { x: plate.minX, y: centerY, rotation: -Math.PI / 2 },
      topLeft: { x: plate.minX + cornerInset, y: plate.minY + cornerInset, rotation: -Math.PI / 4 },
    };
    const mirrored = {
      left: { x: centerX, y: plate.maxY, rotation: Math.PI },
      top: { x: plate.maxX, y: centerY, rotation: Math.PI / 2 },
      topLeft: { x: plate.maxX - cornerInset, y: plate.maxY - cornerInset, rotation: Math.PI * 0.75 },
    };

    const placement = anchors[base.keychainPlacement] ? base.keychainPlacement : 'left';
    const place = (mesh, anchor) => {
      mesh.position.set(anchor.x, anchor.y, 0);
      mesh.rotation.z = anchor.rotation;
      mesh.updateMatrix();
      return mesh;
    };

    let finalMesh = place(this.buildKeychainTab(), anchors[placement]);
    if (base.mirrorHoles) {
      finalMesh = unionMesh(finalMesh, place(this.buildKeychainTab(), mirrored[placement]));
    }
    return finalMesh;
  }

  /**
   * Returns a list of meshes of all modelled parts
   */
  getPartMeshes() {
    return this.exportedMeshes;
  }

  /**
   * Returns one merged mesh of all part meshes
   */
  getCombinedMesh() {
    const geometries = [];

    // Collect base mesh
    const baseGeo = this.baseMesh.geometry.clone();
    baseGeo.applyMatrix4(this.baseMesh.matrix);
    geometries.push(baseGeo);

    if (this.borderMesh) {
      const borderGeo = this.borderMesh.geometry.clone();
      borderGeo.applyMatrix4(this.borderMesh.matrix);
      geometries.push(borderGeo);
    }

    if (this.subtitleMesh && !this.options.code.invert) {
      const subtitleGeo = this.subtitleMesh.geometry.clone();
      subtitleGeo.applyMatrix4(this.subtitleMesh.matrix);
      geometries.push(subtitleGeo);
    }

    if (this.keychainAttachmentMesh) {
      const keychainGeo = this.keychainAttachmentMesh.geometry.clone();
      keychainGeo.applyMatrix4(this.keychainAttachmentMesh.matrix);
      geometries.push(keychainGeo);
    }

    // Ensure all geometries are non-indexed to avoid compatibility issues
    const compatibleGeometries = geometries.map(geo => {
      if (geo.index !== null) {
        return geo.toNonIndexed();
      }
      return geo;
    });

    // Use BufferGeometryUtils to merge geometries
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(compatibleGeometries);

    const combinedMesh = new THREE.Mesh(mergedGeometry, this.materialBase);
    return combinedMesh;
  }

  /**
   * Generates all required meshes of the 3D model
   */
  async generate3dModel() {
    this.computeLayout();
    if (this.hasTitle()) {
      this.subtitleMesh = this.getSubtitleMesh();
      if (!this.options.code.invert) {
        this.exportedMeshes.subtitle = this.subtitleMesh;
      }
    }

    this.baseMesh = this.getBaseMesh();
    this.exportedMeshes.base = this.baseMesh;
    if (this.options.base.hasBorder) {
      this.borderMesh = this.getBorderMesh();
      this.exportedMeshes.border = this.borderMesh;
    }

    if (this.options.base.hasKeychainAttachment) {
      this.keychainAttachmentMesh = this.getKeychainAttachmentMesh();
      this.exportedMeshes.keychainAttachment = this.keychainAttachmentMesh;
    }

    this.exportedMeshes.combined = this.getCombinedMesh();
  }
}

export default BaseTag3D;
