import * as THREE from 'three';
import fontInterSemiBold from './assets/fonts/Inter_SemiBold.json';
import fontInterSemiBoldItalic from './assets/fonts/Inter_SemiBold_Italic.json';
import fontInterExtraBold from './assets/fonts/Inter_ExtraBold.json';
import fontInterExtraBoldItalic from './assets/fonts/Inter_ExtraBold_Italic.json';
import {
  getRoundedRectShape, getCustomRoundedRectShape, subtractMesh, unionMesh, getBoundingBoxSize,
} from './utils';

class BaseTag3D {
  constructor(options) {
    const defaultOptions = {
      baseColor: 0xeeeeee,
      qrcodeColor: 0x333333,
    };

    this.options = { ...defaultOptions, ...options };

    // default material for the base
    this.materialBase = new THREE.MeshPhongMaterial({
      color: this.options.baseColor,
      specular: 0xffffff,
      shininess: 30,
    });
    // default material for qr code, border, etc.
    this.materialDetail = new THREE.MeshPhongMaterial({
      color: this.options.qrcodeColor,
      specular: 0x0d0d0d,
      shininess: 90,
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
  }

  /**
   * @return {THREE.Mesh} the mesh of the base
   */
  getBaseMesh() {
    // TODO: rethink handling of rounded rectangle: Different shape category vs only corner radius adjustment
    const cornerRadius = this.getCornerRadius();
    const textBaseOffset = this.getTextBaseOffset();
    const isOffsetTopBottom = this.options.base.textPlacement === 'top' || this.options.base.textPlacement === 'bottom' || this.options.base.textPlacement === 'center';
    const isOffsetLeftRight = this.options.base.textPlacement === 'left' || this.options.base.textPlacement === 'right';

    let shape;
    if (isOffsetTopBottom) {
      shape = getRoundedRectShape(
        -(this.options.base.height + textBaseOffset) / 2,
        -this.options.base.width / 2,
        this.options.base.height + textBaseOffset,
        this.options.base.width,
        cornerRadius,
      );
    } else if (isOffsetLeftRight) {
      shape = getRoundedRectShape(
        -this.options.base.height / 2,
        -(this.options.base.width + textBaseOffset) / 2,
        this.options.base.height,
        this.options.base.width + textBaseOffset,
        cornerRadius,
      );
    }

    const modelBase = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: this.options.base.depth,
      bevelEnabled: false,
    });

    let baseMesh = new THREE.Mesh(modelBase, this.materialBase);
    baseMesh.position.set(0, 0, 0);

    if (textBaseOffset > 0) {
      // shift base in x direction to align with text
      if (this.options.base.textPlacement === 'bottom') {
        baseMesh.position.x = textBaseOffset / 2;
      } else if (this.options.base.textPlacement === 'top') {
        baseMesh.position.x = -textBaseOffset / 2;
      } else if (this.options.base.textPlacement === 'center') {
        baseMesh.position.x = 0;
      } else if (this.options.base.textPlacement === 'left') {
        baseMesh.position.y = -textBaseOffset / 2;
      } else if (this.options.base.textPlacement === 'right') {
        baseMesh.position.y = textBaseOffset / 2;
      }
    }
    baseMesh.updateMatrix();

    if (this.options.base.hasNfcIndentation) {
      let holeMesh;
      if (this.options.base.nfcIndentationShape === 'round') {
        holeMesh = new THREE.Mesh(new THREE.CylinderGeometry(
          this.options.base.nfcIndentationSize / 2,
          this.options.base.nfcIndentationSize / 2,
          this.options.base.nfcIndentationDepth,
          32,
        ), this.materialBase);
        holeMesh.rotation.x = -Math.PI / 2;
      } else {
        // shape = square
        holeMesh = new THREE.Mesh(new THREE.BoxGeometry(
          this.options.base.nfcIndentationSize,
          this.options.base.nfcIndentationSize,
          this.options.base.nfcIndentationDepth,
        ), this.materialBase);
      }
      holeMesh.position.z = this.options.base.nfcIndentationDepth / 2;
      if (this.options.base.nfcIndentationHidden) {
        holeMesh.position.z += 1;
      }

      holeMesh.position.x = baseMesh.position.x;

      holeMesh.updateMatrix();

      baseMesh = subtractMesh(baseMesh, holeMesh);
      baseMesh.updateMatrix();
    }

    return baseMesh;
  }

  /**
   * @return {THREE.Mesh} the mesh of the text
   */
  getSubtitleMesh() {
    const textGeometry = new THREE.Geometry();
    // create text
    const fontRegular = new THREE.Font(fontInterSemiBold);
    const fontRegularItalic = new THREE.Font(fontInterSemiBoldItalic);
    const fontBold = new THREE.Font(fontInterExtraBold);
    const fontBoldItalic = new THREE.Font(fontInterExtraBoldItalic);

    const fonts = [fontRegular, fontRegularItalic, fontBold, fontBoldItalic];

    const textLines = this.options.base.textMessage.trim().split('\n');
    let numLines = textLines.length;
    const lineHeight = 1.2;

    for (let i = 0; i < numLines; i += 1) {
      let text = textLines[i];
      let emphLevel = 0;
      while (text[0] === '*' && text[text.length - 1] === '*') {
        text = text.substr(1, text.length - 2);
        emphLevel += 1;
        if (emphLevel === 3) {
          break;
        }
      }

      let subtitleMesh = null;

      if (this.options.base.textPlacement === 'top' || this.options.base.textPlacement === 'bottom' || this.options.base.textPlacement === 'center') {
        let textSize = null;
        let newLineCreated = false;
        do {
          const tempTextGeometry = new THREE.TextGeometry(text, {
            font: fonts[emphLevel],
            size: this.options.base.textSize,
            height: this.options.base.textDepth,
          });
          subtitleMesh = new THREE.Mesh(tempTextGeometry, this.materialDetail);
          textSize = getBoundingBoxSize(subtitleMesh);
          // Check if text width is larger than available width
          // if true snip off the last character one at a time until it fits
          if (textSize.x > this.availableWidth) {
            const lastChar = text[text.length - 1];
            text = text.substr(0, text.length - 1);
            if (!newLineCreated) {
              textLines.splice(i + 1, 0, lastChar);
              numLines += 1;
            } else {
              textLines[i + 1] = lastChar + textLines[i + 1];
            }
            newLineCreated = true;
          }
        } while (textSize.x > this.availableWidth);

        // recreate emphasis level if overflow occured
        if (newLineCreated) {
          console.log('line overflow');
          textLines[i + 1] = '*'.repeat(emphLevel) + textLines[i + 1] + '*'.repeat(emphLevel);
        }

        // place text at correct position
        // placement controls the vertical position of the text
        // alignment controls the horizontal position of the text
        const topSide = -this.options.base.height / 2 - this.options.base.textMargin - this.options.base.textSize * i * lineHeight;
        const bottomSide = this.options.base.height / 2 + this.options.base.textSize + this.options.base.textMargin + this.options.base.textSize * i * lineHeight;
        const center = (numLines > 1 ? -numLines * (this.options.base.textSize / 2) : 0) + this.options.base.textSize / 2 + this.options.base.textSize * i * lineHeight;

        let placement = bottomSide;
        if (this.options.base.textPlacement === 'top') {
          placement = topSide;
        } else if (this.options.base.textPlacement === 'center') {
          placement = center;
        }

        let alignment = 0;
        switch (this.options.base.textAlign) {
          case 'left':
            alignment = -this.availableWidth / 2 + this.options.base.textMargin;
            break;
          case 'center':
            alignment = -textSize.x / 2;
            break;
          case 'right':
            alignment = -textSize.x + this.availableWidth / 2 - this.options.base.textMargin;
            break;
          default:
            alignment = -textSize.x / 2;
            break;
        }
        subtitleMesh.position.set(placement, alignment, this.options.base.depth);
      } else if (this.options.base.textPlacement === 'left' || this.options.base.textPlacement === 'right') {
        const maxTextWidth = this.getTextRenderWidth() + (2 * this.options.base.textMargin);
        let textSize = null;
        do {
          const tempTextGeometry = new THREE.TextGeometry(text, {
            font: fonts[emphLevel],
            size: this.options.base.textSize,
            height: this.options.base.textDepth,
          });
          subtitleMesh = new THREE.Mesh(tempTextGeometry, this.materialDetail);
          textSize = getBoundingBoxSize(subtitleMesh);
        } while (textSize.x > this.availableWidth);

        // place text at correct position
        // side controls the horizontal position of the text, always centered
        // alignment controls the vertical position of the text (like placement in top/bottom) and takes line breaks into account
        const leftSide = -this.options.base.width / 2 - textSize.x - (maxTextWidth - textSize.x) / 2 + (this.options.base.hasBorder ? this.options.base.borderWidth : 0);
        const rightSide = this.options.base.width / 2 + (maxTextWidth - textSize.x) / 2 - (this.options.base.hasBorder ? this.options.base.borderWidth : 0);

        let side = rightSide;
        if (this.options.base.textPlacement === 'left') {
          side = leftSide;
        }

        let alignment = 0;
        switch (this.options.base.textAlign) {
          case 'left': // actually top
            alignment = -this.options.base.height / 2 + this.options.base.textMargin + this.options.base.textSize * (i + 1) * lineHeight;
            break;
          case 'right': // actually bottom
            alignment = this.options.base.height / 2 - this.options.base.textMargin - this.options.base.textSize * (numLines - i) * lineHeight + this.options.base.textSize;
            break;
          default: // center
            alignment = numLines === 1 ? (this.options.base.textSize / 2) : (this.options.base.textSize * (i + 1) * lineHeight) - (numLines * (this.options.base.textSize * lineHeight)) / 2;
            break;
        }
        subtitleMesh.position.set(alignment, side, this.options.base.depth);
      }

      subtitleMesh.rotation.set(0, 0, Math.PI / 2);
      subtitleMesh.updateMatrix();
      textGeometry.merge(subtitleMesh.geometry, subtitleMesh.matrix);
    }

    this.options.base.textMessage = textLines.join('\n');
    return new THREE.Mesh(textGeometry, this.materialDetail);
  }

  /**
   * @return {THREE.Mesh} the mesh of the border
   */
  getBorderMesh() {
    const cornerRadius = this.getCornerRadius();
    const textBaseOffset = this.getTextBaseOffset();
    const topOffset = this.getTextTopOffset();
    const leftOffset = this.getTextLeftOffset();
    const isOffsetTopBottom = this.options.base.textPlacement === 'top' || this.options.base.textPlacement === 'bottom' || this.options.base.textPlacement === 'center';
    const isOffsetLeftRight = this.options.base.textPlacement === 'left' || this.options.base.textPlacement === 'right';

    let borderShape;
    // shape covering the whole area
    // const borderShape = getRoundedRectShape(
    //   -(this.options.base.height + topOffset) / 2,
    //   -this.options.base.width / 2,
    //   this.options.base.height + textBaseOffset,
    //   this.options.base.width,
    //   cornerRadius,
    // );
    if (isOffsetTopBottom) {
      borderShape = getRoundedRectShape(
        -(this.options.base.height + topOffset) / 2,
        -this.options.base.width / 2,
        this.options.base.height + textBaseOffset,
        this.options.base.width,
        cornerRadius,
      );
    } else if (isOffsetLeftRight) {
      borderShape = getRoundedRectShape(
        -this.options.base.height / 2,
        -(this.options.base.width + leftOffset) / 2,
        this.options.base.height,
        this.options.base.width + textBaseOffset,
        cornerRadius,
      );
    }

    const fullShapeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(borderShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    }), this.materialDetail);
    fullShapeMesh.updateMatrix();

    // shape that covers everything except where the border should be
    let borderHoleShape;
    // const borderHoleShape = getRoundedRectShape(
    //   -(this.options.base.height + topOffset - this.options.base.borderWidth * 2) / 2,
    //   -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
    //   this.options.base.height + textBaseOffset - this.options.base.borderWidth * 2,
    //   this.options.base.width - this.options.base.borderWidth * 2,
    //   Math.max(0, cornerRadius - this.options.base.borderWidth),
    // );
    if (isOffsetTopBottom) {
      borderHoleShape = getRoundedRectShape(
        -(this.options.base.height + topOffset - this.options.base.borderWidth * 2) / 2,
        -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
        this.options.base.height + textBaseOffset - this.options.base.borderWidth * 2,
        this.options.base.width - this.options.base.borderWidth * 2,
        Math.max(0, cornerRadius - this.options.base.borderWidth),
      );
    } else if (isOffsetLeftRight) {
      borderHoleShape = getRoundedRectShape(
        -(this.options.base.height - this.options.base.borderWidth * 2) / 2,
        -(this.options.base.width + leftOffset - this.options.base.borderWidth * 2) / 2,
        this.options.base.height - this.options.base.borderWidth * 2,
        this.options.base.width + textBaseOffset - this.options.base.borderWidth * 2,
        Math.max(0, cornerRadius - this.options.base.borderWidth),
      );
    }

    const holeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(borderHoleShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    }), this.materialDetail);
    holeMesh.updateMatrix();

    const borderMesh = subtractMesh(fullShapeMesh, holeMesh);
    borderMesh.position.z = this.options.base.depth;
    borderMesh.updateMatrix();

    return borderMesh;
  }

  /**
   * @return {THREE.Mesh} the mesh of the keychain attachment hole
   */
  getKeychainAttachmentMesh() {
    const textBaseOffset = this.getTextBaseOffset();
    const textTopOffset = this.getTextTopOffset();
    const holeRadius = this.options.base.keychainHoleDiameter / 2;
    const cornerPlacementOffset = holeRadius * 2;
    const height = this.options.base.keychainHoleDiameter + 3;
    const width = height + cornerPlacementOffset;

    const attachmentShape = getCustomRoundedRectShape(
      -height / 2,
      -width / 2,
      height,
      width,
      0,
      0,
      height / 2,
      height / 2,
    );

    const attachmentShapeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(attachmentShape, {
      steps: 1,
      depth: this.options.base.depth,
      bevelEnabled: false,
    }), this.materialBase);

    attachmentShapeMesh.position.z = 0;
    attachmentShapeMesh.updateMatrix();

    const holeMesh = new THREE.Mesh(new THREE.CylinderGeometry(holeRadius, holeRadius, this.options.base.depth, 32), this.materialBase);
    holeMesh.rotation.x = -Math.PI / 2;
    holeMesh.position.z = this.options.base.depth / 2;
    holeMesh.position.y = -cornerPlacementOffset / 2;
    holeMesh.updateMatrix();

    let finalMesh = subtractMesh(attachmentShapeMesh, holeMesh);

    if (this.options.base.keychainPlacement === 'left') {
      finalMesh.position.x = (textBaseOffset - textTopOffset) / 2;
      finalMesh.position.y = -this.options.base.width / 2 - width / 2 + cornerPlacementOffset;
      finalMesh.position.z = 0;
    } else if (this.options.base.keychainPlacement === 'top') {
      finalMesh.position.x = -this.options.base.height / 2 - height / 2 + cornerPlacementOffset / 2 - textTopOffset / 2;
      finalMesh.position.y = 0;
      finalMesh.position.z = 0;
      finalMesh.rotation.z = -Math.PI / 2;
    } else if (this.options.base.keychainPlacement === 'topLeft') {
      finalMesh.position.x = -this.options.base.height / 2 - textTopOffset / 2;
      finalMesh.position.y = -this.options.base.width / 2;
      finalMesh.position.z = 0;
      finalMesh.rotation.z = -Math.PI / 4;
    }
    finalMesh.updateMatrix();

    if (this.options.base.mirrorHoles) {
      const mirror = subtractMesh(attachmentShapeMesh, holeMesh);
      if (this.options.base.keychainPlacement === 'left') {
        mirror.position.x = (textBaseOffset - textTopOffset) / 2;
        mirror.position.y = this.options.base.width / 2 + width / 2 - cornerPlacementOffset;
        mirror.rotation.z = Math.PI;
      } else if (this.options.base.keychainPlacement === 'top') {
        mirror.position.x = this.options.base.height / 2 + height / 2 - cornerPlacementOffset / 2 + textBaseOffset - textTopOffset / 2;
        mirror.rotation.z = Math.PI / 2;
      } else if (this.options.base.keychainPlacement === 'topLeft') {
        mirror.position.x = this.options.base.height / 2 + textBaseOffset - textTopOffset / 2;
        mirror.position.y = this.options.base.width / 2;
        mirror.rotation.z = -Math.PI / 4 + Math.PI;
      }
      mirror.updateMatrix();
      finalMesh = unionMesh(finalMesh, mirror);
    }

    return finalMesh;
  }

  getCornerRadius() {
    if (this.options.base.shape === 'roundedRectangle') {
      return this.options.base.cornerRadius;
    }
    return 0;
  }

  /**
   * Returns the offset of the text in the 3D model
   */
  getTextBaseOffset() {
    if (this.options.base.hasText) {
      if (this.options.base.textPlacement === 'top' || this.options.base.textPlacement === 'bottom') {
        const numLines = this.options.base.textMessage.trim().split('\n').length;
        const lineHeight = 1.2;
        return (this.options.base.textSize * numLines * lineHeight) + (2 * this.options.base.textMargin);
      }
      if (this.options.base.textPlacement === 'left') {
        return this.getTextRenderWidth() + (2 * this.options.base.textMargin);
      }
      if (this.options.base.textPlacement === 'right') {
        return this.getTextRenderWidth() + (2 * this.options.base.textMargin);
      }
    }
    return 0;
  }

  /**
   * Returns the size of the rendered text in the 3D model
   * used in getSubtitleMesh to calculate the line breaks
   */
  getTextRenderWidth() {
    if (!this.options.base.hasText) {
      return 0;
    }

    const textLines = this.options.base.textMessage.trim().split('\n');
    const numLines = textLines.length;

    let maxWidth = 0;
    for (let i = 0; i < numLines; i += 1) {
      let text = textLines[i];
      let emphLevel = 0;
      while (text[0] === '*' && text[text.length - 1] === '*') {
        text = text.substr(1, text.length - 2);
        emphLevel += 1;
        if (emphLevel === 3) {
          break;
        }
      }

      let subtitleMesh = null;
      let textSize = null;

      const tempTextGeometry = new THREE.TextGeometry(text, {
        font: new THREE.Font(fontInterSemiBold),
        size: this.options.base.textSize,
        height: this.options.base.textDepth,
      });
      subtitleMesh = new THREE.Mesh(tempTextGeometry, this.materialDetail);
      textSize = getBoundingBoxSize(subtitleMesh);
      // Check if text width is larger than available width
      // if true snip off the last character one at a time until it fits
      if (textSize.x > maxWidth) {
        maxWidth = textSize.x;
      }
    }

    return maxWidth;
  }

  getTextTopOffset() {
    if (this.options.base.textPlacement === 'top') {
      return 2 * this.getTextBaseOffset() - 0.1; // TODO: does not work without the -0.1. Find out what's wrong here.
    }
    return 0;
  }

  getTextLeftOffset() {
    if (this.options.base.textPlacement === 'left') {
      return 2 * this.getTextBaseOffset();
    }
    if (this.options.base.textPlacement === 'right') {
      return 0;
    }
    return 0;
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
    const combinedGeometry = new THREE.Geometry();
    combinedGeometry.merge(this.baseMesh.geometry, this.baseMesh.matrix);

    if (this.borderMesh) {
      combinedGeometry.merge(this.borderMesh.geometry, this.borderMesh.matrix);
    }

    if (this.subtitleMesh && !this.options.code.invert) {
      combinedGeometry.merge(this.subtitleMesh.geometry, this.subtitleMesh.matrix);
    }

    if (this.keychainAttachmentMesh) {
      combinedGeometry.merge(this.keychainAttachmentMesh.geometry, this.keychainAttachmentMesh.matrix);
    }

    const combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
    return combinedMesh;
  }

  /**
   * Generates all required meshes of the 3D model
   */
  async generate3dModel() {
    if (this.options.base.hasText) {
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
