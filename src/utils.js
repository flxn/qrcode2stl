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

export const getRandomBanner = (sizeStr) => {
  const banners = {
    '250x250': [
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=1ab9a933" target="_top"><img src="//assets.printer.tools/prusa/1ab9a933.jpg" alt="" title="" width="250" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=1ab9a933" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/66-original-prusa-mini#a_aid=flxn&amp;a_bid=fb910957" target=""><img src="//assets.printer.tools/prusa/fb910957.jpg" alt="The best home 3D printer of 2020" title="The best home 3D printer of 2020" width="250" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=fb910957" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com//51-original-prusa-i3-mk3s#a_aid=flxn&amp;a_bid=b47b249d" target=""><img src="//assets.printer.tools/prusa/b47b249d.jpg" alt="The best printer of 2020" title="The best printer of 2020" width="250" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=b47b249d" width="1" height="1" alt="" />',
    ],
    '160x600': [
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=6f46640a" target="_top"><img src="//assets.printer.tools/prusa/6f46640a.jpg" alt="" title="" width="160" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=6f46640a" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=363dc218" target="_top"><img src="//assets.printer.tools/prusa/363dc218.jpg" alt="" title="" width="160" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=363dc218" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/66-original-prusa-mini#a_aid=flxn&amp;a_bid=5cab2aaf" target=""><img src="//assets.printer.tools/prusa/5cab2aaf.jpg" alt="The best home 3D printer of 2020" title="The best home 3D printer of 2020" width="160" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=5cab2aaf" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com//51-original-prusa-i3-mk3s#a_aid=flxn&amp;a_bid=11110001" target=""><img src="//assets.printer.tools/prusa/11110001.jpg" alt="The best printer of 2020" title="The best printer of 2020" width="160" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=11110001" width="1" height="1" alt="" />',
    ],
    '300x250': [
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=61ff82fb" target="_top"><img src="//assets.printer.tools/prusa/61ff82fb.jpg" alt="" title="" width="300" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=61ff82fb" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=e2885a92" target="_top"><img src="//assets.printer.tools/prusa/e2885a92.jpg" alt="" title="" width="300" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=e2885a92" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/66-original-prusa-mini#a_aid=flxn&amp;a_bid=e9b60187" target=""><img src="//assets.printer.tools/prusa/e9b60187.jpg" alt="The best home 3D printer of 2020" title="The best home 3D printer of 2020" width="300" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=e9b60187" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com//51-original-prusa-i3-mk3s#a_aid=flxn&amp;a_bid=ec04113c" target=""><img src="//assets.printer.tools/prusa/ec04113c.jpg" alt="The best printer of 2020" title="The best printer of 2020" width="300" height="250" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=ec04113c" width="1" height="1" alt="" />',
    ],
    '300x600': [
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=2b8076ca" target="_top"><img src="//assets.printer.tools/prusa/2b8076ca.jpg" alt="" title="" width="300" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=2b8076ca" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=28c1abb6" target="_top"><img src="//assets.printer.tools/prusa/28c1abb6.jpg" alt="" title="" width="300" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=28c1abb6" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/66-original-prusa-mini#a_aid=flxn&amp;a_bid=d09e6c76" target=""><img src="//assets.printer.tools/prusa/d09e6c76.jpg" alt="The best home 3D printer of 2020" title="The best home 3D printer of 2020" width="300" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=d09e6c76" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com//51-original-prusa-i3-mk3s#a_aid=flxn&amp;a_bid=fe5157d7" target=""><img src="//assets.printer.tools/prusa/fe5157d7.jpg" alt="The best 3D printer of 2020" title="The best 3D printer of 2020" width="300" height="600" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=fe5157d7" width="1" height="1" alt="" />',
    ],
    '728x90': [
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=80672563" target="_top"><img src="//assets.printer.tools/prusa/80672563.jpg" alt="" title="" width="728" height="90" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=80672563" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/en/42-prusament#a_aid=flxn&amp;a_bid=03f15f1f" target="_top"><img src="//assets.printer.tools/prusa/03f15f1f.jpg" alt="" title="" width="728" height="90" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=03f15f1f" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com/66-original-prusa-mini#a_aid=flxn&amp;a_bid=71ba12bb" target=""><img src="//assets.printer.tools/prusa/71ba12bb.jpg" alt="The best home 3D printer of 2020" title="The best home 3D printer of 2020" width="728" height="90" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=71ba12bb" width="1" height="1" alt="" />',
      '<a href="https://shop.prusa3d.com//51-original-prusa-i3-mk3s#a_aid=flxn&amp;a_bid=a9d5b451" target=""><img src="//assets.printer.tools/prusa/a9d5b451.jpg" alt="The best 3D printer of 2020" title="The best 3D printer of 2020" width="728" height="90" /></a><img style="border:0" src="https://partner.prusa3d.com/scripts/x0vi19?a_aid=flxn&amp;a_bid=a9d5b451" width="1" height="1" alt="" />',
    ],
  };
  const bannerList = banners[sizeStr];
  return bannerList[Math.floor(Math.random() * bannerList.length)];
};
