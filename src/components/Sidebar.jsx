import { useRef, useState } from 'react'
import './Sidebar.css'

const Sidebar = ({ onFileUpload, fbxFile }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.name.toLowerCase().endsWith('.fbx')) {
      onFileUpload(file)
    } else {
      alert('Please select a valid .fbx file')
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    if (file && file.name.toLowerCase().endsWith('.fbx')) {
      onFileUpload(file)
    } else {
      alert('Please drop a valid .fbx file')
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>Model Upload</h2>
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".fbx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p>Click to upload or drag and drop</p>
            <span className="upload-hint">FBX files only</span>
          </div>
          <button className="upload-button" onClick={handleButtonClick}>
            Browse Files
          </button>
        </div>
      </div>

      {fbxFile && (
        <div className="sidebar-section">
          <h2>Current Model</h2>
          <div className="model-info">
            <div className="info-item">
              <span className="info-label">Filename:</span>
              <span className="info-value">{fbxFile.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Size:</span>
              <span className="info-value">
                {(fbxFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">FBX Model</span>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar-section">
        <h2>Controls</h2>
        <div className="controls-info">
          <div className="control-item">
            <span className="control-key">Left Click + Drag</span>
            <span className="control-description">Rotate</span>
          </div>
          <div className="control-item">
            <span className="control-key">Right Click + Drag</span>
            <span className="control-description">Pan</span>
          </div>
          <div className="control-item">
            <span className="control-key">Scroll</span>
            <span className="control-description">Zoom</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">📦</span>
            <span>Point Control</span>
            <span className="feature-status">Coming Soon</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🦴</span>
            <span>Skeleton Viewer</span>
            <span className="feature-status">Coming Soon</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔗</span>
            <span>Auto Rigging</span>
            <span className="feature-status">Coming Soon</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>Auto Skinning</span>
            <span className="feature-status">Coming Soon</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
