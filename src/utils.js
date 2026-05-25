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

let previewNoiseTexture = null;

const getPreviewNoiseTexture = () => {
  if (previewNoiseTexture) {
    return previewNoiseTexture;
  }

  const size = 64;
  const data = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size; i += 1) {
    const value = 55 + Math.floor(Math.random() * 200);
    const offset = i * 4;
    data[offset] = value;
    data[offset + 1] = value;
    data[offset + 2] = value;
    data[offset + 3] = 255;
  }

  previewNoiseTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  previewNoiseTexture.wrapS = THREE.RepeatWrapping;
  previewNoiseTexture.wrapT = THREE.RepeatWrapping;
  previewNoiseTexture.repeat.set(6, 6);
  previewNoiseTexture.colorSpace = THREE.NoColorSpace;
  previewNoiseTexture.needsUpdate = true;

  return previewNoiseTexture;
};

const addFdmPreviewShader = (material, type) => {
  const sideStrength = type === 'base' ? 0.12 : 0.07;
  const topStrength = type === 'base' ? 0.08 : 0.04;
  const layerFrequency = 31.4; // roughly 0.2mm visual layer height
  const extrusionFrequency = 14.0; // roughly 0.45mm visual extrusion width

  material.onBeforeCompile = (shader) => {
    const vertexVaryings = [
      '#include <common>',
      'varying vec3 vFdmPosition;',
      'varying vec3 vFdmNormal;',
    ].join('\n');
    const normalVarying = [
      '#include <beginnormal_vertex>',
      'vFdmNormal = normalize(objectNormal);',
    ].join('\n');
    const positionVarying = [
      '#include <begin_vertex>',
      'vFdmPosition = transformed;',
    ].join('\n');
    const fragmentVaryings = [
      '#include <common>',
      'varying vec3 vFdmPosition;',
      'varying vec3 vFdmNormal;',
    ].join('\n');
    const fdmLayerShader = [
      '#include <color_fragment>',
      'vec3 fdmNormal = normalize(vFdmNormal);',
      'float fdmSideMask = pow(1.0 - abs(fdmNormal.z), 1.35);',
      'float fdmFlatMask = pow(abs(fdmNormal.z), 2.0);',
      'float fdmJitter = sin(vFdmPosition.x * 0.27 + vFdmPosition.y * 0.19) * 0.035;',
      `float fdmLayerWave = 0.5 + 0.5 * sin((vFdmPosition.z + fdmJitter) * ${layerFrequency.toFixed(3)});`,
      'float fdmLayerLine = pow(fdmLayerWave, 8.0) - 0.38;',
      'float fdmPathWobble = sin(vFdmPosition.y * 0.21 + vFdmPosition.z * 0.43) * 0.06;',
      `float fdmPathWave = 0.5 + 0.5 * sin((vFdmPosition.x + fdmPathWobble) * ${extrusionFrequency.toFixed(3)});`,
      'float fdmPathLine = pow(fdmPathWave, 3.0) - 0.42;',
      `float fdmShade = (fdmLayerLine * fdmSideMask * ${sideStrength.toFixed(3)}) + (fdmPathLine * fdmFlatMask * ${topStrength.toFixed(3)});`,
      'diffuseColor.rgb *= clamp(1.0 + fdmShade, 0.78, 1.18);',
    ].join('\n');

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', vertexVaryings)
      .replace('#include <beginnormal_vertex>', normalVarying)
      .replace('#include <begin_vertex>', positionVarying);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', fragmentVaryings)
      .replace('#include <color_fragment>', fdmLayerShader);
  };

  material.customProgramCacheKey = () => `fdm-preview-${type}`;
};

const createPreviewPlasticMaterial = (color, type) => {
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0,
    roughness: type === 'base' ? 0.86 : 0.58,
    envMapIntensity: type === 'base' ? 0.1 : 0.2,
    bumpMap: getPreviewNoiseTexture(),
    bumpScale: type === 'base' ? 0.04 : 0.02,
  });

  addFdmPreviewShader(material, type);
  return material;
};

export const applyPreviewMaterial = (object, role) => {
  const isBaseLike = role === 'base' || role === 'keychainAttachment';
  const fallbackColor = isBaseLike ? 0xfafafa : 0x111111;

  object.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    child.geometry.computeVertexNormals();
    child.geometry.normalizeNormals();

    const sourceMaterial = Array.isArray(child.material) ? child.material[0] : child.material;
    const color = sourceMaterial?.color?.getHex?.() ?? fallbackColor;
    child.material = createPreviewPlasticMaterial(color, isBaseLike ? 'base' : 'detail');
    child.castShadow = true;
    child.receiveShadow = true;
  });

  return object;
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

/**
 * Trims empty space from a set of processed icon shapes by translating all
 * shape and hole points so that the bounding box of the content starts at (0, 0).
 *
 * SVG files often have a larger viewBox than their actual content, which causes
 * the icon to appear off-center or scaled down unnecessarily. This function
 * removes that padding while preserving the relative positions of all shapes.
 *
 * @param {Array<{shape: object, holes: object[]}>} processedShapes - Serialized shape data
 * @return {Array<{shape: object, holes: object[]}>} - Trimmed shape data
 */
export const trimIconShapesBounds = (processedShapes) => {
  if (!processedShapes || processedShapes.length === 0) return processedShapes;

  // Collect all 2D control points from a serialized curve's JSON
  const curvePoints = (curve) => {
    switch (curve.type) {
      case 'LineCurve':
        return [curve.v1, curve.v2];
      case 'QuadraticBezierCurve':
        return [curve.v0, curve.v1, curve.v2];
      case 'CubicBezierCurve':
        return [curve.v0, curve.v1, curve.v2, curve.v3];
      case 'SplineCurve':
        return curve.points || [];
      case 'EllipseCurve':
      case 'ArcCurve':
        // aX, aY is the center; include it for a rough bound
        return [[curve.aX, curve.aY]];
      default:
        return [];
    }
  };

  // Collect all control points across all shapes and holes
  const allPoints = [];
  const collectFromCurves = (curves) => {
    (curves || []).forEach(curve => {
      curvePoints(curve).forEach(pt => {
        if (Array.isArray(pt)) allPoints.push(pt);
      });
    });
  };

  processedShapes.forEach(({ shape, holes }) => {
    collectFromCurves(shape.curves);
    (holes || []).forEach(hole => collectFromCurves(hole.curves));
  });

  if (allPoints.length === 0) return processedShapes;

  const minX = Math.min(...allPoints.map(p => p[0]));
  const minY = Math.min(...allPoints.map(p => p[1]));

  if (minX === 0 && minY === 0) return processedShapes; // nothing to trim

  // Translate all control points in all curves by (-minX, -minY)
  const translatePt = (pt) => [pt[0] - minX, pt[1] - minY];

  const translateCurve = (curve) => {
    const c = { ...curve };
    switch (c.type) {
      case 'LineCurve':
        c.v1 = translatePt(c.v1);
        c.v2 = translatePt(c.v2);
        break;
      case 'QuadraticBezierCurve':
        c.v0 = translatePt(c.v0);
        c.v1 = translatePt(c.v1);
        c.v2 = translatePt(c.v2);
        break;
      case 'CubicBezierCurve':
        c.v0 = translatePt(c.v0);
        c.v1 = translatePt(c.v1);
        c.v2 = translatePt(c.v2);
        c.v3 = translatePt(c.v3);
        break;
      case 'SplineCurve':
        c.points = (c.points || []).map(translatePt);
        break;
      case 'EllipseCurve':
      case 'ArcCurve':
        c.aX = c.aX - minX;
        c.aY = c.aY - minY;
        break;
      default:
        break;
    }
    return c;
  };

  const translatePathJSON = (pathJSON) => ({
    ...pathJSON,
    currentPoint: pathJSON.currentPoint
      ? translatePt(pathJSON.currentPoint)
      : pathJSON.currentPoint,
    curves: (pathJSON.curves || []).map(translateCurve),
  });

  return processedShapes.map(({ shape, holes }) => ({
    shape: translatePathJSON(shape),
    holes: (holes || []).map(translatePathJSON),
  }));
};

export const getRandomBanner = () => '';
