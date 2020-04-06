import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import fontDefinitionHelvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';

class QRCode3D {
  constructor(canvas, options) {
    const defaultOptions = {
      baseColor: 0xeeeeee,
      qrcodeColor: 0x333333,
    };

    this.options = { ...defaultOptions, ...options };
    this.canvas = canvas;

    // default material for the base
    this.materialBase = new THREE.MeshPhongMaterial({
      color: this.options.baseColor,
      specular: 0xffffff,
      shininess: 30,
    });
    // default material for qr code, border, etc.
    this.materialBlock = new THREE.MeshPhongMaterial({
      color: this.options.qrcodeColor,
      specular: 0x0d0d0d,
      shininess: 90,
    });

    // total available width without margin and borders for the qr code part
    this.availableWidth = this.options.base.width - 2 * this.options.code.margin;
    if (this.options.base.hasBorder) {
      // subtract border width
      this.availableWidth -= 2 * this.options.base.borderWidth;
    }

    // the width of the actual qr code blocks
    this.blockWidth = (this.availableWidth / this.canvas.width) * (this.options.code.blockSizeMultiplier / 100);


    this.baseMesh = null;
    this.qrcodeMesh = null;
    this.borderMesh = null;
    this.iconMesh = null;
    this.textMesh = null;
    this.combinedMesh = null;

    this.generate3dModel();
  }

  static getRoundedRectShape(x, y, width, height, radius) {
    const rrShape = new THREE.Shape();
    rrShape.moveTo(x, y + radius);
    rrShape.lineTo(x, y + height - radius);
    rrShape.quadraticCurveTo(x, y + height, x + radius, y + height);
    rrShape.lineTo(x + width - radius, y + height);
    rrShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    rrShape.lineTo(x + width, y + radius);
    rrShape.quadraticCurveTo(x + width, y, x + width - radius, y);
    rrShape.lineTo(x + radius, y);
    rrShape.quadraticCurveTo(x, y, x, y + radius);
    return rrShape;
  }

  getBaseMesh(textBaseOffset = 0) {
    let modelBase;
    let baseMesh;

    if (this.options.base.shape === 'roundedRectangle') {
      const shape = QRCode3D.getRoundedRectShape(
        -this.options.base.width / 2,
        -this.options.base.width / 2,
        this.options.base.width + textBaseOffset,
        this.options.base.width,
        this.options.base.cornerRadius,
      );

      modelBase = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: this.options.base.depth,
        bevelEnabled: false,
      });

      baseMesh = new THREE.Mesh(modelBase, this.materialBase);
      baseMesh.position.set(0, 0, 0);
    } else {
      modelBase = new THREE.BoxGeometry(
        this.options.base.width + textBaseOffset,
        this.options.base.width,
        this.options.base.depth,
      );

      baseMesh = new THREE.Mesh(modelBase, this.materialBase);
      baseMesh.position.set(0, 0, this.options.base.depth / 2);
    }

    if (textBaseOffset > 0) {
      const textPlacementOffset = (this.options.base.textPlacement === 'top' ? -textBaseOffset : textBaseOffset) / 2;
      baseMesh.position.x = textPlacementOffset;
    }

    return baseMesh;
  }

  static getIconSize(iconMesh) {
    const iconBoundingBox = new THREE.Box3().setFromObject(iconMesh);
    return iconBoundingBox.getSize();
  }

  /**
   * @return {THREE.Mesh} the 3D mesh of the icon
   */
  getIconMesh() {
    const iconGeometry = new THREE.Geometry();
    const loader = new SVGLoader();
    const svgMarkup = document.querySelector('#icon-preview').contentDocument.querySelector('svg').outerHTML;
    const svgData = loader.parse(svgMarkup);
    // Loop through all of the parsed paths
    svgData.paths.forEach((path) => {
      const shapes = path.toShapes(true, true);

      // Each path has array of shapes
      shapes.forEach((shape) => {
        // Finally we can take each shape and extrude it
        const pathGeometry = new THREE.ExtrudeGeometry(shape, {
          steps: 1,
          depth: this.options.code.depth,
          bevelEnabled: false,
        });

        const pathMesh = new THREE.Mesh(pathGeometry, this.materialBlock);
        pathMesh.position.set(0, 0, 0);
        pathMesh.rotation.set(0, 0, -Math.PI / 2);
        pathMesh.updateMatrix();
        iconGeometry.merge(pathMesh.geometry, pathMesh.matrix);
      });
    });

    const iconMesh = new THREE.Mesh(iconGeometry, this.materialBlock);

    // scale icon to correct size
    let iconSize = QRCode3D.getIconSize(iconMesh);

    const iconSizeRatio = this.options.code.iconSizeRatio / 100;
    const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
    const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

    const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
    iconMesh.scale.x /= scaleRatio;
    iconMesh.scale.y /= scaleRatio;
    iconMesh.rotation.x = Math.PI;

    // move icon to center
    iconSize = QRCode3D.getIconSize(iconMesh);

    iconMesh.position.x = -iconSize.x / 2;
    iconMesh.position.y = -iconSize.y / 2 + this.blockWidth / 2;
    iconMesh.position.z = this.options.base.depth + this.options.code.depth;
    this.iconMesh = iconMesh;
    iconMesh.updateMatrix();

    return iconMesh;
  }

  /**
   * @return {THREE.Mesh} the mesh of the actual QR-Code segment
   */
  getQRCodeMesh(iconSize = null) {
    const ctx = this.canvas.getContext('2d');
    const qrcodeGeometry = new THREE.Geometry();

    for (let y = 0; y < this.canvas.height; y += 1) {
      for (let x = 0; x < this.canvas.width; x += 1) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const isBlack = pixel[0] === 0;
        if (isBlack) {
          let qrBlock;
          let blockDepth = this.options.code.depth;
          if (this.options.code.cityMode) {
            blockDepth = 1 + Math.random() * 4;
          }
          // Determine basic block element
          if (this.options.code.qrcodeBlockStyle === 'round') {
            qrBlock = new THREE.CylinderGeometry(
              this.blockWidth / 2,
              this.blockWidth / 2,
              blockDepth,
              16,
            );
          } else {
            qrBlock = new THREE.BoxGeometry(
              this.blockWidth,
              this.blockWidth,
              blockDepth,
            );
          }

          const qrBlockMesh = new THREE.Mesh(qrBlock, this.materialBlock);

          // qr code block positions
          let blockX = (x / this.canvas.width) * this.availableWidth;
          blockX -= this.availableWidth / 2;
          blockX += this.blockWidth / 2;

          let blockY = (y / this.canvas.height) * this.availableWidth;
          blockY -= this.availableWidth / 2;
          blockY += this.blockWidth / 2;

          // don't draw block if it collides with icon bounding box
          if (iconSize) {
            const safetyMargin = Math.min(this.blockWidth * 2, 5);
            if ((blockX > -iconSize.x / 2 - safetyMargin
              && blockX < iconSize.x / 2 + safetyMargin)
              && (blockY > -iconSize.y / 2 - safetyMargin
              && blockY < +iconSize.y / 2 + safetyMargin)) {
              // eslint-disable-next-line no-continue
              continue;
            }
          }

          const blockZ = this.options.base.depth + blockDepth / 2;

          qrBlockMesh.position.set(blockX, blockY, blockZ);
          if (this.options.code.qrcodeBlockStyle === 'round') {
            // rotate cylinders 90 degrees in X and Y directions
            qrBlockMesh.rotation.set(Math.PI / 2, Math.PI / 2, 0);
          }

          // add qr code blocks to qrcode and combined model
          qrBlockMesh.updateMatrix();
          qrcodeGeometry.merge(qrBlockMesh.geometry, qrBlockMesh.matrix);
        }
      }
    }

    return new THREE.Mesh(qrcodeGeometry, this.materialBlock);
  }

  getTextMesh() {
    const textGeometry = new THREE.Geometry();
    // create text
    const fontHelvetikerBold = new THREE.Font(fontDefinitionHelvetikerBold);
    const tempTextGeometry = new THREE.TextGeometry(this.options.base.textMessage, {
      font: fontHelvetikerBold,
      size: this.options.base.textSize,
      height: this.options.base.textDepth,
    });

    const textMesh = new THREE.Mesh(tempTextGeometry, this.materialBlock);
    const textBoundingBox = new THREE.Box3().setFromObject(textMesh);
    const textSize = textBoundingBox.getSize();

    // place text at correct position
    const topSide = -this.options.base.width / 2 + this.options.base.textSize / 2 - this.options.base.textMargin;
    const bottomSide = this.options.base.width / 2 + this.options.base.textSize / 2 + this.options.base.textMargin;
    const placement = this.options.base.textPlacement === 'top' ? topSide : bottomSide;

    textMesh.position.set(placement, -textSize.x / 2, this.options.base.depth);
    textMesh.rotation.set(0, 0, Math.PI / 2);
    textMesh.updateMatrix();
    textGeometry.merge(textMesh.geometry, textMesh.matrix);

    return new THREE.Mesh(textGeometry, this.materialBlock);
  }

  getBorderMesh(textBaseOffset = 0) {
    let cornerRadius = 0;
    if (this.options.base.shape === 'roundedRectangle') {
      cornerRadius = this.options.base.cornerRadius;
    }

    /*
    if (this.options.base.hasText) {
      if (this.options.base.textPlacement === 'top') {
        topSide -= textBaseOffset;
      } else {
        bottomSide += textBaseOffset;
      }
    }
    */

    const borderShape = QRCode3D.getRoundedRectShape(
      -this.options.base.width / 2,
      -this.options.base.width / 2,
      this.options.base.width,
      this.options.base.width + textBaseOffset,
      cornerRadius,
    );

    const borderHoleShape = QRCode3D.getRoundedRectShape(
      -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
      -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
      this.options.base.width - this.options.base.borderWidth * 2,
      this.options.base.width - this.options.base.borderWidth * 2,
      Math.max(0, cornerRadius - this.options.base.borderWidth),
    );

    borderShape.holes.push(borderHoleShape);
    const borderExtrude = new THREE.ExtrudeGeometry(borderShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    });
    const borderMesh = new THREE.Mesh(borderExtrude, this.materialBlock);
    borderMesh.position.z = this.options.base.depth;
    borderMesh.updateMatrix();

    return borderMesh;
  }

  generate3dModel() {
    const combinedGeometry = new THREE.Geometry();

    if (this.options.code.iconName !== 'none') {
      this.iconMesh = this.getIconMesh();
      combinedGeometry.merge(this.iconMesh.geometry, this.iconMesh.matrix);
    }

    let textBaseOffset = 0;
    if (this.options.base.hasText) {
      this.textMesh = this.getTextMesh();
      combinedGeometry.merge(this.textMesh.geometry, this.textMesh.matrix);
      textBaseOffset = this.options.base.textSize + 2 * this.options.base.textMargin;
    }

    if (this.options.base.hasBorder) {
      this.borderMesh = this.getBorderMesh(textBaseOffset);
      combinedGeometry.merge(this.borderMesh.geometry, this.borderMesh.matrix);
    }

    this.baseMesh = this.getBaseMesh(textBaseOffset);
    if (this.options.base.hasText) {
      const textPlacementOffset = (this.options.base.textPlacement === 'top' ? -textBaseOffset : textBaseOffset) / 2;
      this.baseMesh.position.set(textPlacementOffset, 0, this.options.base.depth / 2);
    }
    combinedGeometry.merge(this.baseMesh.geometry, this.baseMesh.matrix);

    if (this.options.code.iconName !== 'none') {
      const iconSize = QRCode3D.getIconSize(this.iconMesh);
      this.qrcodeMesh = this.getQRCodeMesh(iconSize);
    } else {
      this.qrcodeMesh = this.getQRCodeMesh();
    }
    combinedGeometry.merge(this.qrcodeMesh.geometry, this.qrcodeMesh.matrix);
    // combined mesh
    this.combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
  }
}

export default QRCode3D;
