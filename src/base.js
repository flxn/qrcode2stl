import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import fontDefinitionHelvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { getRoundedRectShape } from './utils';

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
    this.combinedMesh = null;
    this.exportedMeshes = [];
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

    const shape = getRoundedRectShape(
      -(this.options.base.height + textBaseOffset) / 2,
      -this.options.base.width / 2,
      this.options.base.height + textBaseOffset,
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
   * @return {THREE.Mesh} the mesh of the text
   */
  getSubtitleMesh() {
    const textGeometry = new THREE.Geometry();
    // create text
    const fontHelvetikerBold = new THREE.Font(fontDefinitionHelvetikerBold);
    const tempTextGeometry = new THREE.TextGeometry(this.options.base.textMessage, {
      font: fontHelvetikerBold,
      size: this.options.base.textSize,
      height: this.options.base.textDepth,
    });

    const subtitleMesh = new THREE.Mesh(tempTextGeometry, this.materialDetail);
    const textBoundingBox = new THREE.Box3().setFromObject(subtitleMesh);
    const textSize = textBoundingBox.getSize();

    // place text at correct position
    const topSide = -this.options.base.height / 2 + this.options.base.textSize / 2 - this.options.base.textMargin;
    const bottomSide = this.options.base.height / 2 + this.options.base.textSize / 2 + this.options.base.textMargin;
    const placement = this.options.base.textPlacement === 'top' ? topSide : bottomSide;

    subtitleMesh.position.set(placement, -textSize.x / 2, this.options.base.depth);
    subtitleMesh.rotation.set(0, 0, Math.PI / 2);
    subtitleMesh.updateMatrix();
    textGeometry.merge(subtitleMesh.geometry, subtitleMesh.matrix);

    return new THREE.Mesh(textGeometry, this.materialDetail);
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
    const borderShape = getRoundedRectShape(
      -(this.options.base.height + topOffset) / 2,
      -this.options.base.width / 2,
      this.options.base.height + textBaseOffset,
      this.options.base.width,
      cornerRadius,
    );

    const fullShapeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(borderShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    }), this.materialDetail);
    fullShapeMesh.updateMatrix();

    // shape that covers everything except where the border should be
    const borderHoleShape = getRoundedRectShape(
      -(this.options.base.height + topOffset - this.options.base.borderWidth * 2) / 2,
      -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
      this.options.base.height + textBaseOffset - this.options.base.borderWidth * 2,
      this.options.base.width - this.options.base.borderWidth * 2,
      Math.max(0, cornerRadius - this.options.base.borderWidth),
    );

    const holeMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(borderHoleShape, {
      steps: 1,
      depth: this.options.base.borderDepth,
      bevelEnabled: false,
    }), this.materialDetail);
    holeMesh.updateMatrix();

    const bspFull = CSG.fromMesh(fullShapeMesh);
    const bspHole = CSG.fromMesh(holeMesh);
    const bspBorder = bspFull.subtract(bspHole);

    const borderMesh = CSG.toMesh(bspBorder, fullShapeMesh.matrix);
    borderMesh.material = this.materialDetail;
    borderMesh.position.z = this.options.base.depth;
    borderMesh.updateMatrix();

    return borderMesh;
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

    const combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
    return combinedMesh;
  }

  /**
   * Generates all required meshes of the 3D model
   */
  generate3dModel() {
    this.baseMesh = this.getBaseMesh();
    this.exportedMeshes.push(this.baseMesh);

    if (this.options.base.hasBorder) {
      this.borderMesh = this.getBorderMesh();
      this.exportedMeshes.push(this.borderMesh);
    }

    if (this.options.base.hasText) {
      this.subtitleMesh = this.getSubtitleMesh();
      if (!this.options.code.invert) {
        this.exportedMeshes.push(this.subtitleMesh);
      }
    }
  }
}

export default BaseTag3D;
