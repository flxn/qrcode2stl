import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import BaseTag3D from './base';
import { getRoundedRectShape, getBoundingBoxSize, subtractMesh } from './utils';

/**
 * Class used for generating the 3D model of the Spotify Code
 */
class SpotifyCode3D extends BaseTag3D {
  constructor(spotifyCodeShapes, options) {
    super(options);
    
    // Handle shape format with proper hole support (r127+)
    this.spotifyCodeShapes = spotifyCodeShapes.map((shapeData) => {
      let shape, holes = [];
      
      // Handle new format with holes
      if (shapeData.shape && shapeData.holes !== undefined) {
        shape = new THREE.Shape().fromJSON(shapeData.shape);
        holes = shapeData.holes.map(holeData => new THREE.Path().fromJSON(holeData));
      } else {
        // Fallback for simple format
        shape = new THREE.Shape().fromJSON(shapeData);
      }
      
      // Set holes if any
      if (holes.length > 0) {
        shape.holes = holes;
      }
      
      return shape;
    });
    
    this.spotifyCodeMesh = null;
    this.exportedMeshes = super.getPartMeshes();
  }

  /**
   * @return {THREE.Mesh} the 3D mesh of the icon
   */
  async getSpotifyCodeMesh() {
    const geometries = [];
    this.spotifyCodeShapes.forEach((shape, shapeNo) => {
      let shapeDepth = this.options.code.depth;
      if (this.options.code.cityMode && shapeNo !== this.spotifyCodeShapes.length - 1) {
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

      const clonedGeometry = pathGeometry.clone();
      clonedGeometry.applyMatrix4(pathMesh.matrix);
      geometries.push(clonedGeometry);
    });

    if (geometries.length === 0) {
      return null;
    }
    
    // Ensure all geometries are non-indexed for compatibility
    const compatibleGeometries = geometries.map(geo => {
      if (geo.index !== null) {
        return geo.toNonIndexed();
      }
      return geo;
    });
    
    const spotifyCodeGeometry = BufferGeometryUtils.mergeGeometries(compatibleGeometries);
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
    const baseCombined = super.getCombinedMesh();
    const geometries = [baseCombined.geometry.clone()];
    
    if (this.spotifyCodeMesh && this.spotifyCodeMesh.geometry) {
      const spotifyGeo = this.spotifyCodeMesh.geometry.clone();
      spotifyGeo.applyMatrix4(this.spotifyCodeMesh.matrix);
      geometries.push(spotifyGeo);
    }
    
    // Ensure all geometries are non-indexed for compatibility
    const compatibleGeometries = geometries.map(geo => {
      if (geo.index !== null) {
        return geo.toNonIndexed();
      }
      return geo;
    });
    
    const combinedGeometry = BufferGeometryUtils.mergeGeometries(compatibleGeometries);
    this.combinedMesh = new THREE.Mesh(combinedGeometry, this.materialBase);
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

    this.exportedMeshes.spotifyCode = this.spotifyCodeMesh;
    this.exportedMeshes.combined = this.getCombinedMesh();
  }
}

export default SpotifyCode3D;
