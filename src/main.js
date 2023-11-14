import * as THREE from 'three';
import * as MathUtils from 'three/src/math/MathUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {createGround} from './objects/ground.js';
import {alignGround} from './utils/placement.js';
import * as Freecam from './cameras/freecam.js';
let Clock = new THREE.Clock();
console.log("OK")

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0EB1D2);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Freecam
Freecam.enableFreeCam(camera, renderer);

const ground = createGround();
scene.add(ground);

const loader = new GLTFLoader();
let mixer, clip, action, playerModel;

loader.load( './src/objects/models/player.gltf', function ( gltf ) {
  playerModel = gltf;
  gltf.scene.scale.set(0.2,0.2,0.2);
  //gltf.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(-90));
  alignGround(ground, gltf.scene);
	scene.add( gltf.scene );
  
  mixer = new THREE.AnimationMixer( gltf.scene );
  clip = THREE.AnimationClip.findByName( gltf.animations, 'Walk' );
  action = mixer.clipAction( clip );

}, undefined, function ( error ) {

	console.error( error );

} );

scene.add(new THREE.AmbientLight(0x404040, 50));

camera.position.x = 0;// <----->
camera.position.y = -4;// ^^ / vv
camera.position.z = 4;// ^-----v
camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(60));

/* ----- -*
MOVEMENT
-----------*/

const PLAYER_SPEED = 0.015;
const playerDirection = new THREE.Vector3(0, 0, 0);
const playerRotation = new THREE.Quaternion();

// Events to listen keyboard inputs
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

//Managing keys
function handleKeyDown(event) {
  action.play();
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      playerDirection.y = 1; // Up
      break;
    case 'ArrowDown':
    case 'KeyS':
      playerDirection.y = -1; // Back
      break;
    case 'ArrowLeft':
    case 'KeyA':
      playerDirection.x = -1; // Left
      break;
    case 'ArrowRight':
    case 'KeyD':
      playerDirection.x = 1; // Right
      break;
  }
}

function handleKeyUp(event) {
  action.stop();
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
    case 'ArrowDown':
    case 'KeyS':
      playerDirection.y = 0; // Arrêter le mouvement vertical
      break;
    case 'ArrowLeft':
    case 'KeyA':
    case 'ArrowRight':
    case 'KeyD':
      playerDirection.x = 0; // Arrêter le mouvement horizontal
      break;
  }
}

function updatePlayerPosition() {
  const delta = playerDirection.clone().multiplyScalar(PLAYER_SPEED);
  playerModel.scene.position.add(delta);
  camera.position.add(delta);

  const angle = Math.atan2(playerDirection.x, -playerDirection.y);
  const targetRotation = new THREE.Quaternion();
  targetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
  playerRotation.slerp(targetRotation, 0.1);
  playerModel.scene.setRotationFromQuaternion(playerRotation);
  playerModel.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));
}

function animate() {
	requestAnimationFrame( animate );
  if(mixer) mixer.update( Clock.getDelta()*1.4 ); //If mixer ready

  updatePlayerPosition();
  //Freecam.updateFreeCamKeys()//Freecam
	renderer.render( scene, camera );

}
animate();
