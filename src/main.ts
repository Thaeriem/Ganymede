import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x01010A );

const ambientLight = new THREE.AmbientLight(0xffffff, 13);
ambientLight.position.set(0, 0, 400);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(0, 0, 400);
scene.add(pointLight);

const particlesGeometry = new THREE.BufferGeometry(); // Geometry for the stars
const particlesCount = 10000; // number of particles to be created

const vertices = new Float32Array(particlesCount); // Float32Array is an array of 32-bit floats. This is used to represent an array of vertices. (we have 3 values for each vertex - coordinates x, y, z)

// Loop through all the vertices and set their random position
for (let i = 0; i < particlesCount; i += 3) {
  // Generate random spherical coordinates (r, θ, φ)
  const randomR = Math.random(); // Random value between 0 and 1
  const r = Math.sqrt(randomR) * 1000; // Use square root function to bias distribution towards edges

  const theta = Math.random() * Math.PI * 2; // Azimuthal angle
  const phi = Math.acos(Math.random() * 2 - 1); // Polar angle

  // Convert spherical coordinates to Cartesian coordinates
  vertices[i] = r * Math.sin(phi) * Math.cos(theta); // x
  vertices[i + 1] = r * Math.sin(phi) * Math.sin(theta); // y
  vertices[i + 2] = r * Math.cos(phi)+400; // z (offset by 400 to center around (0, 0, 400))
}



particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3) // 3 values for each vertex (x, y, z)
  // Check the documentation for more info about this.
);

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/img/star2.png');

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 1.5, // Size of the particles
  map: particleTexture,
  transparent: true,
  sizeAttenuation: true, // size of the particle will be smaller as it gets further away from the camera, and if it's closer to the camera, it will be bigger
});

const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);


const camera = new THREE.PerspectiveCamera(500, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 60)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.1
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

new GLTFLoader().load('/models/ganymede.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.1,0.1,0.1);
  scene.add(model);
});


const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

  stats.update()
}

animate()