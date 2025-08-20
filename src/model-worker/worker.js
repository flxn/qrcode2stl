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
  console.time('3D Model Generation');
  await generator.generate3dModel();
  console.timeEnd('3D Model Generation');
  const parts = generator.getPartMeshes();

  let count = 0;
  Object.keys(parts).forEach((key) => {
    // No need to convert geometry since we're already using BufferGeometry
    parts[key] = parts[key].toJSON();
    count += 1;
  });

  // Get icon compatibility status if available
  let iconCompatibilityStatus = null;
  if (generator.getIconCompatibilityStatus) {
    iconCompatibilityStatus = generator.getIconCompatibilityStatus();
  }

  postMessage({
    type: 'result',
    meshCount: count,
    meshes: parts,
    iconCompatibilityStatus: iconCompatibilityStatus,
  });
});
