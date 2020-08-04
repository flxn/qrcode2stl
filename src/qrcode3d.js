import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import fontDefinitionHelvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';

/**
 * Class used for generating the 3D model from an html5 canvas that contains the qr code image
 * TODO: Refactor actual qrcode to model translation: integrate canvas into this class or maybe roll own qr code algorithm
 */
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

    // reset meshes
    this.baseMesh = null;
    this.qrcodeMesh = null;
    this.borderMesh = null;
    this.iconMesh = null;
    this.textMesh = null;
    this.combinedMesh = null;

    this.generate3dModel();
  }

  /**
   * Returns a rounded rectangle shape with the given parameters
   * Taken from: https://threejs.org/examples/webgl_geometry_shapes.html
   */
  static getRoundedRectShape(x, y, width, height, radius, path = false) {
    let ctx;
    // can return Shape (default) or Path, used for punching the hole in the border mesh
    // TODO: find out the differences because always using a Shape works too
    if (path) {
      ctx = new THREE.Path();
    } else {
      ctx = new THREE.Shape();
    }
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    return ctx;
  }

  /**
   * @return {THREE.Mesh} the mesh of the base
   */
  getBaseMesh() {
    // TODO: rethink handling of rounded rectangle: Different shape category vs only corner radius adjustment
    let cornerRadius = 0;
    if (this.options.base.shape === 'roundedRectangle') {
      cornerRadius = this.options.base.cornerRadius;
    }

    let textBaseOffset = 0;
    if (this.options.base.hasText) {
      textBaseOffset = this.options.base.textSize + 2 * this.options.base.textMargin;
    }

    const shape = QRCode3D.getRoundedRectShape(
      -(this.options.base.width + textBaseOffset) / 2,
      -this.options.base.width / 2,
      this.options.base.width + textBaseOffset,
      this.options.base.width,
      cornerRadius,
    );

    const modelBase = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: this.options.base.depth,
      bevelEnabled: false,
    });

    const baseMesh = new THREE.Mesh(modelBase, this.materialBase);
    baseMesh.position.set(0, 0, 0);

    if (textBaseOffset > 0) {
      // shift base in x direction to align with text
      const textPlacementOffset = (this.options.base.textPlacement === 'top' ? -textBaseOffset : textBaseOffset) / 2;
      baseMesh.position.x = textPlacementOffset;
    }

    baseMesh.updateMatrix();
    return baseMesh;
  }

  /**
   * @param {THREE.Mesh} mesh a mesh
   * @return {THREE.Vector3} size of the given mesh's bounding box
   */
  static getBoundingBoxSize(mesh) {
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    return boundingBox.getSize();
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
    let iconSize = QRCode3D.getBoundingBoxSize(iconMesh);

    const iconSizeRatio = this.options.code.iconSizeRatio / 100;
    const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
    const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

    const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
    iconMesh.scale.x /= scaleRatio;
    iconMesh.scale.y /= scaleRatio;
    iconMesh.rotation.x = Math.PI;

    // move icon to center
    iconSize = QRCode3D.getBoundingBoxSize(iconMesh);

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
    const baseQRMesh = new THREE.Mesh(qrcodeGeometry, this.materialBlock);
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

          // add qr code blocks to qrcode and combined model
          qrBlockMesh.updateMatrix();
          const bspBlockMesh = CSG.fromMesh(qrBlockMesh);
          bspQRMesh = bspQRMesh.union(bspBlockMesh);
          // qrcodeGeometry.merge(qrBlockMesh.geometry, qrBlockMesh.matrix);
        }
      }
    }

    const finalBlockMesh = CSG.toMesh(bspQRMesh, baseQRMesh.matrix);
    finalBlockMesh.material = this.materialBlock;

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

      const innerAreaShape = QRCode3D.getRoundedRectShape(
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
      }), this.materialBlock);
      innerAreaMesh.position.z = 0;
      innerAreaMesh.updateMatrix();

      finalBlockMesh.position.z = -this.options.base.depth;
      finalBlockMesh.updateMatrix();

      const bspFullArea = CSG.fromMesh(innerAreaMesh);
      const bspQRHoles = CSG.fromMesh(finalBlockMesh);
      const bspInverted = bspFullArea.subtract(bspQRHoles);

      const invertedMesh = CSG.toMesh(bspInverted, innerAreaMesh.matrix);
      invertedMesh.material = this.materialBlock;
      invertedMesh.position.z = this.options.base.depth;
      invertedMesh.updateMatrix();
      return invertedMesh;
    }

    return finalBlockMesh;
  }

  /**
   * @return {THREE.Mesh} the mesh of the text
   */
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

  /**
   * @return {THREE.Mesh} the mesh of the border
   */
  getBorderMesh() {
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

    // shape covering the whole area
    const borderShape = QRCode3D.getRoundedRectShape(
      -(this.options.base.width + topOffset) / 2,
      -this.options.base.width / 2,
      this.options.base.width + textBaseOffset,
      this.options.base.width,
      cornerRadius,
    );

    const fullShapeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(borderShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    }), this.materialBlock);
    fullShapeMesh.updateMatrix();

    // shape that covers everything except where the border should be
    const borderHoleShape = QRCode3D.getRoundedRectShape(
      -(this.options.base.width + topOffset - this.options.base.borderWidth * 2) / 2,
      -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
      this.options.base.width + textBaseOffset - this.options.base.borderWidth * 2,
      this.options.base.width - this.options.base.borderWidth * 2,
      Math.max(0, cornerRadius - this.options.base.borderWidth),
    );

    const holeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(borderHoleShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    }), this.materialBlock);
    holeMesh.updateMatrix();

    const bspFull = CSG.fromMesh(fullShapeMesh);
    const bspHole = CSG.fromMesh(holeMesh);
    const bspBorder = bspFull.subtract(bspHole);

    const borderMesh = CSG.toMesh(bspBorder, fullShapeMesh.matrix);
    borderMesh.material = this.materialBlock;
    borderMesh.position.z = this.options.base.depth;
    borderMesh.updateMatrix();

    return borderMesh;
  }

  /**
   * Generates all required meshes of the 3D model and combines them
   */
  generate3dModel() {
    const combinedGeometry = new THREE.Geometry();

    if (this.options.code.iconName !== 'none') {
      this.iconMesh = this.getIconMesh();
      combinedGeometry.merge(this.iconMesh.geometry, this.iconMesh.matrix);
    }

    if (this.options.base.hasBorder) {
      this.borderMesh = this.getBorderMesh();
      combinedGeometry.merge(this.borderMesh.geometry, this.borderMesh.matrix);
    }

    this.baseMesh = this.getBaseMesh();
    combinedGeometry.merge(this.baseMesh.geometry, this.baseMesh.matrix);

    if (this.options.code.iconName !== 'none') {
      const iconSize = QRCode3D.getBoundingBoxSize(this.iconMesh);
      this.qrcodeMesh = this.getQRCodeMesh(iconSize);
    } else {
      this.qrcodeMesh = this.getQRCodeMesh();
    }

    if (this.options.base.hasText) {
      const tempTextMesh = this.getTextMesh();
      if (this.options.code.invert) {
        // this.textMesh.position.z = -this.options.base.depth;
        tempTextMesh.updateMatrix();
        const bspText = CSG.fromMesh(tempTextMesh);
        const bspQR = CSG.fromMesh(this.qrcodeMesh);
        const bspCut = bspQR.subtract(bspText);
        this.qrcodeMesh = CSG.toMesh(bspCut, this.qrcodeMesh.matrix);
        this.qrcodeMesh.material = this.materialBlock;
      } else {
        this.textMesh = tempTextMesh;
        combinedGeometry.merge(this.textMesh.geometry, this.textMesh.matrix);
      }
    }

    combinedGeometry.merge(this.qrcodeMesh.geometry, this.qrcodeMesh.matrix);
    this.combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
  }
}

export default QRCode3D;
