import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import fontDefinitionHelvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';
import pathThatSvg from 'path-that-svg';

/**
 * Class used for generating the 3D model of the Spotify Code
 */
class SpotifyCode3D {
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

    // reset meshes
    this.baseMesh = null;
    this.spotifyCodeMesh = null;
    this.borderMesh = null;
    this.spotifyCodeMesh = null;
    this.textMesh = null;
    this.combinedMesh = null;

    // do not build the 3D model in constructor but async from calling function
    // this.generate3dModel();
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
   * @param {Number} textBaseOffset additional offset when using text
   * @return {THREE.Mesh} the mesh of the base
   */
  getBaseMesh(textBaseOffset = 0) {
    // TODO: rethink handling of rounded rectangle: Different shape category vs only corner radius adjustment
    let cornerRadius = 0;
    if (this.options.base.shape === 'roundedRectangle') {
      cornerRadius = this.options.base.cornerRadius;
    }

    const shape = SpotifyCode3D.getRoundedRectShape(
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
  async getSpotifyCodeMesh() {
    const spotifyCodeGeometry = new THREE.Geometry();
    const loader = new SVGLoader();
    let svgMarkup = document.querySelector('#spotify-code-preview').contentDocument.querySelector('svg').outerHTML;
    svgMarkup = svgMarkup.replace('<rect x="0" y="0" width="400" height="100" fill="#000000"/>', '');
    const pathedSvg = await pathThatSvg(svgMarkup);
    console.log(pathedSvg);
    const svgData = loader.parse(pathedSvg);
    // Loop through all of the parsed paths
    svgData.paths.forEach((path) => {
      const shapes = path.toShapes(true, false);
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
        spotifyCodeGeometry.merge(pathMesh.geometry, pathMesh.matrix);
      });
    });

    const spotifyCodeMesh = new THREE.Mesh(spotifyCodeGeometry, this.materialBlock);
    // scale icon to correct size
    let iconSize = SpotifyCode3D.getBoundingBoxSize(spotifyCodeMesh);

    const iconSizeRatio = 1;
    const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
    const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

    const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
    spotifyCodeMesh.scale.x /= scaleRatio;
    spotifyCodeMesh.scale.y /= scaleRatio;
    spotifyCodeMesh.rotation.x = Math.PI;
    // move icon to center
    iconSize = SpotifyCode3D.getBoundingBoxSize(spotifyCodeMesh);

    spotifyCodeMesh.position.x = (-iconSize.x / 2) - (0.05 * this.options.base.width);
    spotifyCodeMesh.position.y = (-iconSize.y / 2) - (0.05 * this.options.base.width);
    spotifyCodeMesh.position.z = this.options.base.depth + this.options.code.depth;
    spotifyCodeMesh.updateMatrix();

    return spotifyCodeMesh;
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
    const topSide = -this.options.base.height / 2 + this.options.base.textSize / 2 - this.options.base.textMargin;
    const bottomSide = this.options.base.height / 2 + this.options.base.textSize / 2 + this.options.base.textMargin;
    const placement = this.options.base.textPlacement === 'top' ? topSide : bottomSide;

    textMesh.position.set(placement, -textSize.x / 2, this.options.base.depth);
    textMesh.rotation.set(0, 0, Math.PI / 2);
    textMesh.updateMatrix();
    textGeometry.merge(textMesh.geometry, textMesh.matrix);

    return new THREE.Mesh(textGeometry, this.materialBlock);
  }

  /**
   * @param {Number} textBaseOffset additional offset when using text
   * @return {THREE.Mesh} the mesh of the border
   */
  getBorderMesh(textBaseOffset = 0) {
    let cornerRadius = 0;
    if (this.options.base.shape === 'roundedRectangle') {
      cornerRadius = this.options.base.cornerRadius;
    }

    let topOffset = 0;
    if (this.options.base.textPlacement === 'top') {
      topOffset = 2 * textBaseOffset - 0.1; // TODO: does not work without the -0.1. Find out what's wrong here.
    }

    // shape covering the whole area
    const borderShape = SpotifyCode3D.getRoundedRectShape(
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
    }), this.materialBlock);
    fullShapeMesh.updateMatrix();

    // shape that covers everything exact where the border should be
    const borderHoleShape = SpotifyCode3D.getRoundedRectShape(
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
  async generate3dModel() {
    const combinedGeometry = new THREE.Geometry();

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
    combinedGeometry.merge(this.baseMesh.geometry, this.baseMesh.matrix);

    this.spotifyCodeMesh = await this.getSpotifyCodeMesh();
    combinedGeometry.merge(this.spotifyCodeMesh.geometry, this.spotifyCodeMesh.matrix);

    this.combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
  }
}

export default SpotifyCode3D;
