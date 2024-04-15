import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import getStarfield from './getStarfield'
import { getFresnelMat } from './getFresnelMap.js'

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x01010A );

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.75
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const moonGroup = new THREE.Group();
moonGroup.rotation.z = -33 * Math.PI / 180;
scene.add(moonGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("images/ganymede.jpeg"),
  specularMap: loader.load("images/sm-ganymede.png"),
  bumpMap: loader.load("images/nm-ganymede.png"),
  bumpScale: 0.04,
});
const moonMesh = new THREE.Mesh(geometry, material);
moonGroup.add(moonMesh);


const jupiterGroup = new THREE.Group();
jupiterGroup.rotation.z = -3.13 * Math.PI / 180;
jupiterGroup.position.set(62,10, 0);
const jupiterLoader = new THREE.TextureLoader();
const jupiterGeometry = new THREE.IcosahedronGeometry(8, detail);
const jupiterMaterial = new THREE.MeshPhongMaterial({
  map: jupiterLoader.load("images/jupiter.png"),
  specularMap: jupiterLoader.load("images/sm-jupiter.png"),
  bumpMap: jupiterLoader.load("images/nm-jupiter.png"),
  bumpScale: 0.04,
});
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiterGroup.add(jupiterMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("images/jupiter-clouds.png"),
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(jupiterGeometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
jupiterGroup.add(cloudsMesh);

const pivot = new THREE.Group();
pivot.add(jupiterGroup);
pivot.rotation.y = 20.9;
scene.add(pivot)

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const backLight = new THREE.AmbientLight(0xffffff, Math.PI * 0.075);
scene.add(backLight)

const funLight = new THREE.AmbientLight(0xC3B1E1, Math.PI * 0.4)
scene.add(funLight)

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
moonGroup.add(glowMesh);

const fresnelJMat = getFresnelMat({ rimHex: 0xffba81 });
const glowJMesh = new THREE.Mesh(jupiterGeometry, fresnelJMat);
glowJMesh.scale.setScalar(1.01);
jupiterGroup.add(glowJMesh)

function animate() {
  requestAnimationFrame(animate);

  moonMesh.rotation.y += 0.002;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  jupiterMesh.rotation.y += 0.002;
  pivot.rotation.y += 0.0003;
  controls.update()
  renderer.render(scene, camera);
}
animate()

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);