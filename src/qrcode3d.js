import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import fontDefinitionHelvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';

class QRCode3D {
  constructor(canvas, options) {
    const defaultOptions = {
      baseColor: 0xeeeeee,
      qrcodeColor: 0x333333,
    };

    this.options = Object.assign({}, defaultOptions, options);
    this.canvas = canvas;

    this.baseMesh = null;
    this.qrcodeMesh = null;
    this.borderMesh = null;
    this.iconMesh = null;
    this.textMesh = null;
    this.combinedMesh = null;

    this.generate3dModel();
  }

  static makeRoundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
  }

  generate3dModel() {
    let modelBase;
    let baseMesh;
    const materialBase = new THREE.MeshPhongMaterial({
      color: this.options.baseColor,
      specular: 0xffffff,
      shininess: 30,
    });
    const materialBlock = new THREE.MeshPhongMaterial({
      color: this.options.qrcodeColor,
      specular: 0x0d0d0d,
      shininess: 90,
    });

    if (this.options.base.shape === 'roundedRectangle') {
      const shape = new THREE.Shape();
      QRCode3D.makeRoundedRect(
        shape,
        -this.options.base.width / 2,
        -this.options.base.width / 2,
        this.options.base.width,
        this.options.base.width,
        this.options.base.cornerRadius,
      );

      modelBase = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: this.options.base.depth,
        bevelEnabled: false,
      });

      baseMesh = new THREE.Mesh(modelBase, materialBase);
      baseMesh.position.set(0, 0, 0);
    } else {
      modelBase = new THREE.BoxGeometry(
        this.options.base.width,
        this.options.base.width,
        this.options.base.depth,
      );

      baseMesh = new THREE.Mesh(modelBase, materialBase);
      baseMesh.position.set(0, 0, this.options.base.depth / 2);
    }

    const qrcodeGeometry = new THREE.Geometry();
    const combinedGeometry = new THREE.Geometry();
    const borderGeometry = new THREE.Geometry();
    const iconGeometry = new THREE.Geometry();
    const textGeometry = new THREE.Geometry();

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // total available width without margin and borders for the qr code part
    let availableWidth = this.options.base.width - 2 * this.options.code.margin;
    if (this.options.base.hasBorder) {
      availableWidth -= 2 * this.options.base.borderWidth;
    }
    // the width of the actual qr code blocks
    const blockWidth = (availableWidth / canvasWidth) * (this.options.code.blockSizeMultiplier / 100);

    // SVG icon
    let iconBoundingBox;
    let iconSize;
    if (this.options.code.iconName !== 'none') {
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

          const pathMesh = new THREE.Mesh(pathGeometry, materialBlock);
          pathMesh.position.set(0, 0, 0);
          pathMesh.rotation.set(0, 0, -Math.PI / 2);
          pathMesh.updateMatrix();
          iconGeometry.merge(pathMesh.geometry, pathMesh.matrix);
        });
      });

      const iconMesh = new THREE.Mesh(iconGeometry, materialBlock);

      // scale icon to correct size
      iconBoundingBox = new THREE.Box3().setFromObject(iconMesh);
      iconSize = iconBoundingBox.getSize();

      const iconSizeRatio = this.options.code.iconSizeRatio / 100;
      const scaleRatioY = iconSize.y / (availableWidth * iconSizeRatio);
      const scaleRatioX = iconSize.x / (availableWidth * iconSizeRatio);

      const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
      iconMesh.scale.x /= scaleRatio;
      iconMesh.scale.y /= scaleRatio;
      iconMesh.rotation.x = Math.PI;
      // move icon to center
      iconBoundingBox = new THREE.Box3().setFromObject(iconMesh);
      iconSize = iconBoundingBox.getSize();

      iconMesh.position.x = -iconSize.x / 2;
      iconMesh.position.y = -iconSize.y / 2 + blockWidth / 2;
      iconMesh.position.z = this.options.base.depth + this.options.code.depth;
      this.iconMesh = iconMesh;
      iconMesh.updateMatrix();
      combinedGeometry.merge(iconMesh.geometry, iconMesh.matrix);
    }

    const ctx = this.canvas.getContext('2d');
    for (let y = 0; y < canvasHeight; y += 1) {
      for (let x = 0; x < canvasWidth; x += 1) {
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
              blockWidth / 2,
              blockWidth / 2,
              blockDepth,
              16,
            );
          } else {
            qrBlock = new THREE.BoxGeometry(
              blockWidth,
              blockWidth,
              blockDepth,
            );
          }

          const qrBlockMesh = new THREE.Mesh(qrBlock, materialBlock);

          // qr code block positions
          let blockX = (x / canvasWidth) * availableWidth;
          blockX -= availableWidth / 2;
          blockX += blockWidth / 2;

          let blockY = (y / canvasHeight) * availableWidth;
          blockY -= availableWidth / 2;
          blockY += blockWidth / 2;

          // don't draw block if it collides with icon bounding box
          if (this.iconMesh) {
            const safetyMargin = Math.min(blockWidth * 2, 5);
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
          combinedGeometry.merge(qrBlockMesh.geometry, qrBlockMesh.matrix);
        }
      }
    }

    let textBaseOffset = 0;
    if (this.options.base.hasText) {
      // create text
      const fontHelvetikerBold = new THREE.Font(fontDefinitionHelvetikerBold);
      const tempTextGeometry = new THREE.TextGeometry(this.options.base.textMessage, {
        font: fontHelvetikerBold,
        size: this.options.base.textSize,
        height: this.options.base.textDepth,
      });

      const textMesh = new THREE.Mesh(tempTextGeometry, materialBlock);
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
      combinedGeometry.merge(textMesh.geometry, textMesh.matrix);

      textBaseOffset = this.options.base.textSize + 2 * this.options.base.textMargin;
      // update base size
      const updatedBase = new THREE.BoxGeometry(
        this.options.base.width + textBaseOffset,
        this.options.base.width,
        this.options.base.depth,
      );

      const textPlacementOffset = (this.options.base.textPlacement === 'top' ? -textBaseOffset : textBaseOffset) / 2;

      baseMesh = new THREE.Mesh(updatedBase, materialBase);
      baseMesh.position.set(textPlacementOffset, 0, this.options.base.depth / 2);
    }

    if (this.options.base.hasBorder) {
      if (this.options.base.shape === 'roundedRectangle') {
        const borderShape = new THREE.Shape();
        QRCode3D.makeRoundedRect(
          borderShape,
          -this.options.base.width / 2,
          -this.options.base.width / 2,
          this.options.base.width,
          this.options.base.width,
          this.options.base.cornerRadius,
        );
        const borderHolePath = new THREE.Path();
        QRCode3D.makeRoundedRect(
          borderHolePath,
          -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
          -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
          this.options.base.width - this.options.base.borderWidth * 2,
          this.options.base.width - this.options.base.borderWidth * 2,
          this.options.base.cornerRadius,
        );
        borderShape.holes.push(borderHolePath);
        const borderExtrude = new THREE.ExtrudeGeometry(borderShape, {
          steps: 1,
          depth: this.options.base.borderDepth,
          bevelEnabled: false,
        });
        const topBorderMesh = new THREE.Mesh(borderExtrude, materialBlock);
        topBorderMesh.position.z = this.options.base.depth;
        topBorderMesh.updateMatrix();
        borderGeometry.merge(topBorderMesh.geometry, topBorderMesh.matrix);
        combinedGeometry.merge(topBorderMesh.geometry, topBorderMesh.matrix);
      } else {
        const widthOffset = this.options.base.borderWidth / 2;
        let topSide = -this.options.base.width / 2 + widthOffset;
        const rightSide = this.options.base.width / 2 - widthOffset;
        let bottomSide = this.options.base.width / 2 - widthOffset;
        const leftSide = -this.options.base.width / 2 + widthOffset;

        const borderZ = this.options.base.depth + this.options.base.borderDepth / 2;

        let sideBorderLength = this.options.base.width;

        if (this.options.base.hasText) {
          if (this.options.base.textPlacement === 'top') {
            topSide -= textBaseOffset;
          } else {
            bottomSide += textBaseOffset;
          }
          sideBorderLength += textBaseOffset;
        }

        // Top Border
        const topBorder = new THREE.BoxGeometry(
          this.options.base.borderWidth,
          this.options.base.width,
          this.options.base.borderDepth,
        );
        const topBorderMesh = new THREE.Mesh(topBorder, materialBlock);
        topBorderMesh.position.set(topSide, 0, borderZ);
        topBorderMesh.updateMatrix();
        borderGeometry.merge(topBorderMesh.geometry, topBorderMesh.matrix);
        combinedGeometry.merge(topBorderMesh.geometry, topBorderMesh.matrix);

        // Right Border
        const rightBorder = new THREE.BoxGeometry(
          this.options.base.borderWidth,
          sideBorderLength,
          this.options.base.borderDepth,
        );
        const rightBorderMesh = new THREE.Mesh(rightBorder, materialBlock);
        if (this.options.base.hasText) {
          if (this.options.base.textPlacement === 'top') {
            rightBorderMesh.position.set(-textBaseOffset / 2, rightSide, borderZ);
          } else {
            rightBorderMesh.position.set(textBaseOffset / 2, rightSide, borderZ);
          }
        } else {
          rightBorderMesh.position.set(0, rightSide, borderZ);
        }
        rightBorderMesh.rotation.set(0, 0, Math.PI / 2);
        rightBorderMesh.updateMatrix();
        borderGeometry.merge(rightBorderMesh.geometry, rightBorderMesh.matrix);
        combinedGeometry.merge(rightBorderMesh.geometry, rightBorderMesh.matrix);

        // Bottom Border
        const bottomBorder = new THREE.BoxGeometry(
          this.options.base.borderWidth,
          this.options.base.width,
          this.options.base.borderDepth,
        );
        const bottomBorderMesh = new THREE.Mesh(bottomBorder, materialBlock);
        bottomBorderMesh.position.set(bottomSide, 0, borderZ);
        bottomBorderMesh.updateMatrix();
        borderGeometry.merge(bottomBorderMesh.geometry, bottomBorderMesh.matrix);
        combinedGeometry.merge(bottomBorderMesh.geometry, bottomBorderMesh.matrix);

        // Left Border
        const leftBorder = new THREE.BoxGeometry(
          this.options.base.borderWidth,
          sideBorderLength,
          this.options.base.borderDepth,
        );
        const leftBorderMesh = new THREE.Mesh(leftBorder, materialBlock);
        if (this.options.base.hasText) {
          if (this.options.base.textPlacement === 'top') {
            leftBorderMesh.position.set(-textBaseOffset / 2, leftSide, borderZ);
          } else {
            leftBorderMesh.position.set(textBaseOffset / 2, leftSide, borderZ);
          }
        } else {
          leftBorderMesh.position.set(0, leftSide, borderZ);
        }
        leftBorderMesh.rotation.set(0, 0, Math.PI / 2);
        leftBorderMesh.updateMatrix();
        borderGeometry.merge(leftBorderMesh.geometry, leftBorderMesh.matrix);
        combinedGeometry.merge(leftBorderMesh.geometry, leftBorderMesh.matrix);
      }
    }

    // add base to combined model
    baseMesh.updateMatrix();
    combinedGeometry.merge(baseMesh.geometry, baseMesh.matrix);

    // separate meshes for dual extrusion
    this.baseMesh = baseMesh;
    this.qrcodeMesh = new THREE.Mesh(qrcodeGeometry, materialBlock);
    this.borderMesh = new THREE.Mesh(borderGeometry, materialBlock);
    this.textMesh = new THREE.Mesh(textGeometry, materialBlock);

    // combined mesh
    this.combinedMesh = new THREE.Mesh(combinedGeometry, materialBase);
  }
}

export default QRCode3D;
