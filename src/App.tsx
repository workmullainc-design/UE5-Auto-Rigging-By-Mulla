import { useId, useState } from 'react'
import './App.css'
import ThreeViewport from './components/ThreeViewport'

export default function App() {
  const fileInputId = useId()

  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="appRoot">
      <header className="topBar">
        <div className="brand">
          <div className="brandTitle">UE5 Auto Rigging</div>
          <div className="brandSubtitle">by Mulla</div>
        </div>
        <div className="topBarStatus" aria-live="polite">
          {error ? (
            <span className="statusError">{error}</span>
          ) : isLoading ? (
            <span className="statusMuted">Loading FBX…</span>
          ) : file ? (
            <span className="statusMuted">{file.name}</span>
          ) : (
            <span className="statusMuted">No model loaded</span>
          )}
        </div>
      </header>

      <div className="appBody">
        <aside className="sidebar">
          <section className="panel">
            <h2 className="panelTitle">Model</h2>

            <label className="filePicker" htmlFor={fileInputId}>
              <span className="filePickerLabel">Upload FBX</span>
              <input
                id={fileInputId}
                className="filePickerInput"
                type="file"
                accept=".fbx"
                onChange={(e) => {
                  const selected = e.target.files?.[0] ?? null
                  setError(null)
                  setFile(selected)
                }}
              />
            </label>

            <div className="helpText">
              Supported: <code>.fbx</code> (mesh preview only; no rigging/skeleton yet)
            </div>
          </section>

          <section className="panel">
            <h2 className="panelTitle">Next Features</h2>
            <ul className="todoList">
              <li>Point controls</li>
              <li>Skeleton viewer</li>
              <li>Auto-rigging & skinning</li>
            </ul>
          </section>

          <section className="panel">
            <h2 className="panelTitle">Viewport Controls</h2>
            <ul className="todoList">
              <li>Left mouse: rotate</li>
              <li>Right mouse / two-finger drag: pan</li>
              <li>Mouse wheel / pinch: zoom</li>
            </ul>
          </section>
        </aside>

        <main className="viewportArea">
          {!file ? <div className="viewportOverlay">Upload an FBX to preview the mesh</div> : null}
          <ThreeViewport file={file} onLoadingChange={setIsLoading} onError={setError} />
        </main>
      </div>
    </div>
  )
}
