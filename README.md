# UE5 Auto Rigging (by Mulla) — Mesh Viewer (React + Three.js)

This repo contains the initial UI + 3D viewport foundation for the **UE5 Auto Rigging** tool.

Current scope:

- React + TypeScript + Vite project setup
- Three.js viewport with basic lighting
- FBX upload + preview (mesh visualization only)
- Orbit/pan/zoom camera controls

No skeleton/rigging features are implemented yet.

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL printed by Vite.

## Usage

1. Click **Upload FBX**
2. Select an `.fbx` file
3. The mesh will load into the viewport and the camera will auto-frame it

Viewport controls:

- Left mouse: rotate
- Right mouse / two-finger drag: pan
- Mouse wheel / pinch: zoom

## Notes / Limitations

- This is a **viewer only**. Bones are hidden if present, but there is no skeleton viewer or rigging workflow yet.
- FBX parsing happens client-side via `three/examples/jsm/loaders/FBXLoader`.
