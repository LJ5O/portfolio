import * as THREE from 'three';
import { getCamera } from './cameras/PerspectiveCamera.js';
import {addAssetsOnScene} from './utils/addAssetsOnScene.js';
import * as PlayerMovement from './utils/playerMovement.js';
import * as Animations from './utils/animateMesh.js';
let Clock = new THREE.Clock();

/* --------------------- */
/* |  SCENE CREATION   | */
/* --------------------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0EB1D2);
const camera = getCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Here, we create/load every asset used, and add it in the scene
let assets  = await addAssetsOnScene(scene);

/* --------------------- */
/* |      MOVEMENT     | */
/* --------------------- */
// Events to listen keyboard inputs
document.addEventListener('keydown', PlayerMovement.handleKeyDown);
document.addEventListener('keyup', PlayerMovement.handleKeyUp);

/* --------------------- */
/* |     ANIMATIONS    | */
/* --------------------- */
//We can add an animationMixer on objects, and define ready to play actions on objects
//https://threejs.org/docs/#api/en/animation/AnimationAction
Animations.addAnimationMixerOnMesh(assets.player, ["Walk"]);


function animate() {
	requestAnimationFrame( animate );

  PlayerMovement.updatePlayerPositionAnimation(assets.player, camera);//Updating player position and rotation
  Animations.updateAnimations(Clock.getDelta());//Playing animations

	renderer.render( scene, camera );//Calculating and redering new frame

}
animate();
