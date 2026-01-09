# UE5 Auto Rigging By Mulla

An automatic rigging and skinning solution for UE5 characters.

## Project Overview

This project is a web-based application for automatically rigging and skinning 3D character models, specifically designed for Unreal Engine 5 (UE5) workflows.

## Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D rendering engine
- **Vite** - Build tool and dev server
- **FBXLoader** - Three.js FBX file loader

## Current Features

### ✅ Implemented
- **FBX Model Upload** - Upload .fbx files via file picker or drag-and-drop
- **3D Viewport** - Display FBX meshes with proper lighting
- **Camera Controls** - Orbit, pan, and zoom controls for model interaction
- **Responsive Layout** - Clean UI with sidebar and large 3D viewport

### 🚧 Coming Soon
- Point Control System
- Skeleton Viewer
- Auto Rigging
- Auto Skinning
- Export to UE5 formats

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ue5-auto-rigging-by-mulla
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Upload FBX Model**: Click "Browse Files" or drag and drop an .fbx file into the upload zone
2. **View Model**: The model will appear in the 3D viewport with proper lighting
3. **Interact**: Use mouse controls to rotate, pan, and zoom the camera
   - Left Click + Drag: Rotate
   - Right Click + Drag: Pan
   - Scroll: Zoom

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Viewport.jsx      # 3D viewport with Three.js
│   │   ├── Viewport.css
│   │   ├── Sidebar.jsx       # UI sidebar for controls and info
│   │   └── Sidebar.css
│   ├── App.jsx               # Main application component
│   ├── App.css
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Development Notes

- The viewport currently displays bare meshes without bones/skeleton
- FBX models are automatically centered and scaled to fit the viewport
- The scene includes ambient and directional lighting for proper visualization
- Grid and axes helpers are displayed for spatial reference

## License

[Add your license information here]
