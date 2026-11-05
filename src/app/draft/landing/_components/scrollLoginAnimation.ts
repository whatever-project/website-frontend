// Parchment login sheet driven by the baked animation inside `Parchment_Rolling_Animation_v03.glb`.
//
// The GLB holds one mesh with 40 "Roll pose" morph targets and a single 6 s clip
// (closed -> open -> hold -> closed). All target weights are 0 while fully open, i.e. the base mesh is the
// open sheet. This engine never touches geometry, UVs, textures or keyframes: it only picks which part of
// the clip to evaluate (the opening segment, played forwards to open and backwards to close) and lights it.
import * as THREE from "three"
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

export type ScrollState = "closed" | "opening" | "open" | "closing" | "scrubbing"

export interface SheetLayout {
  /** On-screen size of the flat parchment (excluding the rolled ends), in CSS px. */
  width: number
  height: number
}

export interface ScrollMountHandlers {
  onStateChange?: (state: ScrollState) => void
  onFormState?: (active: boolean) => void
  /** True from ~68% of the unroll until the close starts. */
  onQuillState?: (visible: boolean) => void
  onLayout?: (layout: SheetLayout) => void
}

// Sheet footprint in model units (from the GLB's POSITION accessor bounds; x: -2.14..2.14, y: -2.73..2.56).
const SHEET_WIDTH = 4.28
const SHEET_HEIGHT = 5.29
const SHEET_CENTER_Y = -0.085
const CAMERA_ELEVATION_DEG = 10
// On-screen height of the flat sheet: a fraction of the container height (0.49 -> ~455 px on a 928 px viewport),
// but never so small that the login form no longer fits, and never taller than the container.
const SHEET_VIEWPORT_FRACTION = 0.49
const MIN_SHEET_PX = 445
const MAX_SHEET_FRACTION = 0.92
// The form fades in during the last part of the unroll instead of waiting for it to finish.
const FORM_REVEAL_PROGRESS = 0.9
// The decorative quill starts entering once the sheet is this far open.
const QUILL_REVEAL_PROGRESS = 0.68
// The clip's opening segment is 2.2 s long; it is played at ~2.75x forwards and ~3.4x backwards.
const OPEN_DURATION_MS = 800
const CLOSE_DURATION_MS = 650
const EPSILON = 1e-3

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

// One parsed GLB per URL for the whole page: `prepareScrollEngine` fills it while the landing page is idle.
const modelCache = new Map<string, Promise<GLTF>>()

// The request can be cancelled by the browser while the WebGL context is still starting up
// (seen as "Failed to fetch"), so retry before giving up.
async function fetchModel(url: string) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await new GLTFLoader().loadAsync(url)
    } catch (error) {
      if (attempt >= 2) throw error
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
    }
  }
}

export function loadScrollModel(url: string): Promise<GLTF> {
  let pending = modelCache.get(url)
  if (!pending) {
    pending = fetchModel(url)
    pending.catch(() => modelCache.delete(url)) // allow a later retry
    modelCache.set(url, pending)
  }
  return pending
}

/**
 * Reversible parchment animation: playOpen(), playClose(), setProgress().
 *
 * The engine is created and warmed up ahead of time (see prepareScrollEngine) with its canvas detached from the
 * page. mount() only attaches that canvas to the popup and unmount() takes it away again, so opening the popup
 * does no renderer/shader/GPU-upload work.
 */
export class ScrollLoginAnimation {
  progress = 0
  state: ScrollState = "closed"

  private direction = 0
  private lastFrame = 0
  private formActive = false
  private quillVisible = false
  private disposed = false
  private dirty = true
  private frameRequest = 0
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 60)
  private readonly renderer: THREE.WebGLRenderer
  private resizeObserver?: ResizeObserver
  private container?: HTMLElement
  private handlers: ScrollMountHandlers = {}
  private mounted = false
  private readonly keyLight = new THREE.SpotLight(0xfff0dc, 4.2)
  private environment?: THREE.Texture
  private model?: THREE.Object3D
  private mixer?: THREE.AnimationMixer
  private action?: THREE.AnimationAction
  private segmentStart = 0
  private segmentEnd = 0
  private viewHeight = SHEET_HEIGHT / SHEET_VIEWPORT_FRACTION

  constructor(private readonly glbUrl: string) {
    // Slightly elevated view so the top curl and the bottom roll read as curved paper, not flat bands.
    const elevation = THREE.MathUtils.degToRad(CAMERA_ELEVATION_DEG)
    this.camera.position.set(0, SHEET_CENTER_Y + 10 * Math.sin(elevation), 10 * Math.cos(elevation))
    this.camera.lookAt(0, SHEET_CENTER_Y, 0)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    // Khronos "neutral" tone mapping keeps the approved base-colour texture close to its source hues.
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.domElement.setAttribute("aria-hidden", "true")
    this.renderer.domElement.addEventListener("webglcontextlost", () => {
      // The browser reclaimed the context while idle: forget this engine so the next open builds a fresh one.
      if (preparedEngine?.engine === this) preparedEngine = undefined
    })

    this.addLighting()
    this.addShadowCatcher()
    this.resize()
  }

  private addLighting() {
    // Subtle soft image-based light: gentle fill and delicate highlights on the curved paper.
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    this.environment = pmrem.fromScene(room, 0.04).texture
    room.dispose()
    pmrem.dispose()
    this.scene.environment = this.environment
    this.scene.environmentIntensity = 0.22

    // Faint neutral-warm sky / dim ground ambient so shadowed areas never go black.
    this.scene.add(new THREE.HemisphereLight(0xfff6ea, 0x3d3a34, 0.32))

    // Soft warm key from the upper-left, in front of the sheet. A wide, fully feathered cone makes the light
    // fall off gently from the upper-left towards the lower-right corner, so the flat sheet is not evenly lit,
    // and its shadow gives the depth under the top curl and around the bottom roll.
    const key = this.keyLight
    key.position.set(-5.2, 5.6, 6.4)
    key.target.position.set(0.4, -0.4, 0)
    key.angle = 0.62
    key.penumbra = 1
    key.decay = 0
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 4
    key.shadow.camera.far = 22
    key.shadow.bias = -0.00025
    key.shadow.normalBias = 0.012
    key.shadow.radius = 5
    this.scene.add(key, key.target)

    // Gentle neutral fill from the lower right keeps the shaded side readable without flattening it.
    const fill = new THREE.DirectionalLight(0xf2eee8, 0.35)
    fill.position.set(5, -3, 5)
    this.scene.add(fill)
  }

  // Transparent plane: only the sheet's soft shadow lands on the dimmed village behind it.
  private addShadowCatcher() {
    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ color: 0x10130d, opacity: 0.24, transparent: true }),
    )
    shadowCatcher.position.z = -0.62
    shadowCatcher.receiveShadow = true
    this.scene.add(shadowCatcher)
  }

  /** Loads the (cached) GLB, uploads it to the GPU and renders the rolled pose once. */
  async init() {
    {
      const gltf = await loadScrollModel(this.glbUrl)
      if (this.disposed) return this
      const clip = gltf.animations[0]
      if (!clip) throw new Error("The parchment animation clip could not be found.")
      this.findOpeningSegment(clip)

      const model = gltf.scene
      model.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false // morph targets move the geometry beyond its bind-pose bounds
        const material = mesh.material as THREE.MeshStandardMaterial
        // Material response only (textures stay as authored): matte paper, no metal.
        material.metalness = 0
        material.roughness = 0.94
        material.envMapIntensity = 1
      })
      this.model = model
      this.scene.add(model)

      this.mixer = new THREE.AnimationMixer(model)
      this.action = this.mixer.clipAction(clip)
      this.action.play()
      this.action.paused = true
      this.resize()
      // Warm-up: render the rolled pose once (uploads the morph targets/textures and compiles the shaders) while
      // the canvas is still empty to the user, so the first visible frame of the opening has no hitch.
      this.direction = 1
      this.applyProgress(0)
      this.render()
      this.direction = 0
      this.applyProgress(0)
      this.render()
      return this
    }
  }

  /** Attaches the canvas to `container` in the rolled state; call playOpen() right after. */
  mount(container: HTMLElement, handlers: ScrollMountHandlers) {
    if (this.mounted) this.unmount()
    this.mounted = true
    this.container = container
    this.handlers = handlers
    this.progress = 0
    this.direction = 0
    this.state = "closed"
    this.formActive = false
    this.quillVisible = false
    container.dataset.scrollState = "closed"
    this.applyProgress(0)
    container.appendChild(this.renderer.domElement)
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)
    this.resize()
    this.render()
    this.lastFrame = performance.now()
    this.frameRequest = requestAnimationFrame(this.animate)
  }

  /** Detaches the canvas and stops the loop; the engine stays warm for the next open. */
  unmount() {
    if (!this.mounted) return
    this.mounted = false
    cancelAnimationFrame(this.frameRequest)
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.renderer.domElement.remove()
    this.container = undefined
    this.handlers = {}
    this.direction = 0
    this.progress = 0
    this.state = "closed"
    this.applyProgress(0)
  }

  /**
   * Finds the opening part of the clip from its morph-weight data: it starts at the last key that is still the
   * fully rolled pose (target 0 = 1) and ends at the first key where every weight is 0 (= the open base mesh).
   */
  private findOpeningSegment(clip: THREE.AnimationClip) {
    const track = clip.tracks.find((candidate) => candidate.name.endsWith("morphTargetInfluences"))
    if (!track) throw new Error("The parchment clip has no morph-weight track.")
    const times = track.times
    const values = track.values
    const targets = values.length / times.length
    const isOpen = (key: number) => {
      for (let target = 0; target < targets; target += 1) if (Math.abs(values[key * targets + target]) > EPSILON) return false
      return true
    }
    let end = -1
    for (let key = 0; key < times.length; key += 1) {
      if (isOpen(key)) {
        end = key
        break
      }
    }
    if (end <= 0) throw new Error("The parchment clip has no fully open pose.")
    let start = 0
    for (let key = end - 1; key >= 0; key -= 1) {
      if (values[key * targets] < 1 - EPSILON) continue
      start = key
      break
    }
    this.segmentStart = times[start]
    this.segmentEnd = times[end]
  }

  /** Evaluates the clip at the given 0..1 point of the opening segment (0 = rolled, 1 = fully open). */
  private applyProgress(value: number) {
    if (!this.mixer || !this.action || !this.model) return
    const time = this.segmentStart + clamp01(value) * (this.segmentEnd - this.segmentStart)
    this.action.time = time
    this.mixer.update(0)
    this.model.visible = value > EPSILON || this.direction !== 0
    this.dirty = true
  }

  private animate = (now: number) => {
    if (this.disposed || !this.mounted) return
    const delta = Math.min(0.2, (now - this.lastFrame) / 1000)
    this.lastFrame = now
    if (this.direction !== 0) {
      const duration = this.direction > 0 ? OPEN_DURATION_MS : CLOSE_DURATION_MS
      this.progress = clamp01(this.progress + (this.direction * delta * 1000) / duration)
      this.applyProgress(this.progress)
      if ((this.progress === 1 && this.direction > 0) || (this.progress === 0 && this.direction < 0)) {
        const completedDirection = this.direction
        this.direction = 0
        this.setState(completedDirection > 0 ? "open" : "closed")
        if (completedDirection < 0 && this.model) this.model.visible = false
      }
    }
    this.updateFormState()
    if (this.dirty) this.render()
    this.frameRequest = requestAnimationFrame(this.animate)
  }

  private render() {
    this.dirty = false
    // The shadow map only needs refreshing while the pose changes (it is rendered once per dirty frame).
    this.renderer.render(this.scene, this.camera)
  }

  private updateFormState() {
    const active = this.direction >= 0 && this.progress >= FORM_REVEAL_PROGRESS
    if (active !== this.formActive) {
      this.formActive = active
      this.handlers.onFormState?.(active)
    }
    const quill = this.direction >= 0 && this.progress >= QUILL_REVEAL_PROGRESS
    if (quill !== this.quillVisible) {
      this.quillVisible = quill
      this.handlers.onQuillState?.(quill)
    }
  }

  playOpen() {
    if (!this.model) return
    this.model.visible = true
    this.direction = 1
    this.setState("opening")
  }

  playClose() {
    if (!this.model) return
    this.direction = -1
    this.setState("closing")
    this.updateFormState()
  }

  setProgress(value: number) {
    if (!this.model) return
    this.progress = clamp01(Number.isFinite(value) ? value : 0)
    this.direction = 0
    this.setState(this.progress === 0 ? "closed" : this.progress === 1 ? "open" : "scrubbing")
    this.applyProgress(this.progress)
    this.updateFormState()
  }

  private setState(state: ScrollState) {
    if (this.state === state) return
    this.state = state
    if (this.container) this.container.dataset.scrollState = state // observable by tests/devtools
    this.handlers.onStateChange?.(state)
  }

  private resize() {
    const width = Math.max(1, this.container?.clientWidth ?? window.innerWidth)
    const height = Math.max(1, this.container?.clientHeight ?? window.innerHeight)
    const aspect = width / height
    // Choose the world height shown by the canvas so that the sheet ends up SHEET_PX tall on screen.
    const sheetPx = Math.min(Math.max(height * SHEET_VIEWPORT_FRACTION, MIN_SHEET_PX), height * MAX_SHEET_FRACTION)
    this.viewHeight = (SHEET_HEIGHT * height) / sheetPx
    this.camera.left = (-this.viewHeight * aspect) / 2
    this.camera.right = (this.viewHeight * aspect) / 2
    this.camera.top = this.viewHeight / 2
    this.camera.bottom = -this.viewHeight / 2
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.dirty = true

    const pixelsPerUnit = height / this.viewHeight
    this.handlers.onLayout?.({
      width: SHEET_WIDTH * pixelsPerUnit,
      height: SHEET_HEIGHT * pixelsPerUnit,
    })
  }

  private disposeObject(root: THREE.Object3D) {
    root.traverse((object) => {
      const mesh = object as THREE.Mesh
      mesh.geometry?.dispose()
      const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
      for (const material of materials) {
        const standard = material as THREE.MeshStandardMaterial
        standard.map?.dispose()
        standard.normalMap?.dispose()
        material.dispose()
      }
    })
  }

  dispose() {
    this.disposed = true
    this.unmount()
    this.mixer?.stopAllAction()
    if (this.model) this.mixer?.uncacheRoot(this.model)
    // The parsed model is shared through the module cache (see loadScrollModel), so it is detached rather than
    // disposed; the next engine re-uploads it to its own WebGL context.
    if (this.model) this.scene.remove(this.model)
    this.disposeObject(this.scene)
    this.keyLight.shadow.map?.dispose()
    this.environment?.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.domElement.remove()
  }
}

// One warm engine for the whole landing page.
let preparedEngine: { url: string; engine: ScrollLoginAnimation; ready: Promise<ScrollLoginAnimation> } | undefined

/** Builds the renderer, parses the GLB and warms up the GPU. Idempotent; resolves to the shared engine. */
export function prepareScrollEngine(url: string): Promise<ScrollLoginAnimation> {
  if (preparedEngine?.url === url) return preparedEngine.ready
  const engine = new ScrollLoginAnimation(url)
  const ready = engine.init().then(() => engine)
  const entry = { url, engine, ready }
  preparedEngine = entry
  ready.catch(() => {
    engine.dispose()
    if (preparedEngine === entry) preparedEngine = undefined
  })
  return ready
}

export function disposeScrollEngine() {
  const entry = preparedEngine
  preparedEngine = undefined
  entry?.engine.dispose()
}
