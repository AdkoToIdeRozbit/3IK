
// import * as THREE from "https://threejs.org/build/three.module.js"
// import { TransformControls } from "./modules/TransformControls.js"
// import { OrbitControls } from "./modules/OrbitControls.js"
// import { GLTFLoader } from "./modules/GLTFLoader.js"
// import { FontLoader } from "./modules/FontLoader.js"
// import { CSS3DRenderer, CSS3DObject } from './modules/CSS3DRenderer.js'
// import { TransformControls } from "/static/js/modules/TransformControls.js"



// // Grab the specific canvas
const canvas = document.getElementById('bg');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup with specific canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// Adding a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Adding a light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
