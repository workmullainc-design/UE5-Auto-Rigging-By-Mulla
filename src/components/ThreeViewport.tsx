import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

type Props = {
  file: File | null
  onLoadingChange?: (isLoading: boolean) => void
  onError?: (message: string | null) => void
}

function disposeMaterial(material: THREE.Material) {
  const mat = material as THREE.Material & Record<string, unknown>

  for (const value of Object.values(mat)) {
    const texture = value as THREE.Texture | undefined
    if (
      texture &&
      typeof texture === 'object' &&
      'isTexture' in texture &&
      (texture as THREE.Texture & { isTexture?: boolean }).isTexture
    ) {
      texture.dispose()
    }
  }

  material.dispose()
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!('isMesh' in mesh) || !mesh.isMesh) return

    mesh.geometry.dispose()

    const material = mesh.material
    if (Array.isArray(material)) {
      material.forEach(disposeMaterial)
    } else {
      disposeMaterial(material)
    }
  })
}

function frameObject(params: {
  object: THREE.Object3D
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
}) {
  const { object, camera, controls } = params

  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  const maxSize = Math.max(size.x, size.y, size.z)

  if (!Number.isFinite(maxSize) || maxSize <= 0) {
    controls.target.copy(center)
    camera.near = 0.01
    camera.far = 10000
    camera.position.set(center.x + 2, center.y + 1, center.z + 2)
    camera.updateProjectionMatrix()
    controls.update()
    return
  }

  const fitHeightDistance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)))
  const fitWidthDistance = fitHeightDistance / camera.aspect
  const distance = 1.25 * Math.max(fitHeightDistance, fitWidthDistance)

  controls.target.copy(center)

  camera.near = Math.max(distance / 100, 0.01)
  camera.far = distance * 100

  camera.position.set(center.x + distance, center.y + distance * 0.25, center.z + distance)
  camera.updateProjectionMatrix()

  controls.maxDistance = distance * 20
  controls.update()
}

export default function ThreeViewport({ file, onLoadingChange, onError }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const modelGroupRef = useRef<THREE.Group | null>(null)
  const latestLoadIdRef = useRef(0)

  const loader = useMemo(() => new FBXLoader(), [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d0d0f)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 10000)
    camera.position.set(2, 1, 2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.screenSpacePanning = true

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.9)
    scene.add(hemisphereLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1)
    directionalLight.position.set(3, 6, 4)
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35)
    fillLight.position.set(-5, 2, -4)
    scene.add(fillLight)

    const grid = new THREE.GridHelper(10, 10, 0x404040, 0x202020)
    grid.position.y = 0
    scene.add(grid)

    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls
    modelGroupRef.current = modelGroup

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(container)
    resize()

    let rafId = 0
    const renderLoop = () => {
      rafId = window.requestAnimationFrame(renderLoop)
      controls.update()
      renderer.render(scene, camera)
    }
    renderLoop()

    return () => {
      window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      controls.dispose()

      disposeObject(modelGroup)
      modelGroup.clear()

      renderer.dispose()
      container.removeChild(renderer.domElement)

      modelGroupRef.current = null
      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      controlsRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!file) return

    const camera = cameraRef.current
    const controls = controlsRef.current
    const modelGroup = modelGroupRef.current

    if (!camera || !controls || !modelGroup) return

    onError?.(null)
    onLoadingChange?.(true)

    const loadId = ++latestLoadIdRef.current
    const url = URL.createObjectURL(file)
    let cancelled = false

    const clearModel = () => {
      const old = modelGroup.children[0]
      if (!old) return

      modelGroup.remove(old)
      disposeObject(old)
    }

    loader.load(
      url,
      (object) => {
        if (cancelled || loadId !== latestLoadIdRef.current) return

        URL.revokeObjectURL(url)
        clearModel()

        object.traverse((child) => {
          const maybeBone = child as THREE.Object3D & { isBone?: boolean }
          if (maybeBone.isBone) {
            maybeBone.visible = false
          }

          const maybeMesh = child as THREE.Mesh & { isMesh?: boolean }
          if (maybeMesh.isMesh) {
            maybeMesh.castShadow = false
            maybeMesh.receiveShadow = false
          }
        })

        modelGroup.add(object)
        frameObject({ object, camera, controls })

        onLoadingChange?.(false)
      },
      undefined,
      (err) => {
        if (cancelled || loadId !== latestLoadIdRef.current) return

        URL.revokeObjectURL(url)
        onLoadingChange?.(false)

        const message = err instanceof Error ? err.message : 'Failed to load FBX file'
        onError?.(message)
      },
    )

    return () => {
      cancelled = true
      latestLoadIdRef.current += 1
      URL.revokeObjectURL(url)
    }
  }, [file, loader, onError, onLoadingChange])

  return (
    <div ref={containerRef} className="threeViewport" aria-label="3D viewport" />
  )
}
