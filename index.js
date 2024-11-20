// GK ENG DEV REV~1.3
// Joel J. De Alba - B.S. Computer Science
// Three.js front-end graphical representation of independent ML/AI Neural Nodes

// This application is part of a larger initiative designed to create a 
// dynamic ecosystem of educational resources, including a wide range of
// documentaries, engineering concepts, programming languages, robotic
// engineering parts, console modification accessories, and engineering
// projects. As it evolves, the app will integrate cutting-edge AI
// capabilities, allowing it to learn from its users. This AI will adapt
// and offer personalized guidance, enhancing the way users approach
// both everyday challenges and technological problems. Our goal is to
// empower users to upgrade their skill sets, fostering lifelong learning
// and innovation in their personal and professional lives.



// INIT -- INIT  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Constants
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75, aspect = w / h, near = 0.1, far = 9000;
const speed = 1;

// Variables for movement controls
const move = { forward: false, backward: false, left: false, right: false };
let icosahedrons = [];

// Initialize Renderer
function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

// Initialize Camera
function createCamera() {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 300, 300);
    return camera;
}

// Initialize Scene
function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x424242);
    return scene;
}
// INIT -- INIT  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// GRID - GRID  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Create Grid Helpers
function createGridHelpers(scene) {
    const gridConfigs = [
        { position: { y: 0 }, rotation: {} }, // Floor
        { position: { y: 200 }, rotation: { x: Math.PI } }, // Ceiling
        { position: { z: -100, y: 100 }, rotation: { x: Math.PI / 2 } }, // Back Wall
        { position: { z: 100, y: 100 }, rotation: { x: Math.PI / 2 } }, // Front Wall
        { position: { x: -100, y: 100 }, rotation: { z: Math.PI / 2 } }, // Left Wall
        { position: { x: 100, y: 100 }, rotation: { z: Math.PI / 2 } }, // Right Wall
    ];

    gridConfigs.forEach(({ position, rotation }) => {
        const grid = new THREE.GridHelper(200, 50, 0xffff00, 0xff0000);
        Object.assign(grid.position, position);
        Object.assign(grid.rotation, rotation);
        scene.add(grid);
    });
}
// GRID - GRID  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// ICOSAHEDRON -- CENTER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Create Mesh with Wireframes
function createMesh(scene) {
    const geo = new THREE.IcosahedronGeometry(30, 3);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
    const baseMesh = new THREE.Mesh(geo, baseMat);
    baseMesh.position.set(0, 100, 0);

    const wireMaterials = [
        { color: 0x0D5A9F, scale: 2.1 },
        { color: 0x0D5A9F, scale: 1.2 }
    ];

    wireMaterials.forEach(({ color, scale }) => {
        const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true });
        const wireMesh = new THREE.Mesh(geo, wireMat);
        wireMesh.scale.setScalar(scale);
        baseMesh.add(wireMesh);
    });
    scene.add(baseMesh);
}
// ICOSAHEDRON -- CENTER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// ICOSAHEDRON -- NODES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Create Icosahedrons with Random Movement
function createIcosahedrons(scene, count) {
    const geo = new THREE.IcosahedronGeometry(10, 10);

    for (let i = 0; i < count; i++) {
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xFFFF00, flatShading: true });
        const baseMesh = new THREE.Mesh(geo, baseMat);

        // Randomize position
        baseMesh.position.set(
            (Math.random() - 0.5) * 500, 
            (Math.random() - 0.5) * 500, 
            (Math.random() - 0.5) * 500
        );

        baseMesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 1, 
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 1
            ),
            baseMaterial: baseMat
        };

        const wireMaterials = [
            { color: 0xff4500, scale: 1.2 },
            { color: 0xff0000, scale: 1.4 }
        ];

        wireMaterials.forEach(({ color, scale }) => {
            const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true });
            const wireMesh = new THREE.Mesh(geo, wireMat);
            wireMesh.scale.setScalar(scale);
            baseMesh.add(wireMesh);
        });

        icosahedrons.push(baseMesh);
        scene.add(baseMesh);
    }
}
// ICOSAHEDRON -- NODES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// Add Lights
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 300);
    pointLight1.position.set(-50, 100, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.6, 300);
    pointLight2.position.set(50, -100, -50);
    scene.add(pointLight2);

    const gradientLights = [];
    for (let i = 0; i < 6; i++) {
        const color = new THREE.Color(`hsl(${(i * 60)}, 100%, 25%)`);
        const light = new THREE.PointLight(color, 0.5, 500);
        light.position.set(
            100 * Math.cos((i / 6) * Math.PI * 2),
            50,
            100 * Math.sin((i / 6) * Math.PI * 2)
        );
        gradientLights.push(light);
        scene.add(light);
    }
}

// Handle Movement
function setupMovementControls() {
    document.addEventListener("keydown", ({ key }) => {
        if (key in move) move[key] = true;
    });

    document.addEventListener("keyup", ({ key }) => {
        if (key in move) move[key] = false;
    });
}

// Animate Scene
function animate(renderer, scene, camera, controls) {
    function loop() {
        if (move.forward) camera.position.z -= speed;
        if (move.backward) camera.position.z += speed;
        if (move.left) camera.position.x -= speed;
        if (move.right) camera.position.x += speed;

        icosahedrons.forEach((ico) => {
            ico.position.add(ico.userData.velocity);

            if (ico.position.x > 90 || ico.position.x < -90) {
                ico.userData.velocity.x *= -1;
                ico.position.x = THREE.MathUtils.clamp(ico.position.x, -90, 90);
            }
            if (ico.position.y > 185 || ico.position.y < 10) {
                ico.userData.velocity.y *= -1;
                ico.position.y = THREE.MathUtils.clamp(ico.position.y, 10, 185);
            }
            if (ico.position.z > 95 || ico.position.z < -95) {
                ico.userData.velocity.z *= -1;
                ico.position.z = THREE.MathUtils.clamp(ico.position.z, -90, 90);
            }
        });

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }
    loop();
}

// Main Function
function main() {
    const renderer = createRenderer();
    const camera = createCamera();
    const scene = createScene();
    createGridHelpers(scene);
    createIcosahedrons(scene, 8);
    createMesh(scene);
    addLights(scene);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    setupMovementControls();
    animate(renderer, scene, camera, controls);
}

main();
