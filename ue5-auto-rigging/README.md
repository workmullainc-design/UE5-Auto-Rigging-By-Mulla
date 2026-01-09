# UE5 Auto Rigging By Mulla

A React + Three.js application for visualizing and preparing FBX meshes for automatic rigging in Unreal Engine 5.

## Features

- **FBX Mesh Upload**: Upload any `.fbx` file to visualize the mesh
- **3D Viewport**: Interactive 3D viewer with orbit controls
- **Mesh Visualization**: View meshes without bones/skeleton (bare mesh visualization)
- **Responsive Design**: Full-screen viewport with sidebar controls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
ue5-auto-rigging/
├── index.html          # Entry HTML file
├── package.json        # Project dependencies
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   └── components/     # React components
└── public/             # Static assets
```

## Usage

1. Click the upload area or drag and drop an `.fbx` file
2. The mesh will load and display in the 3D viewport
3. Use mouse controls to navigate:
   - **Left Mouse**: Rotate view
   - **Right Mouse**: Pan view
   - **Scroll**: Zoom in/out
4. Click "Clear Model" to remove the current mesh and upload a new one

## Current Mode: Mesh Visualization

This initial version focuses on mesh visualization without skeleton/bone data. Future updates will include:
- Point control system
- Skeleton viewer
- Auto-rigging algorithms
- Skinning tools

## Tech Stack

- **React 18**: UI framework
- **Three.js**: 3D rendering
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for R3F
- **Vite**: Build tool and dev server
