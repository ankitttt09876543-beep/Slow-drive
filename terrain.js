import * as THREE from 'three';

// Simple pseudo-random noise
const noise = (x, z) => {
    return Math.sin(x * 0.05) * Math.cos(z * 0.05) * 4 + Math.sin(x * 0.02) * 10;
};

export class TerrainChunk {
    constructor(zOffset, size) {
        this.group = new THREE.Group();
        const geometry = new THREE.PlaneGeometry(100, size, 20, 20);
        geometry.rotateX(-Math.PI / 2);
        
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2] + zOffset;
            vertices[i + 1] = noise(x, z);
        }
        
        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4d7a3a, 
            flatShading: true 
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.z = zOffset;
        this.group.add(this.mesh);
    }
}

export { noise };
