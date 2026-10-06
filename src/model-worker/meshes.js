import * as THREE from 'three';
import { applyPreviewMaterial } from '../utils';

/**
 * Turns the serialized meshes returned by the model worker into THREE objects.
 * @param {object} meshesJson map of part name -> Object3D JSON
 * @param {object} options
 * @param {boolean} options.preview apply the shaded preview materials (not needed for exports)
 */
const parseWorkerMeshes = (meshesJson, { preview = true } = {}) => {
  const loader = new THREE.ObjectLoader();
  const meshes = {};
  Object.keys(meshesJson || {}).forEach((key) => {
    const object = loader.parse(meshesJson[key]);
    meshes[key] = preview ? applyPreviewMaterial(object, key) : object;
  });
  return meshes;
};

export default parseWorkerMeshes;
