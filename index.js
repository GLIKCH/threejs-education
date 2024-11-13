import * as THREE from "three";

// Creating the Renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera Constant Parameters
const fov = 75;
const aspect =  w / h;
const near = 0.1;
const far = 10;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

// Parameters (Size, Detail)
const geo = new THREE.IcosahedronGeometry(1.0, 2);
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

const wireMesh = new THREE.Mesh(geo, wireMat);
scene.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x00000);
scene.add(hemiLight);

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

renderer.render(scene, camera);

