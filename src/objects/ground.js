//ground
import * as THREE from 'three';

export function createGround() {
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0xa3c973 });
  const plane = new THREE.Mesh(geometry, material);

  return plane;
}
