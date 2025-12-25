import * as THREE from 'three';
import { TerrainChunk } from './terrain.js';
import { RoadChunk } from './road.js';
import { Vehicle } from './vehicle.js';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87ceeb, 20, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1); // Performance optimization
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

const vehicle = new Vehicle(scene);
const chunks = [];
const CHUNK_SIZE = 40;
let lastChunkZ = 0;

function spawnChunk(z) {
    const terrain = new TerrainChunk(z, CHUNK_SIZE);
    const road = new RoadChunk(z, CHUNK_SIZE);
    scene.add(terrain.group);
    scene.add(road.mesh);
    chunks.push({ terrain, road, z });
}

// Initial chunks
for (let i = 0; i < 5; i++) {
    spawnChunk(lastChunkZ);
    lastChunkZ -= CHUNK_SIZE;
}

// Input Handling
const input = { left: false, right: false };
const handleInput = (e, val) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (x < window.innerWidth / 2) input.left = val;
    else input.right = val;
};
window.addEventListener('mousedown', (e) => handleInput(e, true));
window.addEventListener('mouseup', () => input.left = input.right = false);
window.addEventListener('touchstart', (e) => handleInput(e, true));
window.addEventListener('touchend', () => input.left = input.right = false);

// Game Loop
let lastTime = 0;
const fpsLimit = 1000 / 30;

function animate(time) {
    requestAnimationFrame(animate);
    
    if (time - lastTime < fpsLimit) return;
    lastTime = time;

    vehicle.update(input);

    // Camera Follow
    camera.position.set(
        vehicle.mesh.position.x * 0.5,
        vehicle.mesh.position.y + 3,
        vehicle.mesh.position.z + 8
    );
    camera.lookAt(vehicle.mesh.position.x, vehicle.mesh.position.y, vehicle.mesh.position.z - 5);

    // Infinite Chunk Logic
    if (vehicle.mesh.position.z < lastChunkZ + (CHUNK_SIZE * 3)) {
        spawnChunk(lastChunkZ);
        lastChunkZ -= CHUNK_SIZE;
    }

    // Cleanup old chunks
    if (chunks.length > 8) {
        const oldest = chunks.shift();
        scene.remove(oldest.terrain.group);
        scene.remove(oldest.road.mesh);
    }

    renderer.render(scene, camera);
}

animate(0);
