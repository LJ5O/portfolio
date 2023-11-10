import * as THREE from 'three';
import {createGround} from './objects/ground.js';
console.log("OK")

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0EB1D2);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xaabbff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
scene.add(createGround());

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	camera.rotation.x += 0.01;
	renderer.render( scene, camera );
}
animate();
