import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

/**
 * Returns a rounded rectangle shape with the given parameters
 * Taken from: https://threejs.org/examples/webgl_geometry_shapes.html
 */
export const getCustomRoundedRectShape = (x, y, width, height, radiusA, radiusB, radiusC, radiusD, path = false) => {
  let ctx;
  // can return Shape (default) or Path, used for punching the hole in the border mesh
  // TODO: find out the differences because always using a Shape works too
  if (path) {
    ctx = new THREE.Path();
  } else {
    ctx = new THREE.Shape();
  }
  ctx.moveTo(x, y + radiusD);
  ctx.lineTo(x, y + height - radiusA);
  ctx.quadraticCurveTo(x, y + height, x + radiusA, y + height);
  ctx.lineTo(x + width - radiusB, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radiusB);
  ctx.lineTo(x + width, y + radiusC);
  ctx.quadraticCurveTo(x + width, y, x + width - radiusC, y);
  ctx.lineTo(x + radiusD, y);
  ctx.quadraticCurveTo(x, y, x, y + radiusD);
  return ctx;
};

/**
 * Returns a rounded rectangle shape with equal corner radius for each corner
 */
export const getRoundedRectShape = (x, y, width, height, radius, path = false) => getCustomRoundedRectShape(x, y, width, height, radius, radius, radius, radius, path);

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

/**
 * Combines toolMesh and targetMesh and returns the resulting mesh
 */
export const unionMesh = (targetMesh, toolMesh) => {
  const bspTarget = CSG.fromMesh(targetMesh);
  const bspTool = CSG.fromMesh(toolMesh);
  const bspResult = bspTarget.union(bspTool);
  const resultMesh = CSG.toMesh(bspResult, targetMesh.matrix);
  resultMesh.material = targetMesh.material;
  return resultMesh;
};
