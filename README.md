# Three.js Geometry Scene

This project demonstrates a basic geometry scene rendered using JavaScript and Three.js. The setup includes a rotating icosahedron rendered with a simple material alongside a wireframe overlay, which creates a visually engaging geometric structure. The project can be run directly in the browser.

## Overview

This application initializes a basic 3D scene using Three.js. The code sets up a renderer, a camera, lighting, and two meshes (one solid and one wireframe) to create a dynamic geometry effect. The rendered geometry is an icosahedron with customizable size and detail.

## Project Structure

- **Renderer**: Initializes the WebGL renderer, setting the size to match the browser window.
- **Camera**: Configures a perspective camera to define the scene view.
- **Scene**: Contains all the 3D objects rendered, including geometry, materials, and lighting.
- **Geometry**: Defines an icosahedron with a basic material and an overlay wireframe material.
- **Lighting**: Adds a hemisphere light to enhance visibility and create shading effects.
- **Animation Loop**: Continuously renders the scene, allowing for real-time exploration.

## Code Breakdown

1. **Renderer Setup**: The `WebGLRenderer` is created with anti-aliasing enabled for smoother edges and appended to the DOM.
2. **Camera Parameters**: Defines the field of view, aspect ratio, near, and far clipping planes for the perspective camera.
3. **Geometry and Material**:
   - **IcosahedronGeometry**: A geometric structure with customizable size and detail.
   - **MeshStandardMaterial**: Provides a basic solid material with flat shading for a clean, minimalist look.
   - **MeshBasicMaterial (Wireframe)**: Adds a wireframe overlay in a hex color.
4. **Lighting**: A hemisphere light to illuminate the scene.
5. **Animation Function**: A render loop that updates the scene frame-by-frame.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (optional, for serving files locally)
- [Three.js](https://threejs.org/)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/GLIKCH/threejs-education
