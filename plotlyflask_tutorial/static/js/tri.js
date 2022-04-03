import * as THREE from "https://threejs.org/build/three.module.js"
import { TransformControls } from "./modules/TransformControls.js"
import { OrbitControls } from "./modules/OrbitControls.js"
import { GLTFLoader } from "./modules/GLTFLoader.js"
import { FontLoader } from "./modules/FontLoader.js"
import { CSS3DRenderer, CSS3DObject } from './modules/CSS3DRenderer.js'


const scene = new THREE.Scene()

var JOINTS = []

const canvas = document.querySelector('#gs')

var Width;
var Height = window.innerHeight * 0.8;

var mq = window.matchMedia("(max-width: 1000px)");
if (mq.matches) {
  Width = window.innerWidth * 0.85;

}
else {
  Width = window.innerWidth * 0.65;
}

const camera = new THREE.PerspectiveCamera(30, Width / Height, 1, 1500);
camera.userData.notDestroy = true
camera.position.set(0.56, 63.3, 142.23);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true },);

var vector = new THREE.Vector3();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(Width, Height);

renderer.domElement.style.zIndex = -3;


renderer.domElement.style.position = 'absolute';


renderer.shadowMap.enabled = true;


const orbit = new OrbitControls(camera, renderer.domElement);
orbit.addEventListener('change', onPositionChange);




function createFloor() {
  let pos = { x: 0, y: -1, z: 3 };
  let scale = { x: 120, y: 2, z: 120 };

  let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xf9c834 }));
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  blockPlane.userData.notDestroy = true
  scene.add(blockPlane);

  blockPlane.userData.ground = true
  blockPlane.userData.name = 'plane'
}



createFloor()
animate()


function onWindowResize() {
  renderer.setSize(window.innerWidth * 0.65, window.innerHeight * 0.8);
  renderer2.setSize(window.innerWidth * 0.65, window.innerHeight * 0.8);
}
window.addEventListener('resize', onWindowResize);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}