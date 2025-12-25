import * as THREE from 'three';
import { noise } from './terrain.js';

export class RoadChunk {
    constructor(zOffset, size) {
        this.size = size;
        const geometry = new THREE.PlaneGeometry(12, size, 1, 10);
        geometry.rotateX(-Math.PI / 2);
        
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2] + zOffset;
            // Align road to terrain but slightly higher
            vertices[i + 1] = noise(x, z) + 0.1; 
        }

        const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.z = zOffset;
    }
}
