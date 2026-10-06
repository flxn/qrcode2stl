import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { trimCanvas } from '../utils';

const FOV_3D = 35;
const FOV_2D = 5;
const DEFAULT_AZIMUTH = THREE.MathUtils.degToRad(-30);
const DEFAULT_ELEVATION = THREE.MathUtils.degToRad(55);
const TOP_ELEVATION = Math.PI / 2 - 1e-4;
// fraction of the viewport (in NDC) the framed model may use horizontally / vertically
const FIT_LIMITS_3D = { x: 0.88, y: 0.8 };
const FIT_LIMITS_2D = { x: 0.84, y: 0.78 };
const PLACEHOLDER_BOX = new THREE.Box3(new THREE.Vector3(-50, -50, 0), new THREE.Vector3(50, 50, 4));
const PNG_MAX_SIDE = 2400;

/* Grid colours are given as raw sRGB triplets so they match the CSS palette exactly. */
const THEMES = {
  dark: {
    minor: [0.66, 0.71, 0.74],
    major: [0.76, 0.81, 0.84],
    minorOpacity: 0.075,
    majorOpacity: 0.14,
    shadowOpacity: 0.42,
  },
  light: {
    minor: [0.33, 0.37, 0.44],
    major: [0.28, 0.32, 0.39],
    minorOpacity: 0.085,
    majorOpacity: 0.15,
    shadowOpacity: 0.17,
  },
};

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);
const easeOutCubic = (t) => 1 - ((1 - t) ** 3);

const wrapAngle = (angle) => {
  let result = angle;
  while (result > Math.PI) result -= Math.PI * 2;
  while (result < -Math.PI) result += Math.PI * 2;
  return result;
};

const createGridMaterial = () => new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: {
    uMinorColor: { value: new THREE.Vector3(...THEMES.light.minor) },
    uMajorColor: { value: new THREE.Vector3(...THEMES.light.major) },
    uMinorOpacity: { value: THEMES.light.minorOpacity },
    uMajorOpacity: { value: THEMES.light.majorOpacity },
    uMinorStep: { value: 10 },
    uMajorStep: { value: 50 },
    uFadeStart: { value: 140 },
    uFadeEnd: { value: 420 },
  },
  vertexShader: /* glsl */`
    varying vec2 vPos;
    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vPos = world.xy;
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  fragmentShader: /* glsl */`
    uniform vec3 uMinorColor;
    uniform vec3 uMajorColor;
    uniform float uMinorOpacity;
    uniform float uMajorOpacity;
    uniform float uMinorStep;
    uniform float uMajorStep;
    uniform float uFadeStart;
    uniform float uFadeEnd;
    varying vec2 vPos;

    float gridLine(vec2 coord, float width) {
      vec2 derivative = fwidth(coord);
      vec2 grid = abs(fract(coord - 0.5) - 0.5) / derivative;
      return 1.0 - min(min(grid.x, grid.y) / width, 1.0);
    }

    void main() {
      vec2 minorCoord = vPos / uMinorStep;
      vec2 majorCoord = vPos / uMajorStep;
      vec2 lod = fwidth(minorCoord);
      float minorVisibility = 1.0 - smoothstep(0.18, 0.45, max(lod.x, lod.y));
      float minorAlpha = gridLine(minorCoord, 1.0) * uMinorOpacity * minorVisibility;
      float majorAlpha = gridLine(majorCoord, 1.25) * uMajorOpacity;
      float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, length(vPos));
      float alpha = max(minorAlpha, majorAlpha) * fade;
      if (alpha < 0.002) discard;
      gl_FragColor = vec4(majorAlpha >= minorAlpha ? uMajorColor : uMinorColor, alpha);
    }
  `,
});

/**
 * Owns the WebGL preview: renderer, camera, controls, lights, grid and the group that holds
 * the generated model. Rendering happens on demand (camera moves, model updates, resizes)
 * instead of a permanent 60 fps loop.
 */
export default class PreviewStage {
  constructor(container, { theme = 'light', onFrame = null, onViewModeChange = null } = {}) {
    this.container = container;
    this.onFrame = onFrame;
    this.onViewModeChange = onViewModeChange;
    this.viewMode = '3d';
    this.pointerMode = 'rotate';
    this.hasModel = false;
    this.bounds = null;
    this.raf = 0;
    this.tween = null;
    this.modelAnimation = null;
    this.interacting = false;
    this.userMovedCamera = false;
    this.framing = this.computeFraming(PLACEHOLDER_BOX);
    this.tmpVector = new THREE.Vector3();

    this.requestRender = this.requestRender.bind(this);
    this.frame = this.frame.bind(this);

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.className = 'preview-canvas';
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    // The generators build the tag rotated by 90°; this keeps width along X and height along Y.
    this.scene.rotation.z = -Math.PI / 2;

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.environmentMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();
    this.scene.environment = this.environmentMap;

    this.createLights();
    this.createGround();

    this.modelGroup = new THREE.Group();
    this.modelGroup.name = 'model';
    this.scene.add(this.modelGroup);

    this.camera = new THREE.PerspectiveCamera(FOV_3D, width / height, 1, 5000);
    // Z-up like a slicer: the tag lies flat on the build plate.
    this.camera.up.set(0, 0, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.14;
    this.controls.zoomToCursor = true;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 6000;
    this.controls.rotateSpeed = 0.85;
    this.controls.addEventListener('change', this.requestRender);
    this.controls.addEventListener('start', () => {
      this.interacting = true;
      this.userMovedCamera = true;
      this.tween = null;
      this.container.classList.add('is-dragging');
      this.requestRender();
    });
    this.controls.addEventListener('end', () => {
      this.interacting = false;
      this.container.classList.remove('is-dragging');
      this.requestRender();
    });

    this.setView(this.homeView());
    this.setTheme(theme);
    this.applyControlMapping();

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(container);
    }
    this.renderNow();
  }

  /* ------------------------------------------------------------------ */
  /* Scene setup                                                         */
  /* ------------------------------------------------------------------ */

  createLights() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xaeb7c4, 0.5);
    this.scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    // Same direction as before, but far enough away that the shadow camera sees the whole model
    // (a light 4 units from the origin clipped the parts of the tag that face it).
    keyLight.position.set(-3.2, -2.1, 2.2).multiplyScalar(100);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 1200;
    keyLight.shadow.camera.left = -180;
    keyLight.shadow.camera.right = 180;
    keyLight.shadow.camera.top = 180;
    keyLight.shadow.camera.bottom = -180;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.28);
    fillLight.position.set(1.7, 1.6, 1.1);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xdde4ef, 0.45);
    rimLight.position.set(1.3, -2.2, -1.3);
    this.scene.add(rimLight);

    const grazingLight = new THREE.DirectionalLight(0xfff7ef, 0.6);
    grazingLight.position.set(3.4, -3.2, 0.45);
    this.scene.add(grazingLight);

    this.lights = {
      hemisphere: hemisphereLight,
      key: keyLight,
      fill: fillLight,
      rim: rimLight,
      grazing: grazingLight,
    };
  }

  createGround() {
    this.shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(900, 900),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 }),
    );
    this.shadowPlane.position.z = -0.8;
    this.shadowPlane.receiveShadow = true;
    this.shadowPlane.renderOrder = 1;
    this.scene.add(this.shadowPlane);

    this.gridMaterial = createGridMaterial();
    this.grid = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), this.gridMaterial);
    this.grid.position.z = -0.85;
    this.grid.renderOrder = 0;
    this.scene.add(this.grid);
  }

  setTheme(theme) {
    const settings = THEMES[theme] || THEMES.light;
    const { uniforms } = this.gridMaterial;
    uniforms.uMinorColor.value.set(...settings.minor);
    uniforms.uMajorColor.value.set(...settings.major);
    uniforms.uMinorOpacity.value = settings.minorOpacity;
    uniforms.uMajorOpacity.value = settings.majorOpacity;
    this.shadowPlane.material.opacity = settings.shadowOpacity;
    this.requestRender();
  }

  /* ------------------------------------------------------------------ */
  /* Model handling                                                      */
  /* ------------------------------------------------------------------ */

  clearModel() {
    const children = [...this.modelGroup.children];
    children.forEach((child) => {
      this.modelGroup.remove(child);
      child.traverse((node) => {
        if (node.isMesh) {
          if (node.geometry) node.geometry.dispose();
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((material) => material && material.dispose());
        }
      });
    });
    this.hasModel = false;
    this.bounds = null;
    this.requestRender();
  }

  /**
   * Call after meshes were added to `modelGroup`.
   * @param {object} options
   * @param {boolean} options.fit frame the camera on the model
   * @param {boolean} options.animate play the drop-in animation
   */
  updateModel({ fit = false, animate = false } = {}) {
    this.modelGroup.position.set(0, 0, 0);
    this.modelGroup.scale.setScalar(1);
    this.modelAnimation = null;
    this.scene.updateMatrixWorld(true);

    const box = new THREE.Box3();
    const baseBox = new THREE.Box3();
    this.modelGroup.traverse((node) => {
      if (!node.isMesh) return;
      const nodeBox = new THREE.Box3().setFromObject(node);
      box.union(nodeBox);
      if (node.userData.role === 'base') {
        baseBox.union(nodeBox);
      }
    });

    this.hasModel = !box.isEmpty();
    if (!this.hasModel) {
      this.bounds = null;
      this.requestRender();
      return;
    }

    const previousRadius = this.framing.radius;
    this.bounds = { box, baseBox: baseBox.isEmpty() ? box.clone() : baseBox };
    this.framing = this.computeFraming(box, this.bounds.baseBox);

    const sizeChanged = Math.abs(this.framing.radius - previousRadius) / previousRadius > 0.15;
    if (fit) {
      this.userMovedCamera = false;
      this.animateTo(this.viewMode === '2d' ? this.topView() : this.homeView(), animate ? 900 : 0);
    } else if (sizeChanged && !this.userMovedCamera) {
      this.animateTo(this.viewMode === '2d' ? this.topView() : this.homeView(), 520);
    }

    if (animate) {
      this.modelAnimation = { start: performance.now(), duration: 620 };
    }
    this.requestRender();
  }

  getModelSize() {
    if (!this.bounds) return null;
    return this.bounds.box.getSize(new THREE.Vector3());
  }

  /* ------------------------------------------------------------------ */
  /* Camera views                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Points that should be visible when the camera frames the model:
   * the corners of the model bounds plus the dimension ruler in front of it.
   */
  computeFraming(box, baseBox = box) {
    const size = baseBox.getSize(new THREE.Vector3());
    const span = Math.max(size.x, size.y);
    const rulerDepth = Math.max(8, span * 0.09) + Math.max(5, span * 0.06) + 4;
    const framed = box.clone();
    framed.min.y = Math.min(framed.min.y, baseBox.min.y - rulerDepth);
    const points = [];
    [framed.min.x, framed.max.x].forEach((x) => {
      [framed.min.y, framed.max.y].forEach((y) => {
        [framed.min.z, framed.max.z].forEach((z) => points.push(new THREE.Vector3(x, y, z)));
      });
    });
    const sphere = framed.getBoundingSphere(new THREE.Sphere());
    return {
      center: framed.getCenter(new THREE.Vector3()),
      radius: Math.max(sphere.radius, 10),
      points,
    };
  }

  /** Positions a throwaway camera for the given view; used for framing calculations. */
  probeCamera(view, radius) {
    if (!this.probe) {
      this.probe = new THREE.PerspectiveCamera(view.fov, this.camera.aspect, 0.1, 100000);
      this.probe.up.set(0, 0, 1);
    }
    const camera = this.probe;
    camera.fov = view.fov;
    camera.aspect = this.camera.aspect;
    camera.updateProjectionMatrix();
    const cosElevation = Math.cos(view.elevation);
    camera.position.set(
      cosElevation * Math.sin(view.azimuth),
      -cosElevation * Math.cos(view.azimuth),
      Math.sin(view.elevation),
    ).multiplyScalar(radius).add(view.target);
    camera.lookAt(view.target);
    camera.updateMatrixWorld();
    return camera;
  }

  /** Screen-space (NDC) bounds of the framing points for a camera placement. */
  projectedBounds(view, radius) {
    const camera = this.probeCamera(view, radius);
    const projected = new THREE.Vector3();
    const bounds = {
      minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, behind: false,
    };
    this.framing.points.forEach((point) => {
      projected.copy(point).project(camera);
      if (projected.z >= 1) bounds.behind = true;
      bounds.minX = Math.min(bounds.minX, projected.x);
      bounds.maxX = Math.max(bounds.maxX, projected.x);
      bounds.minY = Math.min(bounds.minY, projected.y);
      bounds.maxY = Math.max(bounds.maxY, projected.y);
    });
    return bounds;
  }

  /** Smallest camera distance at which all framing points fit inside the given NDC limits. */
  fitRadius(view, limits) {
    const fits = (radius) => {
      const b = this.projectedBounds(view, radius);
      return !b.behind
        && Math.max(Math.abs(b.minX), Math.abs(b.maxX)) <= limits.x
        && Math.max(Math.abs(b.minY), Math.abs(b.maxY)) <= limits.y;
    };
    let low = 1;
    let high = 100000;
    for (let i = 0; i < 28; i += 1) {
      const middle = (low + high) / 2;
      if (fits(middle)) {
        high = middle;
      } else {
        low = middle;
      }
    }
    return high;
  }

  /**
   * Fits the framing points into the viewport. Perspective makes the 3D center project
   * off-center, so the target is nudged until the projected bounds are centered on screen.
   */
  framedView(view, limits) {
    const result = { target: this.framing.center.clone(), ...view };
    for (let i = 0; i < 3; i += 1) {
      result.radius = this.fitRadius(result, limits);
      const b = this.projectedBounds(result, result.radius);
      const centerX = (b.minX + b.maxX) / 2;
      const centerY = (b.minY + b.maxY) / 2;
      if (Math.abs(centerX) < 0.01 && Math.abs(centerY) < 0.01) {
        break;
      }
      const camera = this.probeCamera(result, result.radius);
      const halfHeight = result.radius * Math.tan(THREE.MathUtils.degToRad(result.fov) / 2);
      const halfWidth = halfHeight * camera.aspect;
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      result.target
        .addScaledVector(right, centerX * halfWidth)
        .addScaledVector(up, centerY * halfHeight);
    }
    result.radius = this.fitRadius(result, limits);
    return result;
  }

  homeView() {
    return this.framedView({ azimuth: DEFAULT_AZIMUTH, elevation: DEFAULT_ELEVATION, fov: FOV_3D }, FIT_LIMITS_3D);
  }

  topView() {
    return this.framedView({ azimuth: 0, elevation: TOP_ELEVATION, fov: FOV_2D }, FIT_LIMITS_2D);
  }

  faceView(face) {
    const views = {
      '+z': { azimuth: 0, elevation: TOP_ELEVATION },
      '-z': { azimuth: 0, elevation: -TOP_ELEVATION },
      '-y': { azimuth: 0, elevation: 0.0001 },
      '+y': { azimuth: Math.PI, elevation: 0.0001 },
      '+x': { azimuth: Math.PI / 2, elevation: 0.0001 },
      '-x': { azimuth: -Math.PI / 2, elevation: 0.0001 },
    };
    return this.framedView({ fov: FOV_3D, ...views[face] }, FIT_LIMITS_3D);
  }

  currentView() {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const radius = offset.length();
    return {
      target: this.controls.target.clone(),
      radius,
      azimuth: Math.atan2(offset.x, -offset.y),
      elevation: Math.asin(THREE.MathUtils.clamp(offset.z / radius, -1, 1)),
      fov: this.camera.fov,
    };
  }

  setView(view) {
    const cosElevation = Math.cos(view.elevation);
    const offset = new THREE.Vector3(
      cosElevation * Math.sin(view.azimuth),
      -cosElevation * Math.cos(view.azimuth),
      Math.sin(view.elevation),
    ).multiplyScalar(view.radius);
    this.controls.target.copy(view.target);
    this.camera.position.copy(view.target).add(offset);
    this.camera.fov = view.fov;
    this.updateClipPlanes(view.radius);
    this.camera.lookAt(view.target);
  }

  updateClipPlanes(radius = this.camera.position.distanceTo(this.controls.target)) {
    const near = Math.max(0.5, radius * 0.02);
    const far = Math.max(2000, radius * 25);
    if (Math.abs(this.camera.near - near) > 1e-3 || Math.abs(this.camera.far - far) > 1e-3) {
      this.camera.near = near;
      this.camera.far = far;
    }
    this.camera.updateProjectionMatrix();
  }

  stopControlsMomentum() {
    const { controls } = this;
    if (controls._sphericalDelta) controls._sphericalDelta.set(0, 0, 0);
    if (controls._panOffset) controls._panOffset.set(0, 0, 0);
    if (typeof controls._scale === 'number') controls._scale = 1;
  }

  animateTo(view, duration = 650) {
    this.stopControlsMomentum();
    if (!duration) {
      this.tween = null;
      this.setView(view);
      this.requestRender();
      return;
    }
    const from = this.currentView();
    const to = { ...view, azimuth: from.azimuth + wrapAngle(view.azimuth - from.azimuth) };
    this.tween = { from, to, start: performance.now(), duration };
    this.requestRender();
  }

  stepTween(now) {
    const { from, to, start, duration } = this.tween;
    const t = THREE.MathUtils.clamp((now - start) / duration, 0, 1);
    const e = easeInOutCubic(t);
    const fov = THREE.MathUtils.lerp(from.fov, to.fov, e);
    // Interpolate the framing size instead of the distance so FOV changes read as a dolly zoom.
    const fromSize = from.radius * Math.tan(THREE.MathUtils.degToRad(from.fov) / 2);
    const toSize = to.radius * Math.tan(THREE.MathUtils.degToRad(to.fov) / 2);
    const size = THREE.MathUtils.lerp(fromSize, toSize, e);
    this.setView({
      target: from.target.clone().lerp(to.target, e),
      radius: size / Math.tan(THREE.MathUtils.degToRad(fov) / 2),
      azimuth: THREE.MathUtils.lerp(from.azimuth, to.azimuth, e),
      elevation: THREE.MathUtils.lerp(from.elevation, to.elevation, e),
      fov,
    });
    if (t >= 1) {
      this.tween = null;
      return false;
    }
    return true;
  }

  setViewMode(mode, { animate = true } = {}) {
    if (mode !== '2d' && mode !== '3d') return;
    const changed = mode !== this.viewMode;
    this.viewMode = mode;
    this.applyControlMapping();
    this.userMovedCamera = false;
    this.animateTo(mode === '2d' ? this.topView() : this.homeView(), animate ? 700 : 0);
    if (changed && this.onViewModeChange) {
      this.onViewModeChange(mode);
    }
  }

  resetView() {
    this.userMovedCamera = false;
    this.animateTo(this.viewMode === '2d' ? this.topView() : this.homeView(), 600);
  }

  viewFrom(face) {
    if (this.viewMode === '2d') {
      this.viewMode = '3d';
      this.applyControlMapping();
      if (this.onViewModeChange) this.onViewModeChange('3d');
    }
    this.userMovedCamera = true;
    this.animateTo(this.faceView(face), 600);
  }

  setPointerMode(mode) {
    this.pointerMode = mode;
    this.applyControlMapping();
  }

  applyControlMapping() {
    const is2D = this.viewMode === '2d';
    const mode = is2D && this.pointerMode === 'rotate' ? 'pan' : this.pointerMode;
    const leftActions = { rotate: THREE.MOUSE.ROTATE, pan: THREE.MOUSE.PAN, zoom: THREE.MOUSE.DOLLY };
    this.controls.enableRotate = !is2D;
    this.controls.mouseButtons = {
      LEFT: leftActions[mode],
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: mode === 'pan' && !is2D ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
    };
    this.controls.touches = {
      ONE: mode === 'pan' || is2D ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    this.container.dataset.pointerMode = mode;
    this.container.dataset.viewMode = this.viewMode;
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */

  requestRender() {
    if (!this.raf && !this.disposed) {
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  frame(now) {
    this.raf = 0;
    let keepGoing = false;
    if (this.tween) {
      keepGoing = this.stepTween(now) || keepGoing;
    }
    if (this.modelAnimation) {
      keepGoing = this.stepModelAnimation(now) || keepGoing;
    }
    const changed = this.controls.update();
    if (changed || this.interacting) {
      keepGoing = true;
    }
    this.renderNow();
    if (keepGoing) {
      this.requestRender();
    }
  }

  stepModelAnimation(now) {
    const { start, duration } = this.modelAnimation;
    const t = THREE.MathUtils.clamp((now - start) / duration, 0, 1);
    const e = easeOutCubic(t);
    this.modelGroup.position.z = (1 - e) * 14;
    this.modelGroup.scale.setScalar(0.94 + 0.06 * e);
    if (t >= 1) {
      this.modelAnimation = null;
      this.modelGroup.position.z = 0;
      this.modelGroup.scale.setScalar(1);
      return false;
    }
    return true;
  }

  renderNow() {
    if (this.disposed) return;
    this.updateClipPlanes();
    this.renderer.render(this.scene, this.camera);
    if (this.onFrame) {
      this.onFrame({
        cube: this.cubeTransform(),
        ruler: this.rulerGeometry(),
      });
    }
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    const size = this.renderer.getSize(new THREE.Vector2());
    if (size.x === width && size.y === height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    // Render synchronously so resizing never shows an empty canvas.
    this.renderNow();
  }

  cubeTransform() {
    this.camera.updateMatrixWorld();
    const rotation = new THREE.Matrix4().extractRotation(this.camera.matrixWorldInverse);
    const flip = new THREE.Matrix4().makeScale(1, -1, 1);
    const css = new THREE.Matrix4().multiplyMatrices(flip, rotation).multiply(flip);
    return `matrix3d(${css.elements.map((value) => value.toFixed(6)).join(',')})`;
  }

  project(point, width, height) {
    const projected = this.tmpVector.copy(point).project(this.camera);
    return {
      x: ((projected.x + 1) / 2) * width,
      y: ((1 - projected.y) / 2) * height,
      visible: projected.z > -1 && projected.z < 1,
    };
  }

  /**
   * Screen-space geometry for the width dimension line along the edge closest to the camera.
   */
  rulerGeometry() {
    if (!this.hasModel || !this.bounds || this.modelAnimation) return null;
    const box = this.bounds.baseBox;
    const size = box.getSize(new THREE.Vector3());
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return null;

    const centerY = (box.min.y + box.max.y) / 2;
    const front = this.camera.position.y <= centerY;
    const direction = front ? -1 : 1;
    const edgeY = front ? box.min.y : box.max.y;
    const span = Math.max(size.x, size.y);
    const gap = Math.max(3, span * 0.035);
    const offset = Math.max(8, span * 0.09);
    const z = 0;

    const lineY = edgeY + direction * offset;
    const points = {
      extA0: new THREE.Vector3(box.min.x, edgeY + direction * gap, z),
      extA1: new THREE.Vector3(box.min.x, lineY + direction * gap, z),
      extB0: new THREE.Vector3(box.max.x, edgeY + direction * gap, z),
      extB1: new THREE.Vector3(box.max.x, lineY + direction * gap, z),
      start: new THREE.Vector3(box.min.x, lineY, z),
      end: new THREE.Vector3(box.max.x, lineY, z),
      label: new THREE.Vector3((box.min.x + box.max.x) / 2, lineY + direction * Math.max(5, span * 0.06), z),
    };

    const screen = {};
    let visible = true;
    Object.keys(points).forEach((key) => {
      screen[key] = this.project(points[key], width, height);
      visible = visible && screen[key].visible;
    });
    if (!visible) return null;

    const dx = screen.end.x - screen.start.x;
    const dy = screen.end.y - screen.start.y;
    const length = Math.hypot(dx, dy);
    if (length < 48) return null;

    let angle = THREE.MathUtils.radToDeg(Math.atan2(dy, dx));
    if (angle > 90) angle -= 180;
    if (angle < -90) angle += 180;

    return {
      ...screen,
      angle,
      value: size.x,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Image export                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Renders a transparent, top-down orthographic image of the model without disturbing the
   * interactive view. Resolves with a PNG blob.
   */
  renderPNG() {
    if (!this.hasModel || !this.bounds) {
      return Promise.reject(new Error('No model to render'));
    }
    const { box } = this.bounds;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const padding = 1.03;
    const halfWidth = (size.x * padding) / 2;
    const halfHeight = (size.y * padding) / 2;
    const aspect = halfWidth / halfHeight;
    const pixelWidth = aspect >= 1 ? PNG_MAX_SIDE : Math.round(PNG_MAX_SIDE * aspect);
    const pixelHeight = aspect >= 1 ? Math.round(PNG_MAX_SIDE / aspect) : PNG_MAX_SIDE;

    const camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 4000);
    camera.up.set(0, 1, 0);
    camera.position.set(center.x, center.y, box.max.z + 1000);
    camera.lookAt(center.x, center.y, center.z);

    const previousSize = this.renderer.getSize(new THREE.Vector2());
    const previousPixelRatio = this.renderer.getPixelRatio();
    const gridVisible = this.grid.visible;
    const shadowVisible = this.shadowPlane.visible;

    this.grid.visible = false;
    this.shadowPlane.visible = false;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(pixelWidth, pixelHeight, false);
    this.renderer.render(this.scene, camera);

    const output = document.createElement('canvas');
    output.width = pixelWidth;
    output.height = pixelHeight;
    // trimCanvas reads the pixels back, so ask for a CPU-backed context
    output.getContext('2d', { willReadFrequently: true }).drawImage(this.renderer.domElement, 0, 0);

    this.grid.visible = gridVisible;
    this.shadowPlane.visible = shadowVisible;
    this.renderer.setPixelRatio(previousPixelRatio);
    this.renderer.setSize(previousSize.x, previousSize.y, false);
    this.renderNow();

    return new Promise((resolve, reject) => {
      trimCanvas(output).toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))), 'image/png');
    });
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.controls.dispose();
    this.clearModel();
    this.grid.geometry.dispose();
    this.gridMaterial.dispose();
    this.shadowPlane.geometry.dispose();
    this.shadowPlane.material.dispose();
    this.environmentMap.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
