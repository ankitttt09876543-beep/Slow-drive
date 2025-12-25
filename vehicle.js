import * as THREE from 'three';
import { noise } from './terrain.js';

export class Vehicle {
    constructor(scene) {
        this.mesh = new THREE.Group();
        
        // Car Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.6, 2),
            new THREE.MeshPhongMaterial({ color: 0xff4444 })
        );
        body.position.y = 0.5;
        this.mesh.add(body);

        scene.add(this.mesh);
        
        this.speed = 0.6;
        this.rotation = 0;
        this.steering = 0;
    }

    update(input) {
        // Handle Input
        if (input.left) this.steering += 0.01;
        if (input.right) this.steering -= 0.01;
        this.steering *= 0.9; // Friction

        this.mesh.position.x += this.steering;
        this.mesh.position.z -= this.speed;
        
        // Tilt car based on steering
        this.mesh.rotation.y = this.steering * 2;
        this.mesh.rotation.z = -this.steering * 0.5;

        // Stick to terrain height
        const currentHeight = noise(this.mesh.position.x, this.mesh.position.z);
        this.mesh.position.y = currentHeight + 0.1;
    }
}
