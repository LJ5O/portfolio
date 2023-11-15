import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadModel(path) {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        resolve(gltf);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
