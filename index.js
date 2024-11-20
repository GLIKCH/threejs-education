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
// and innovation in their personal and professional lives."

import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Constants
const w = window.innerWidth;
const h = window.innerHeight;
const fov = 75, aspect = w / h, near = 0.1, far = 1000;
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
    camera.position.set(0, 50, 100);
    return camera;
}

// Initialize Scene
function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    return scene;
}

// Create Grid Helpers
function createGridHelpers(scene) {
    const gridConfigs = [
        { position: { y: -50 }, rotation: {} }, // Floor
        { position: { y: 150 }, rotation: { x: Math.PI } }, // Ceiling
        { position: { z: -100, y: 50 }, rotation: { x: Math.PI / 2 } }, // Back Wall
        { position: { z: 100, y: 50 }, rotation: { x: Math.PI / 2 } }, // Front Wall
        { position: { x: -100, y: 50 }, rotation: { z: Math.PI / 2 } }, // Left Wall
        { position: { x: 100, y: 50 }, rotation: { z: Math.PI / 2 } }, // Right Wall
    ];

    gridConfigs.forEach(({ position, rotation }) => {
        const grid = new THREE.GridHelper(200, 50, 0xff0000, 0xff0000);
        Object.assign(grid.position, position);
        Object.assign(grid.rotation, rotation);
        scene.add(grid);
    });
}

// Create Mesh with Wireframes
function createMesh(scene) {
    const geo = new THREE.IcosahedronGeometry(30, 30);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
    const baseMesh = new THREE.Mesh(geo, baseMat);
    baseMesh.position.set(0, 10, 0);

    const wireMaterials = [
        { color: 0xff4500, scale: 1.1 },
        { color: 0xff0000, scale: 1.2 }
    ];

    wireMaterials.forEach(({ color, scale }) => {
        const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true });
        const wireMesh = new THREE.Mesh(geo, wireMat);
        wireMesh.scale.setScalar(scale);
        baseMesh.add(wireMesh);
    });

    scene.add(baseMesh);
}

// Create Icosahedrons with Random Movement
function createIcosahedrons(scene, count) {
    const geo = new THREE.IcosahedronGeometry(10, 1);

    for (let i = 0; i < count; i++) {
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
        const baseMesh = new THREE.Mesh(geo, baseMat);

        // Randomize position
        baseMesh.position.set(
            (Math.random() - 0.5) * 500, // X position
            (Math.random() - 0.5) * 500, // Y position (random height)
            (Math.random() - 0.5) * 500  // Z position
        );

        baseMesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.5, // Speed up random velocities
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ),
            baseMaterial: baseMat
        };



        // Add wireframes
        const wireMaterials = [
            { color: 0xff4500, scale: 1.1 },
            { color: 0xff0000, scale: 1.2 }
        ];

        wireMaterials.forEach(({ color, scale }) => {
            const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true });
            const wireMesh = new THREE.Mesh(geo, wireMat);
            wireMesh.scale.setScalar(scale);
            baseMesh.add(wireMesh);
        });

        icosahedrons.push(baseMesh); // Store the mesh in the array
        scene.add(baseMesh);
    }
}

// Add Lights
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x444444); // Dark grey ambient light
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff0000, 0.8, 300); // Dark red
    pointLight1.position.set(-50, 100, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x550000, 0.6, 300); // Dark red, less intense
    pointLight2.position.set(50, -100, -50);
    scene.add(pointLight2);

    const gradientLights = [];
    for (let i = 0; i < 6; i++) {
        const color = new THREE.Color(`hsl(${(i * 60)}, 100%, 25%)`); // HSL colors for gradient effect
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
            // Move the icosahedrons
            ico.position.add(ico.userData.velocity);

            // Check for collisions with the walls and reverse direction if necessary
            if (ico.position.x > 90 || ico.position.x < -90) {
                ico.userData.velocity.x *= -1;
                ico.position.x = THREE.MathUtils.clamp(ico.position.x, -90, 90);
            }
            if (ico.position.y > 140 || ico.position.y < -40) { // Ceiling and floor bounds
                ico.userData.velocity.y *= -1;
                ico.position.y = THREE.MathUtils.clamp(ico.position.y, -40, 140);
            }
            if (ico.position.z > 95 || ico.position.z < -95) {
                ico.userData.velocity.z *= -1;
                ico.position.z = THREE.MathUtils.clamp(ico.position.z, -95, 95);
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
    createMesh(scene);
    addLights(scene);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;

    setupMovementControls();
    createIcosahedrons(scene, 10); // Creates 5 icosahedrons randomly distributed
    animate(renderer, scene, camera, controls);
}

main();
