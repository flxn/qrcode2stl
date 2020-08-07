import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

/**
 * Returns a rounded rectangle shape with the given parameters
 * Taken from: https://threejs.org/examples/webgl_geometry_shapes.html
 */
export const getRoundedRectShape = (x, y, width, height, radius, path = false) => {
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
};

/**
 * @param {THREE.Mesh} mesh a mesh
 * @return {THREE.Vector3} size of the given mesh's bounding box
 */
export const getBoundingBoxSize = (mesh) => {
  const boundingBox = new THREE.Box3().setFromObject(mesh);
  return boundingBox.getSize();
};

/**
 * Subtracts toolMesh from targetMesh and returns the resulting mesh
 */
export const subtractMesh = (targetMesh, toolMesh) => {
  const bspTarget = CSG.fromMesh(targetMesh);
  const bspTool = CSG.fromMesh(toolMesh);
  const bspResult = bspTarget.subtract(bspTool);
  const resultMesh = CSG.toMesh(bspResult, targetMesh.matrix);
  resultMesh.material = targetMesh.material;
  return resultMesh;
};
