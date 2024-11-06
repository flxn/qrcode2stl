/* eslint-disable no-plusplus */
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
  const target = new THREE.Vector3();
  boundingBox.getSize(target);
  return target;
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

export const save = (blob, filename) => {
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const saveAsString = (text, filename) => {
  save(new Blob([text], { type: 'text/plain' }), filename);
};

export const saveAsArrayBuffer = (buffer, filename) => {
  save(
    new Blob([buffer], { type: 'application/octet-stream' }),
    filename,
  );
};

// https://gist.github.com/timdown/021d9c8f2aabc7092df564996f5afbbf
// eslint-disable-next-line func-names
export const trimCanvas = (function () {
  function rowBlank(imageData, width, y) {
    for (let x = 0; x < width; ++x) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  function columnBlank(imageData, width, x, top, bottom) {
    for (let y = top; y < bottom; ++y) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  // eslint-disable-next-line func-names
  return function (canvas) {
    const ctx = canvas.getContext('2d');
    const { width } = canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let top = 0; let bottom = imageData.height; let left = 0; let
      right = imageData.width;

    while (top < bottom && rowBlank(imageData, width, top)) ++top;
    while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) --bottom;
    while (left < right && columnBlank(imageData, width, left, top, bottom)) ++left;
    while (right - 1 > left && columnBlank(imageData, width, right - 1, top, bottom)) --right;

    const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
    const copy = canvas.ownerDocument.createElement('canvas');
    const copyCtx = copy.getContext('2d');
    copy.width = trimmed.width;
    copy.height = trimmed.height;
    copyCtx.putImageData(trimmed, 0, 0);

    return copy;
  };
}());

export const getRandomBanner = () => '';
