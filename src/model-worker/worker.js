import * as THREE from 'three';
import QRCode3D from '../qrcode3d';
import BaseTag3D from '../base';
import SpotifyCode3D from '../spotifyCode3D';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', async (event) => {
  let generator;
  if (event.data.mode === 'QR') {
    generator = new QRCode3D(event.data.qrCodeBitMask, event.data.options);
  } else if (event.data.mode === 'Spotify') {
    generator = new SpotifyCode3D(event.data.spotifyCodeShapes, event.data.options);
  } else if (event.data.mode === 'Text') {
    generator = new BaseTag3D(event.data.options);
  } else {
    return;
  }

  await generator.generate3dModel();
  const parts = generator.getPartMeshes();

  let count = 0;
  Object.keys(parts).forEach((key) => {
    parts[key].geometry = new THREE.BufferGeometry().fromGeometry(parts[key].geometry);
    parts[key] = parts[key].toJSON();
    count += 1;
  });

  postMessage({
    type: 'result',
    meshCount: count,
    meshes: parts,
  });
});
