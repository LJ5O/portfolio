//ground
import * as THREE from 'three';

export function createGround(height, width) {
  const geometry = new THREE.PlaneGeometry(height, width);
  const material = new THREE.MeshBasicMaterial({ color: 0xa3c973 });
  const plane = new THREE.Mesh(geometry, material);

  return plane;
}
