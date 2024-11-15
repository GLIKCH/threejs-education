// Application Import Dependencies

import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Creating the Renderer
// Assigning Window Size Scale
const w = window.innerWidth;
const h = window.innerHeight;

// Renderer Begin
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera Constant Parameters
const fov = 75;
const aspect =  w / h;
const near = 0.1;
const far = 10;

// Perspective Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;
const scene = new THREE.Scene();

// Mouse Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Enter Geometry and Objects
// Parameters (Size, Detail)
const geo = new THREE.IcosahedronGeometry(0.40, 10);
// Basic Hex Color
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xFE4527,
    wireframe: true
});

const wireMat2 = new THREE.MeshBasicMaterial({
    color: 0x00ff90,
    wireframe: true
});

const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(4.001);
mesh.add(wireMesh);

const wireMesh2 = new THREE.Mesh(geo, wireMat2);
wireMesh2.scale.setScalar(5.001);
mesh.add(wireMesh2);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x00000);
scene.add(hemiLight);

// Iso Animation (Rotation)
function animate(t = 0){
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.0000;
    mesh.rotation.z = t * 0.0000;
    renderer.render(scene, camera);
    controls.update();
}

animate();

renderer.render(scene, camera);

