import * as THREE from 'three';
import * as MathUtils from 'three/src/math/MathUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {createGround} from './objects/ground.js';
let Clock = new THREE.Clock();
console.log("OK")

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0EB1D2);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const loader = new GLTFLoader();



let mixer, clip, action;

loader.load( './src/objects/models/player.gltf', function ( gltf ) {

  gltf.scene.scale.set(0.2,0.2,0.2);
  gltf.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));
  gltf.scene.position.z=0.9
	scene.add( gltf.scene );
  
  mixer = new THREE.AnimationMixer( gltf.scene );
  clip = THREE.AnimationClip.findByName( gltf.animations, 'Walk' );
  action = mixer.clipAction( clip );
  action.play();

}, undefined, function ( error ) {

	console.error( error );

} );

scene.add(createGround());
scene.add(new THREE.AmbientLight(0x404040, 50));

camera.position.x = 0;// <----->
camera.position.y = -4;// ^^ / vv
camera.position.z = 4;// ^-----v
camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(60));

function animate() {
	requestAnimationFrame( animate );
  if(mixer) mixer.update( Clock.getDelta() ); //If mixer ready
	renderer.render( scene, camera );

}
animate();
