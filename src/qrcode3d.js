import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import BaseTag3D from './base';
import { getRoundedRectShape, getBoundingBoxSize } from './utils';

/**
 * Class used for generating the 3D model from an html5 canvas that contains the qr code image
 * TODO: Refactor actual qrcode to model translation: integrate canvas into this class or maybe roll own qr code algorithm
 */
class QRCode3D extends BaseTag3D {
  constructor(canvas, options) {
    super(options);
    this.canvas = canvas;
    this.iconMesh = null;
    this.qrcodeMesh = null;
    this.exportedMeshes = super.getPartMeshes();
    // the width of the actual qr code blocks
    this.blockWidth = (this.availableWidth / this.canvas.width) * (this.options.code.blockSizeMultiplier / 100);
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

        const pathMesh = new THREE.Mesh(pathGeometry, this.materialDetail);
        pathMesh.position.set(0, 0, 0);
        pathMesh.rotation.set(0, 0, -Math.PI / 2);
        pathMesh.updateMatrix();
        iconGeometry.merge(pathMesh.geometry, pathMesh.matrix);
      });
    });

    const iconMesh = new THREE.Mesh(iconGeometry, this.materialDetail);

    // scale icon to correct size
    let iconSize = getBoundingBoxSize(iconMesh);

    const iconSizeRatio = this.options.code.iconSizeRatio / 100;
    const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
    const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

    const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
    iconMesh.scale.x /= scaleRatio;
    iconMesh.scale.y /= scaleRatio;
    iconMesh.rotation.x = Math.PI;

    // move icon to center
    iconSize = getBoundingBoxSize(iconMesh);

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
    const baseQRMesh = new THREE.Mesh(qrcodeGeometry, this.materialDetail);
    let bspQRMesh = CSG.fromMesh(baseQRMesh);
    // iterate through pixels in canvas
    for (let y = 0; y < this.canvas.height; y += 1) {
      for (let x = 0; x < this.canvas.width; x += 1) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const isBlack = pixel[0] === 0;
        if (isBlack) {
          // if pixel is black create a block
          let blockDepth = this.options.code.depth;
          if (this.options.code.cityMode) {
            blockDepth = Math.min(this.options.code.depth, this.options.code.depthMax) + Math.random() * Math.abs(this.options.code.depthMax - this.options.code.depth);
          }

          const qrBlock = new THREE.BoxGeometry(
            this.blockWidth,
            this.blockWidth,
            blockDepth,
          );

          const qrBlockMesh = new THREE.Mesh(qrBlock, this.materialDetail);

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

          // add qr code blocks to qrcode and combined model
          qrBlockMesh.updateMatrix();
          const bspBlockMesh = CSG.fromMesh(qrBlockMesh);
          bspQRMesh = bspQRMesh.union(bspBlockMesh);
          // qrcodeGeometry.merge(qrBlockMesh.geometry, qrBlockMesh.matrix);
        }
      }
    }

    const finalBlockMesh = CSG.toMesh(bspQRMesh, baseQRMesh.matrix);
    finalBlockMesh.material = this.materialDetail;

    if (this.options.code.invert) {
      let cornerRadius = 0;
      if (this.options.base.shape === 'roundedRectangle') {
        cornerRadius = this.options.base.cornerRadius;
      }

      let textBaseOffset = 0;
      if (this.options.base.hasText) {
        textBaseOffset = this.options.base.textSize + 2 * this.options.base.textMargin;
      }

      let topOffset = 0;
      if (this.options.base.textPlacement === 'top') {
        topOffset = 2 * textBaseOffset - 0.1; // TODO: does not work without the -0.1. Find out what's wrong here.
      }

      const innerAreaShape = getRoundedRectShape(
        -(this.options.base.width + topOffset - this.options.base.borderWidth * 2) / 2,
        -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
        this.options.base.width + textBaseOffset - this.options.base.borderWidth * 2,
        this.options.base.width - this.options.base.borderWidth * 2,
        Math.max(0, cornerRadius - this.options.base.borderWidth),
      );

      const innerAreaMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(innerAreaShape, {
        steps: 1,
        depth: this.options.code.depth,
        bevelEnabled: false,
      }), this.materialDetail);
      innerAreaMesh.position.z = 0;
      innerAreaMesh.updateMatrix();

      finalBlockMesh.position.z = -this.options.base.depth;
      finalBlockMesh.updateMatrix();

      const bspFullArea = CSG.fromMesh(innerAreaMesh);
      const bspQRHoles = CSG.fromMesh(finalBlockMesh);
      const bspInverted = bspFullArea.subtract(bspQRHoles);

      const invertedMesh = CSG.toMesh(bspInverted, innerAreaMesh.matrix);
      invertedMesh.material = this.materialDetail;
      invertedMesh.position.z = this.options.base.depth;
      invertedMesh.updateMatrix();
      return invertedMesh;
    }

    return finalBlockMesh;
  }

  /**
   * Returns one merged mesh of all part meshes
   */
  getCombinedMesh() {
    const baseCombinedGeometry = super.getCombinedMesh().geometry;
    baseCombinedGeometry.merge(this.qrcodeMesh.geometry, this.qrcodeMesh.matrix);
    if (this.iconMesh && !this.options.code.invert) {
      baseCombinedGeometry.merge(this.iconMesh.geometry, this.iconMesh.matrix);
    }
    this.combinedMesh = new THREE.Mesh(baseCombinedGeometry, this.materialBase);
    return this.combinedMesh;
  }

  /**
   * Generates all required meshes of the 3D model and combines them
   */
  generate3dModel() {
    super.generate3dModel();

    if (this.options.code.iconName !== 'none') {
      this.iconMesh = this.getIconMesh();
      const iconSize = getBoundingBoxSize(this.iconMesh);
      this.qrcodeMesh = this.getQRCodeMesh(iconSize);
    } else {
      this.qrcodeMesh = this.getQRCodeMesh();
    }

    if (this.options.code.invert) {
      if (this.subtitleMesh) {
        const bspText = CSG.fromMesh(this.subtitleMesh);
        const bspQR = CSG.fromMesh(this.qrcodeMesh);
        const bspCut = bspQR.subtract(bspText);
        this.qrcodeMesh = CSG.toMesh(bspCut, this.qrcodeMesh.matrix);
        this.qrcodeMesh.material = this.materialDetail;
      }
      if (this.iconMesh) {
        const bspIcon = CSG.fromMesh(this.iconMesh);
        const bspQR = CSG.fromMesh(this.qrcodeMesh);
        const bspCut = bspQR.subtract(bspIcon);
        this.qrcodeMesh = CSG.toMesh(bspCut, this.qrcodeMesh.matrix);
        this.qrcodeMesh.material = this.materialDetail;
      }
    } else if (this.iconMesh) {
      this.exportedMeshes.push(this.iconMesh);
    }
    this.exportedMeshes.push(this.qrcodeMesh);
  }
}

export default QRCode3D;
