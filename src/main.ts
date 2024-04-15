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
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.75
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const moonGroup = new THREE.Group();
moonGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(moonGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("/img/ganymede.jpeg"),
  specularMap: loader.load("/img/SpecularMap.png"),
  bumpMap: loader.load("/img/NormalMap.png"),
  bumpScale: 0.04,
});
const moonMesh = new THREE.Mesh(geometry, material);
moonGroup.add(moonMesh);

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

function animate() {
  requestAnimationFrame(animate);

  moonMesh.rotation.y += 0.002;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
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