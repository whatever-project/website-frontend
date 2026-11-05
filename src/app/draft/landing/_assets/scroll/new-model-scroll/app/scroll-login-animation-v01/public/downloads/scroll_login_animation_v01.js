import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (edge0, edge1, value) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};
const easeInOut = (value) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

function seededRandom(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Reversible, geometry-based parchment animation.
 * Public API: playOpen(), playClose(), reverse(), setProgress(), setView().
 */
export class ScrollLoginAnimation {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.progress = 0;
    this.direction = 0;
    this.openDuration = 1650;
    this.closeDuration = 1350;
    this.state = "closed";
    this.settleTime = 0;
    this.lastFrame = 0;
    this.lastProgressReport = 0;
    this.formActive = false;
    this.disposed = false;
    this.captureMode = new URLSearchParams(window.location.search).has("capture");
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x25281f, 0.027);
    this.camera = new THREE.OrthographicCamera(-4, 4, 3.4, -3.4, 0.1, 100);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(0, 11, 0.35);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.setAttribute("aria-label", "Interactive three-dimensional parchment scroll");
    this.renderer.domElement.setAttribute("role", "img");
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;
    this.controls.minZoom = 0.8;
    this.controls.maxZoom = 1.45;
    this.controls.minPolarAngle = Math.PI * 0.24;
    this.controls.maxPolarAngle = Math.PI * 0.76;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.controls.addEventListener("change", () => {
      if (this.captureMode) this.renderFrame(0);
    });

    this.addLighting();
    this.addGround();
    this.addParticles();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.animate = this.animate.bind(this);
  }

  addLighting() {
    const hemisphere = new THREE.HemisphereLight(0xf5e9cb, 0x28332a, 2.1);
    this.scene.add(hemisphere);
    const key = new THREE.DirectionalLight(0xffe5b0, 3.2);
    key.position.set(-3.5, 6, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.bias = -0.0008;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9cad9c, 1.35);
    rim.position.set(5, -3, 2);
    this.scene.add(rim);
  }

  addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color: 0x252920, roughness: 1, metalness: 0 }),
    );
    ground.position.z = -3.12;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  addParticles() {
    const random = seededRandom(1701);
    const positions = new Float32Array(72 * 3);
    for (let index = 0; index < 72; index += 1) {
      positions[index * 3] = (random() - 0.5) * 8;
      positions[index * 3 + 1] = (random() - 0.5) * 3;
      positions[index * 3 + 2] = (random() - 0.5) * 7;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0xd8b968, size: 0.025, transparent: true, opacity: 0.2, depthWrite: false }),
    );
    this.scene.add(this.particles);
  }

  async init() {
    try {
      const gltf = await new GLTFLoader().loadAsync("/assets/scroll_login_animation_v01.glb");
      const source = gltf.scene.getObjectByProperty("isMesh", true);
      if (!source) throw new Error("The parchment mesh could not be found.");
      this.mesh = source.clone();
      this.mesh.geometry = source.geometry.clone();
      this.mesh.material = source.material.clone();
      this.mesh.material.side = THREE.DoubleSide;
      this.mesh.material.roughness = 0.88;
      this.mesh.material.metalness = 0;
      if (this.mesh.material.normalScale) this.mesh.material.normalScale.set(0.32, 0.32);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.mesh.frustumCulled = false;
      this.group = new THREE.Group();
      this.group.add(this.mesh);
      this.scene.add(this.group);
      this.prepareGeometry();
      this.applyDeformation(0);
      this.resize();
      this.renderFrame(0);
      window.__SCENE_READY__ = true;
      window.__seek = (value) => {
        this.setProgress(Number(value));
        this.controls.update();
        this.renderFrame(0);
      };
      window.scrollLoginAnimation = this;
      this.options.onReady?.();
      if (!this.captureMode) {
        this.lastFrame = performance.now();
        this.frameRequest = requestAnimationFrame(this.animate);
      }
      return this;
    } catch (error) {
      this.options.onError?.(error);
      throw error;
    }
  }

  prepareGeometry() {
    const position = this.mesh.geometry.attributes.position;
    const normal = this.mesh.geometry.attributes.normal;
    const sourcePositions = new Float32Array(position.array);
    const sourceNormals = new Float32Array(normal.array);
    const count = position.count;
    const halfThickness = 0.011;
    let minimum = Infinity;
    let maximum = -Infinity;
    const centerZ = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      centerZ[index] = sourcePositions[offset + 2] - sourceNormals[offset + 2] * halfThickness;
      minimum = Math.min(minimum, centerZ[index]);
      maximum = Math.max(maximum, centerZ[index]);
    }
    const length = maximum - minimum;
    const paperT = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      paperT[index] = clamp01((centerZ[index] - minimum) / length);
    }
    this.deformation = { sourcePositions, sourceNormals, centerZ, paperT, minimum, maximum, length, halfThickness };
  }

  applyDeformation(rawProgress) {
    if (!this.mesh || !this.deformation) return;
    const progress = easeInOut(clamp01(rawProgress));
    const { sourcePositions, sourceNormals, centerZ, paperT, minimum, maximum, length, halfThickness } = this.deformation;
    const positions = this.mesh.geometry.attributes.position;
    const normals = this.mesh.geometry.attributes.normal;
    const top = maximum - 0.08;
    const openBlend = smoothstep(0.86, 1, progress);
    const baseRadius = 0.105;
    const pitch = 0.023;
    const radialGrowth = pitch / (Math.PI * 2);

    for (let index = 0; index < positions.count; index += 1) {
      const offset = index * 3;
      const ox = sourcePositions[offset];
      const oy = sourcePositions[offset + 1];
      const oz = sourcePositions[offset + 2];
      const onx = sourceNormals[offset];
      const ony = sourceNormals[offset + 1];
      const onz = sourceNormals[offset + 2];
      const t = paperT[index];
      let x = ox;
      let y;
      let z;
      let nx = onx;
      let ny = ony;
      let nz = onz;

      if (t <= progress) {
        const originalCenterY = oy - ony * halfThickness;
        const originalFlatZ = minimum + t * length;
        const curl = 1 - smoothstep(0.1, 0.23, t);
        const flatZ = top - (progress - t) * length;
        y = originalCenterY * curl + ony * halfThickness;
        z = flatZ + (centerZ[index] - originalFlatZ) * curl + onz * halfThickness;
      } else {
        const rolledLength = (t - progress) * length;
        const theta = (Math.sqrt(baseRadius * baseRadius + 2 * radialGrowth * rolledLength) - baseRadius) / radialGrowth;
        const radius = baseRadius + radialGrowth * theta;
        const cosine = Math.cos(theta);
        const sine = Math.sin(theta);
        y = radius * cosine - baseRadius + ony * halfThickness * cosine - onz * halfThickness * sine;
        z = top + radius * sine + ony * halfThickness * sine + onz * halfThickness * cosine;
        ny = ony * cosine - onz * sine;
        nz = ony * sine + onz * cosine;
      }

      if (openBlend > 0) {
        x = THREE.MathUtils.lerp(x, ox, openBlend);
        y = THREE.MathUtils.lerp(y, oy, openBlend);
        z = THREE.MathUtils.lerp(z, oz, openBlend);
        nx = THREE.MathUtils.lerp(nx, onx, openBlend);
        ny = THREE.MathUtils.lerp(ny, ony, openBlend);
        nz = THREE.MathUtils.lerp(nz, onz, openBlend);
      }
      positions.setXYZ(index, x, y, z);
      normals.setXYZ(index, nx, ny, nz);
    }
    positions.needsUpdate = true;
    normals.needsUpdate = true;
    this.renderer.shadowMap.needsUpdate = true;
    this.group.position.z = -(1 - progress) * (maximum - 0.08);
    this.mesh.visible = rawProgress > 0.001 || this.direction !== 0;
  }

  animate(now) {
    if (this.disposed) return;
    const delta = Math.min(0.2, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    if (this.direction !== 0) {
      const duration = this.direction > 0 ? this.openDuration : this.closeDuration;
      this.progress = clamp01(this.progress + (this.direction * delta * 1000) / duration);
      this.applyDeformation(this.progress);
      if ((this.progress === 1 && this.direction > 0) || (this.progress === 0 && this.direction < 0)) {
        const completedDirection = this.direction;
        this.direction = 0;
        this.settleTime = 0;
        this.setState(completedDirection > 0 ? "open" : "closed");
        if (completedDirection < 0) this.mesh.visible = false;
      }
    }
    if (this.state === "open" && this.direction === 0) this.settleTime += delta;
    this.updateSettling();
    this.updateFormState();
    this.controls.update();
    this.particles.rotation.z += delta * 0.018;
    this.particles.material.opacity = 0.16 + (this.direction !== 0 ? 0.3 : 0);
    this.renderFrame(delta);
    if (now - this.lastProgressReport > 50 || this.direction === 0) {
      this.options.onProgress?.(this.progress, this.state);
      this.lastProgressReport = now;
    }
    this.frameRequest = requestAnimationFrame(this.animate);
  }

  updateSettling() {
    if (!this.group) return;
    if (this.state === "open" && this.settleTime < 0.85 && !this.reducedMotion) {
      const decay = 1 - this.settleTime / 0.85;
      this.group.rotation.x = Math.sin(this.settleTime * 18) * 0.025 * decay;
      this.group.position.z += -Math.abs(Math.sin(this.settleTime * 13)) * 0.035 * decay;
    } else {
      this.group.rotation.x = 0;
    }
  }

  updateFormState() {
    const active = this.progress === 1 && this.direction === 0 && (this.reducedMotion || this.settleTime > 0.28);
    if (active !== this.formActive) {
      this.formActive = active;
      this.options.onFormState?.(active);
    }
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  playOpen() {
    if (!this.mesh) return;
    this.mesh.visible = true;
    this.direction = 1;
    this.settleTime = 0;
    this.setState("opening");
    this.options.onFormState?.(false);
    this.formActive = false;
    if (this.captureMode) {
      this.progress = 1;
      this.direction = 0;
      this.applyDeformation(1);
      this.setState("open");
      this.renderFrame(0);
    }
  }

  playClose() {
    if (!this.mesh) return;
    this.direction = -1;
    this.settleTime = 0;
    this.setState("closing");
    this.options.onFormState?.(false);
    this.formActive = false;
    if (this.captureMode) {
      this.progress = 0;
      this.direction = 0;
      this.applyDeformation(0);
      this.mesh.visible = false;
      this.setState("closed");
      this.renderFrame(0);
    }
  }

  reverse() {
    if (this.direction > 0 || this.state === "open") this.playClose();
    else this.playOpen();
  }

  setProgress(value) {
    if (!this.mesh) return;
    this.progress = clamp01(Number.isFinite(value) ? value : 0);
    this.direction = 0;
    this.settleTime = this.progress === 1 ? 1 : 0;
    this.mesh.visible = this.progress > 0.001;
    this.setState(this.progress === 0 ? "closed" : this.progress === 1 ? "open" : "scrubbing");
    this.applyDeformation(this.progress);
    this.updateFormState();
    this.options.onProgress?.(this.progress, this.state);
    if (this.captureMode) this.renderFrame(0);
  }

  setTiming(openDuration, closeDuration = this.closeDuration) {
    this.openDuration = openDuration;
    this.closeDuration = closeDuration;
  }

  setView(view) {
    const views = {
      front: [0, 11, 0.35],
      perspective: [6.8, 10, 3.6],
      side: [8.5, 5.5, 0.7],
    };
    const selected = views[view] || views.front;
    this.camera.position.set(...selected);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    if (this.captureMode) this.renderFrame(0);
  }

  setState(state) {
    if (this.state === state) return;
    this.state = state;
    this.options.onStateChange?.(state);
  }

  resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    const aspect = width / height;
    const viewHeight = Math.max(6.7, 5.25 / aspect);
    this.camera.left = (-viewHeight * aspect) / 2;
    this.camera.right = (viewHeight * aspect) / 2;
    this.camera.top = viewHeight / 2;
    this.camera.bottom = -viewHeight / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (this.captureMode) this.renderFrame(0);
  }

  getMetrics() {
    return {
      triangles: this.renderer.info.render.triangles,
      drawCalls: this.renderer.info.render.calls,
      progress: this.progress,
      state: this.state,
    };
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameRequest);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.scene.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
    delete window.scrollLoginAnimation;
  }
}
