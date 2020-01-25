import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
// import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

class QRCode3D {
  constructor(canvas, options) {
    const defaultOptions = {
      baseColor: 0xeeeeee,
      qrcodeColor: 0x111111,
    };

    this.options = Object.assign({}, defaultOptions, options);
    this.canvas = canvas;

    this.baseMesh = null;
    this.qrcodeMesh = null;
    this.borderMesh = null;
    this.iconMesh = null;
    this.combinedMesh = null;

    this.generate3dModel();
  }

  generate3dModel() {
    const modelBase = new THREE.BoxGeometry(
      this.options.base.width,
      this.options.base.width,
      this.options.base.depth,
    );

    const materialBase = new THREE.MeshBasicMaterial({ color: this.options.baseColor });
    const materialBlock = new THREE.MeshBasicMaterial({ color: this.options.qrcodeColor });

    const baseMesh = new THREE.Mesh(modelBase, materialBase);
    baseMesh.position.set(0, 0, this.options.base.depth / 2);

    const qrcodeGeometry = new THREE.Geometry();
    const combinedGeometry = new THREE.Geometry();
    const borderGeometry = new THREE.Geometry();
    const iconGeometry = new THREE.Geometry();

    // add base to combined model
    baseMesh.updateMatrix();
    combinedGeometry.merge(baseMesh.geometry, baseMesh.matrix);

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
        const shapes = path.toShapes(true);

        // Each path has array of shapes
        shapes.forEach((shape) => {
          // Finally we can take each shape and extrude it
          const pathGeometry = new THREE.ExtrudeGeometry(shape, {
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
      const scaleRatio = iconSize.y / (blockWidth * 4);
      iconMesh.scale.x /= scaleRatio;
      iconMesh.scale.y /= scaleRatio;
      iconMesh.rotation.x = Math.PI;
      // move icon to center
      iconBoundingBox = new THREE.Box3().setFromObject(iconMesh);
      iconSize = iconBoundingBox.getSize();

      iconMesh.position.x = -iconSize.x / 2;
      iconMesh.position.y = -iconSize.y / 2 + blockWidth / 2;
      iconMesh.position.z = this.options.base.depth + this.options.code.depth;
      iconMesh.scale.x *= 0.9;
      iconMesh.scale.y *= 0.9;
      console.log(iconMesh.position);
      this.iconMesh = iconMesh;
    }

    const ctx = this.canvas.getContext('2d');
    for (let y = 0; y < canvasHeight; y += 1) {
      for (let x = 0; x < canvasWidth; x += 1) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const isBlack = pixel[0] === 0;
        if (isBlack) {
          let qrBlock;
          // Determine basic block element
          if (this.options.code.qrcodeBlockStyle === 'round') {
            qrBlock = new THREE.CylinderGeometry(
              blockWidth / 2,
              blockWidth / 2,
              this.options.code.depth,
              16,
            );
          } else {
            qrBlock = new THREE.BoxGeometry(
              blockWidth,
              blockWidth,
              this.options.code.depth,
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

          // don't draw block if it collides with icon
          if (this.iconMesh) {
            const safetyMargin = blockWidth / 2;
            if ((blockX > -iconSize.x / 2 - safetyMargin
              && blockX < iconSize.x / 2 + safetyMargin)
              && (blockY > -iconSize.y / 2 - safetyMargin
              && blockY < +iconSize.y / 2 + safetyMargin)) {
              // eslint-disable-next-line no-continue
              continue;
            }
          }

          const blockZ = this.options.base.depth + this.options.code.depth / 2;

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

    if (this.options.base.hasBorder) {
      const widthOffset = this.options.base.borderWidth / 2;
      const topSide = -this.options.base.width / 2 + widthOffset;
      const rightSide = this.options.base.width / 2 - widthOffset;
      const bottomSide = this.options.base.width / 2 - widthOffset;
      const leftSide = -this.options.base.width / 2 + widthOffset;

      const borderZ = this.options.base.depth + this.options.base.borderDepth / 2;

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
        this.options.base.width,
        this.options.base.borderDepth,
      );
      const rightBorderMesh = new THREE.Mesh(rightBorder, materialBlock);
      rightBorderMesh.position.set(0, rightSide, borderZ);
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
        this.options.base.width,
        this.options.base.borderDepth,
      );
      const leftBorderMesh = new THREE.Mesh(leftBorder, materialBlock);
      leftBorderMesh.position.set(0, leftSide, borderZ);
      leftBorderMesh.rotation.set(0, 0, Math.PI / 2);
      leftBorderMesh.updateMatrix();
      borderGeometry.merge(leftBorderMesh.geometry, leftBorderMesh.matrix);
      combinedGeometry.merge(leftBorderMesh.geometry, leftBorderMesh.matrix);
    }

    // separate meshes for dual extrusion
    this.baseMesh = baseMesh;
    this.qrcodeMesh = new THREE.Mesh(qrcodeGeometry, materialBlock);
    this.borderMesh = new THREE.Mesh(borderGeometry, materialBlock);

    // combined mesh
    this.combinedMesh = new THREE.Mesh(combinedGeometry, materialBase);
  }
}

export default QRCode3D;
