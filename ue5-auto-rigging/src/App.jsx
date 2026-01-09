import React, { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'
import './App.css'

function FBXModel({ url, onLoad, onError }) {
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  React.useEffect(() => {
    if (!url) return

    const loader = new FBXLoader()
    setLoading(true)
    setError(null)

    loader.load(
      url,
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                roughness: 0.7,
                metalness: 0.1,
                side: THREE.DoubleSide
              })
            }
          }
        })
        object.scale.set(0.01, 0.01, 0.01)
        setModel(object)
        setLoading(false)
        if (onLoad) onLoad(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100).toFixed(0) + '% loaded')
      },
      (err) => {
        setError(err.message || 'Failed to load FBX file')
        setLoading(false)
        if (onError) onError(err)
      }
    )
  }, [url, onLoad, onError])

  if (!url) return null
  if (loading) return <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="yellow" wireframe /></mesh>
  if (error) return null
  if (!model) return null

  return <primitive object={model} />
}

function Scene({ modelUrl }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      
      <Grid
        infiniteGrid
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={50}
        fadeStrength={1}
      />

      <FBXModel url={modelUrl} />
      
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={0.5}
        maxDistance={100}
        target={[0, 0, 0]}
      />
    </>
  )
}

function App() {
  const [modelUrl, setModelUrl] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    setFileName(file.name)

    const url = URL.createObjectURL(file)
    setModelUrl(url)
    setLoading(false)
  }, [])

  const handleReset = useCallback(() => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl)
    }
    setModelUrl(null)
    setFileName('')
  }, [modelUrl])

  return (
    <div className="app">
      <header className="header">
        <h1>UE5 Auto Rigging By Mulla</h1>
        <p className="subtitle">Upload an FBX mesh to visualize and prepare for auto-rigging</p>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="upload-section">
            <h2>Upload FBX</h2>
            <div className="upload-area">
              <input
                type="file"
                accept=".fbx"
                onChange={handleFileChange}
                className="file-input"
                id="fbx-upload"
              />
              <label htmlFor="fbx-upload" className="upload-label">
                <span className="upload-icon">📁</span>
                <span>{fileName || 'Choose FBX file'}</span>
              </label>
            </div>
            {fileName && (
              <button className="reset-button" onClick={handleReset}>
                Clear Model
              </button>
            )}
          </div>

          <div className="info-section">
            <h2>Controls</h2>
            <ul className="controls-list">
              <li><strong>Left Mouse:</strong> Rotate</li>
              <li><strong>Right Mouse:</strong> Pan</li>
              <li><strong>Scroll:</strong> Zoom</li>
            </ul>
          </div>

          <div className="status-section">
            <h2>Status</h2>
            <div className="status-item">
              <span className="status-label">Model:</span>
              <span className="status-value">{fileName ? 'Loaded' : 'None'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Mode:</span>
              <span className="status-value">Mesh View</span>
            </div>
          </div>
        </aside>

        <main className="viewport">
          <Canvas
            shadows
            camera={{ position: [5, 5, 5], fov: 50 }}
            gl={{ antialias: true }}
          >
            <Scene modelUrl={modelUrl} />
          </Canvas>
          {!modelUrl && (
            <div className="viewport-placeholder">
              <p>Upload an FBX file to view your mesh</p>
            </div>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>UE5 Auto Rigging Tool - Mesh Visualization Mode</p>
      </footer>
    </div>
  )
}

export default App
