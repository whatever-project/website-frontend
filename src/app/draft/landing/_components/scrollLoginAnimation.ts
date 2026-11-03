// Typed port of the Kimi demo `scroll_login_animation_v03.js` (Kimi_Agent_Fantasy Parchment Scroll Demo).
// Differences from the demo: GLB url is passed in, no window globals / capture mode / orbit drag,
// the camera fits the container height (so the sheet stays tall on phones), and there is no opaque
// ground plane (only a transparent shadow catcher) so the village shows through around the sheet.
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"

export type ScrollState = "closed" | "opening" | "open" | "closing" | "scrubbing"

export interface ScrollAnimationOptions {
  glbUrl: string
  onReady?: () => void
  onError?: (error: unknown) => void
  onStateChange?: (state: ScrollState) => void
  onFormState?: (active: boolean) => void
}

interface Deformation {
  sourcePositions: Float32Array
  sourceNormals: Float32Array
  centerZ: Float32Array
  paperT: Float32Array
  minimum: number
  maximum: number
  length: number
  halfThickness: number
}

type ParchmentMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>

const VIEW_HEIGHT = 6.7

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0))
  return x * x * (3 - 2 * x)
}
const easeInOut = (value: number) => (value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2)

function seededRandom(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

/** Reversible, geometry-based parchment animation: playOpen(), playClose(), setProgress(). */
export class ScrollLoginAnimation {
  progress = 0
  state: ScrollState = "closed"

  private direction = 0
  private openDuration = 1650
  private closeDuration = 1350
  private settleTime = 0
  private lastFrame = 0
  private formActive = false
  private disposed = false
  private frameRequest = 0
  private readonly reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera(-4, 4, VIEW_HEIGHT / 2, -VIEW_HEIGHT / 2, 0.1, 100)
  private readonly renderer: THREE.WebGLRenderer
  private readonly composer: EffectComposer
  private readonly aoPass: SSAOPass
  private readonly resizeObserver: ResizeObserver
  private particles!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
  private mesh?: ParchmentMesh
  private group?: THREE.Group
  private deformation?: Deformation

  constructor(
    private readonly container: HTMLElement,
    private readonly options: ScrollAnimationOptions,
  ) {
    this.scene.fog = new THREE.FogExp2(0x25281f, 0.027)
    this.camera.up.set(0, 0, 1)
    // Demo's "elevated" 5° view.
    this.camera.position.set(0, 11, 0.35 + 11 * Math.tan(THREE.MathUtils.degToRad(5)))
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.04
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.shadowMap.autoUpdate = false
    this.renderer.shadowMap.needsUpdate = true
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.domElement.setAttribute("aria-hidden", "true")
    this.container.appendChild(this.renderer.domElement)

    this.addLighting()
    this.addShadowCatcher()
    this.addParticles()

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.aoPass = new SSAOPass(this.scene, this.camera, 1, 1, 16)
    this.aoPass.kernelRadius = 0.32
    this.aoPass.minDistance = 0.0015
    this.aoPass.maxDistance = 0.045
    this.composer.addPass(this.aoPass)
    this.composer.addPass(new OutputPass())

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(this.container)
    this.resize()
  }

  private addLighting() {
    // Low, warm ambient fill retains the ivory texture without flattening curvature.
    this.scene.add(new THREE.HemisphereLight(0xf6ecd7, 0x30372d, 0.82))

    // Soft upper-left key, slightly in front of the paper in the Z-up scene.
    const key = new THREE.DirectionalLight(0xffecd0, 3.35)
    key.position.set(-4.2, 4.8, 7.2)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -3.6
    key.shadow.camera.right = 3.6
    key.shadow.camera.top = 3.8
    key.shadow.camera.bottom = -3.8
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 22
    key.shadow.bias = -0.00012
    key.shadow.normalBias = 0.006
    key.shadow.radius = 3.5
    this.scene.add(key)

    // Restrained neutral rim separates the rolled edge without frontal fill.
    const rim = new THREE.DirectionalLight(0xc5cec3, 0.48)
    rim.position.set(4.5, -2.5, 3.5)
    this.scene.add(rim)
  }

  private addShadowCatcher() {
    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ color: 0x151910, opacity: 0.26, transparent: true }),
    )
    shadowCatcher.position.z = -3.115
    shadowCatcher.receiveShadow = true
    this.scene.add(shadowCatcher)
  }

  private addParticles() {
    const random = seededRandom(1701)
    const positions = new Float32Array(72 * 3)
    for (let index = 0; index < 72; index += 1) {
      positions[index * 3] = (random() - 0.5) * 8
      positions[index * 3 + 1] = (random() - 0.5) * 3
      positions[index * 3 + 2] = (random() - 0.5) * 7
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    this.particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0xd8b968, size: 0.025, transparent: true, opacity: 0.2, depthWrite: false }),
    )
    this.scene.add(this.particles)
  }

  // The request can be cancelled by the browser while the WebGL context is still starting up
  // (seen as "Failed to fetch" right after the renderer is created), so retry before giving up.
  private async loadModel() {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await new GLTFLoader().loadAsync(this.options.glbUrl)
      } catch (error) {
        if (attempt >= 2 || this.disposed) throw error
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
      }
    }
  }

  async init() {
    try {
      const gltf = await this.loadModel()
      if (this.disposed) return this
      const source = gltf.scene.getObjectByProperty("isMesh", true) as ParchmentMesh | undefined
      if (!source) throw new Error("The parchment mesh could not be found.")
      const mesh = source.clone()
      mesh.geometry = source.geometry.clone()
      mesh.material = (source.material as THREE.MeshStandardMaterial).clone()
      mesh.material.side = THREE.DoubleSide
      mesh.material.roughness = 0.96
      mesh.material.metalness = 0
      mesh.material.vertexColors = true
      mesh.material.normalScale?.set(0.42, 0.42)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.frustumCulled = false
      this.mesh = mesh
      this.group = new THREE.Group()
      this.group.add(mesh)
      this.scene.add(this.group)
      this.prepareGeometry(mesh)
      this.applyDeformation(0)
      this.resize()
      this.composer.render()
      this.options.onReady?.()
      this.lastFrame = performance.now()
      this.frameRequest = requestAnimationFrame(this.animate)
      return this
    } catch (error) {
      this.options.onError?.(error)
      throw error
    }
  }

  private prepareGeometry(mesh: ParchmentMesh) {
    const position = mesh.geometry.attributes.position as THREE.BufferAttribute
    const normal = mesh.geometry.attributes.normal as THREE.BufferAttribute
    const sourcePositions = new Float32Array(position.array)
    const sourceNormals = new Float32Array(normal.array)
    const count = position.count
    const halfThickness = 0.011
    let minimum = Infinity
    let maximum = -Infinity
    const centerZ = new Float32Array(count)
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3
      centerZ[index] = sourcePositions[offset + 2] - sourceNormals[offset + 2] * halfThickness
      minimum = Math.min(minimum, centerZ[index])
      maximum = Math.max(maximum, centerZ[index])
    }
    const length = maximum - minimum
    // Rotate only the parchment 180° in its own X/Z plane so the prominent roll rests at the
    // bottom and feeds upward, while the deformation stays in local space.
    mesh.rotation.y = Math.PI
    mesh.position.z = minimum + maximum
    const paperT = new Float32Array(count)
    const occlusion = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const t = clamp01((centerZ[index] - minimum) / length)
      paperT[index] = t

      // Restrained, texture-preserving AO: a soft contact band immediately above the bottom roll,
      // plus gentle darkening inside curved paper.
      const normalY = Math.abs(sourceNormals[index * 3 + 1])
      const curvature = smoothstep(0.12, 0.72, 1 - normalY)
      const lowerContact = Math.exp(-Math.pow((t - 0.805) / 0.052, 2)) * 0.18
      const lowerCurl = smoothstep(0.82, 0.97, t) * 0.08
      const lowerHighlight = Math.exp(-Math.pow((t - 0.885) / 0.035, 2)) * 0.07
      const upperCurl = (1 - smoothstep(0.02, 0.13, t)) * 0.04
      const shade = 1 - Math.min(0.32, curvature * 0.18 + lowerContact + lowerCurl + upperCurl) + lowerHighlight
      occlusion[index * 3] = shade
      occlusion[index * 3 + 1] = shade
      occlusion[index * 3 + 2] = shade
    }
    mesh.geometry.setAttribute("color", new THREE.BufferAttribute(occlusion, 3))
    this.deformation = { sourcePositions, sourceNormals, centerZ, paperT, minimum, maximum, length, halfThickness }
  }

  private applyDeformation(rawProgress: number) {
    const mesh = this.mesh
    const group = this.group
    const deformation = this.deformation
    if (!mesh || !group || !deformation) return
    const progress = easeInOut(clamp01(rawProgress))
    const { sourcePositions, sourceNormals, centerZ, paperT, minimum, maximum, length, halfThickness } = deformation
    const positions = mesh.geometry.attributes.position as THREE.BufferAttribute
    const normals = mesh.geometry.attributes.normal as THREE.BufferAttribute
    const top = maximum - 0.08
    const openBlend = smoothstep(0.86, 1, progress)
    const baseRadius = 0.105
    const pitch = 0.023
    const radialGrowth = pitch / (Math.PI * 2)

    for (let index = 0; index < positions.count; index += 1) {
      const offset = index * 3
      const ox = sourcePositions[offset]
      const oy = sourcePositions[offset + 1]
      const oz = sourcePositions[offset + 2]
      const onx = sourceNormals[offset]
      const ony = sourceNormals[offset + 1]
      const onz = sourceNormals[offset + 2]
      const t = paperT[index]
      let x = ox
      let y: number
      let z: number
      let nx = onx
      let ny = ony
      let nz = onz

      if (t <= progress) {
        const originalCenterY = oy - ony * halfThickness
        const originalFlatZ = minimum + t * length
        const curl = 1 - smoothstep(0.1, 0.23, t)
        const flatZ = top - (progress - t) * length
        y = originalCenterY * curl + ony * halfThickness
        z = flatZ + (centerZ[index] - originalFlatZ) * curl + onz * halfThickness
      } else {
        const rolledLength = (t - progress) * length
        const theta = (Math.sqrt(baseRadius * baseRadius + 2 * radialGrowth * rolledLength) - baseRadius) / radialGrowth
        const radius = baseRadius + radialGrowth * theta
        const cosine = Math.cos(theta)
        const sine = Math.sin(theta)
        y = radius * cosine - baseRadius + ony * halfThickness * cosine - onz * halfThickness * sine
        z = top + radius * sine + ony * halfThickness * sine + onz * halfThickness * cosine
        ny = ony * cosine - onz * sine
        nz = ony * sine + onz * cosine
      }

      if (openBlend > 0) {
        x = THREE.MathUtils.lerp(x, ox, openBlend)
        y = THREE.MathUtils.lerp(y, oy, openBlend)
        z = THREE.MathUtils.lerp(z, oz, openBlend)
        nx = THREE.MathUtils.lerp(nx, onx, openBlend)
        ny = THREE.MathUtils.lerp(ny, ony, openBlend)
        nz = THREE.MathUtils.lerp(nz, onz, openBlend)
      }
      positions.setXYZ(index, x, y, z)
      normals.setXYZ(index, nx, ny, nz)
    }
    positions.needsUpdate = true
    normals.needsUpdate = true
    this.renderer.shadowMap.needsUpdate = true
    // After the in-plane rotation the compact roll rests at the lower edge. Counter-translate so it
    // stays centred while closed/closing.
    const bottom = minimum + 0.08
    group.position.z = -(1 - progress) * bottom
    mesh.visible = rawProgress > 0.001 || this.direction !== 0
  }

  private animate = (now: number) => {
    if (this.disposed) return
    const delta = Math.min(0.2, (now - this.lastFrame) / 1000)
    this.lastFrame = now
    if (this.direction !== 0) {
      const duration = this.direction > 0 ? this.openDuration : this.closeDuration
      this.progress = clamp01(this.progress + (this.direction * delta * 1000) / duration)
      this.applyDeformation(this.progress)
      if ((this.progress === 1 && this.direction > 0) || (this.progress === 0 && this.direction < 0)) {
        const completedDirection = this.direction
        this.direction = 0
        this.settleTime = 0
        this.setState(completedDirection > 0 ? "open" : "closed")
        if (completedDirection < 0 && this.mesh) this.mesh.visible = false
      }
    }
    if (this.state === "open" && this.direction === 0) this.settleTime += delta
    this.updateSettling()
    this.updateFormState()
    this.particles.rotation.z += delta * 0.018
    this.particles.material.opacity = 0.16 + (this.direction !== 0 ? 0.3 : 0)
    this.composer.render()
    this.frameRequest = requestAnimationFrame(this.animate)
  }

  private updateSettling() {
    if (!this.group) return
    if (this.state === "open" && this.settleTime < 0.85 && !this.reducedMotion) {
      const decay = 1 - this.settleTime / 0.85
      this.group.rotation.x = Math.sin(this.settleTime * 18) * 0.025 * decay
      this.group.position.z += -Math.abs(Math.sin(this.settleTime * 13)) * 0.035 * decay
    } else {
      this.group.rotation.x = 0
    }
  }

  private updateFormState() {
    const active = this.progress === 1 && this.direction === 0 && (this.reducedMotion || this.settleTime > 0.28)
    if (active !== this.formActive) {
      this.formActive = active
      this.options.onFormState?.(active)
    }
  }

  playOpen() {
    if (!this.mesh) return
    this.mesh.visible = true
    this.direction = 1
    this.settleTime = 0
    this.setState("opening")
    this.setFormInactive()
  }

  playClose() {
    if (!this.mesh) return
    this.direction = -1
    this.settleTime = 0
    this.setState("closing")
    this.setFormInactive()
  }

  private setFormInactive() {
    this.options.onFormState?.(false)
    this.formActive = false
  }

  setProgress(value: number) {
    if (!this.mesh) return
    this.progress = clamp01(Number.isFinite(value) ? value : 0)
    this.direction = 0
    this.settleTime = this.progress === 1 ? 1 : 0
    this.mesh.visible = this.progress > 0.001
    this.setState(this.progress === 0 ? "closed" : this.progress === 1 ? "open" : "scrubbing")
    this.applyDeformation(this.progress)
    this.updateFormState()
  }

  private setState(state: ScrollState) {
    if (this.state === state) return
    this.state = state
    this.options.onStateChange?.(state)
  }

  private resize() {
    const width = Math.max(1, this.container.clientWidth)
    const height = Math.max(1, this.container.clientHeight)
    const aspect = width / height
    this.camera.left = (-VIEW_HEIGHT * aspect) / 2
    this.camera.right = (VIEW_HEIGHT * aspect) / 2
    this.camera.top = VIEW_HEIGHT / 2
    this.camera.bottom = -VIEW_HEIGHT / 2
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.composer.setSize(width, height)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frameRequest)
    this.resizeObserver.disconnect()
    this.scene.traverse((object) => {
      const renderable = object as THREE.Mesh
      renderable.geometry?.dispose()
      if (Array.isArray(renderable.material)) renderable.material.forEach((material) => material.dispose())
      else renderable.material?.dispose()
    })
    this.aoPass.dispose()
    this.composer.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.domElement.remove()
  }
}
