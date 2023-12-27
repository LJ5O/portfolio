import * as THREE from 'three';
import * as MathUtils from 'three/src/math/MathUtils.js';

export function getCamera(){
    /* Function to create and place the Camera object. is freecam is true, it will enable freecam controls for easier debug*/
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    camera.position.x = 0;// <----->
    camera.position.y = -4;// ^^ / vv
    camera.position.z = 4;// ^-----v
    //camera.position.set(10,0.36 -4,0 +4);
    camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(40));

    return camera;
}