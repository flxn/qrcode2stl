import * as THREE from 'three';
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
    this.blockWidth = (availableWidth / canvasWidth) * (this.options.code.blockSizeMultiplier / 100);

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
              this.blockWidth / 2,
              this.blockWidth / 2,
              this.options.code.depth,
              16,
            );
          } else {
            qrBlock = new THREE.BoxGeometry(
              this.blockWidth,
              this.blockWidth,
              this.options.code.depth,
            );
          }

          const qrBlockMesh = new THREE.Mesh(qrBlock, materialBlock);

          // qr code block positions
          let blockX = (x / canvasWidth) * availableWidth;
          blockX -= availableWidth / 2;
          blockX += this.blockWidth / 2;

          let blockY = (y / canvasHeight) * availableWidth;
          blockY -= availableWidth / 2;
          blockY += this.blockWidth / 2;

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
