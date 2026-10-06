import * as THREE from 'three';
import QRCode3D from '../qrcode3d';
import BaseTag3D from '../base';
import SpotifyCode3D from '../spotifyCode3D';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', async (event) => {
  const { requestId } = event.data;
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

  try {
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
      requestId,
      meshCount: count,
      meshes: parts,
      iconCompatibilityStatus,
      // size of a single QR module, used for the printability warning
      blockSize: typeof generator.blockWidth === 'number' ? generator.blockWidth : null,
    });
  } catch (error) {
    console.error('3D model generation failed:', error);
    postMessage({
      type: 'error',
      requestId,
      message: (error && error.message) || String(error),
    });
  }
});
