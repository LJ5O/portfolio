//https://medium.com/geekculture/how-to-control-three-js-camera-like-a-pro-a8575a717a2

import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

let controls;
export function enableFreeCam(camera, renderer){
    controls = new FlyControls( camera, renderer.domElement );
    controls.movementSpeed = 5;
    controls.rollSpeed = Math.PI / 48;
    controls.autoForward = false;
    controls.dragToLook = true;   
}

export function updateFreeCamKeys(){
    controls.update(0.01)
}