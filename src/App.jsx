import { useState } from 'react'
import Viewport from './components/Viewport'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [fbxFile, setFbxFile] = useState(null)

  const handleFileUpload = (file) => {
    setFbxFile(file)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>UE5 Auto Rigging By Mulla</h1>
      </header>
      <div className="app-content">
        <Sidebar onFileUpload={handleFileUpload} fbxFile={fbxFile} />
        <Viewport fbxFile={fbxFile} />
      </div>
    </div>
  )
}

export default App
