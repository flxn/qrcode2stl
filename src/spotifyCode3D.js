import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import pathThatSvg from 'path-that-svg';
import BaseTag3D from './base';
import { getRoundedRectShape, getBoundingBoxSize, subtractMesh } from './utils';

/**
 * Class used for generating the 3D model of the Spotify Code
 */
class SpotifyCode3D extends BaseTag3D {
  constructor(options) {
    super(options);
    this.spotifyCodeMesh = null;
    this.exportedMeshes = super.getPartMeshes();
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
    const svgData = loader.parse(pathedSvg);
    // Loop through all of the parsed paths
    svgData.paths.forEach((path, pathNo) => {
      const shapes = path.toShapes(true, false);
      // Each path has array of shapes
      shapes.forEach((shape) => {
        let shapeDepth = this.options.code.depth;
        if (this.options.code.cityMode && pathNo !== svgData.paths.length - 1) {
          shapeDepth = Math.min(this.options.code.depth, this.options.code.depthMax) + Math.random() * Math.abs(this.options.code.depthMax - this.options.code.depth);
        }
        // Finally we can take each shape and extrude it
        const pathGeometry = new THREE.ExtrudeGeometry(shape, {
          steps: 1,
          depth: shapeDepth,
          bevelEnabled: false,
        });

        const pathMesh = new THREE.Mesh(pathGeometry, this.materialDetail);
        pathMesh.position.set(0, 0, -shapeDepth + this.options.code.depth);
        pathMesh.rotation.set(0, 0, -Math.PI / 2);
        pathMesh.updateMatrix();

        spotifyCodeGeometry.merge(pathMesh.geometry, pathMesh.matrix);
      });
    });

    const spotifyCodeMesh = new THREE.Mesh(spotifyCodeGeometry, this.materialDetail);
    // scale icon to correct size
    let iconSize = getBoundingBoxSize(spotifyCodeMesh);

    const iconSizeRatio = 1;
    const scaleRatioY = iconSize.y / (this.availableWidth * iconSizeRatio);
    const scaleRatioX = iconSize.x / (this.availableWidth * iconSizeRatio);

    const scaleRatio = scaleRatioX > scaleRatioY ? scaleRatioX : scaleRatioY;
    spotifyCodeMesh.scale.x /= scaleRatio;
    spotifyCodeMesh.scale.y /= scaleRatio;
    spotifyCodeMesh.rotation.x = Math.PI;
    // move icon to center
    iconSize = getBoundingBoxSize(spotifyCodeMesh);

    spotifyCodeMesh.position.x = (-iconSize.x / 2) - (0.05 * (this.options.base.width - this.options.code.margin));
    spotifyCodeMesh.position.y = (-iconSize.y / 2) - (0.05 * (this.options.base.width - this.options.code.margin));
    spotifyCodeMesh.position.z = this.options.base.depth + this.options.code.depth;
    spotifyCodeMesh.updateMatrix();

    if (this.options.code.invert) {
      const cornerRadius = this.getCornerRadius();
      const textBaseOffset = this.getTextBaseOffset();
      const topOffset = this.getTextTopOffset();

      const innerAreaShape = getRoundedRectShape(
        -(this.options.base.height + topOffset - this.options.base.borderWidth * 2) / 2,
        -(this.options.base.width - this.options.base.borderWidth * 2) / 2,
        this.options.base.height + textBaseOffset - this.options.base.borderWidth * 2,
        this.options.base.width - this.options.base.borderWidth * 2,
        Math.max(0, cornerRadius - this.options.base.borderWidth),
      );

      const innerAreaMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(innerAreaShape, {
        steps: 1,
        depth: this.options.code.depth,
        bevelEnabled: false,
      }), this.materialDetail);
      innerAreaMesh.position.z = this.options.base.depth;
      innerAreaMesh.updateMatrix();

      spotifyCodeMesh.position.z = this.options.base.depth + this.options.code.depth;
      spotifyCodeMesh.updateMatrix();

      const invertedMesh = subtractMesh(innerAreaMesh, spotifyCodeMesh);
      invertedMesh.position.z = this.options.base.depth;
      invertedMesh.updateMatrix();
      return invertedMesh;
    }

    return spotifyCodeMesh;
  }

  /**
   * Returns one merged mesh of all part meshes
   */
  getCombinedMesh() {
    const baseCombinedGeometry = super.getCombinedMesh().geometry;
    baseCombinedGeometry.merge(this.spotifyCodeMesh.geometry, this.spotifyCodeMesh.matrix);
    this.combinedMesh = new THREE.Mesh(baseCombinedGeometry, this.materialBase);
    return this.combinedMesh;
  }

  /**
   * Generates all required meshes of the 3D model and combines them
   */
  async generate3dModel() {
    super.generate3dModel();
    this.spotifyCodeMesh = await this.getSpotifyCodeMesh();

    if (this.options.code.invert) {
      if (this.subtitleMesh) {
        this.spotifyCodeMesh = subtractMesh(this.spotifyCodeMesh, this.subtitleMesh);
      }
    }

    this.exportedMeshes.push(this.spotifyCodeMesh);
  }
}

export default SpotifyCode3D;
