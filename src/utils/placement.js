import * as THREE from 'three';

export function alignGround(ground, MovingObject){
    const boundingBoxGround = new THREE.Box3().setFromObject(ground);
    const boundingBoxMovingObject = new THREE.Box3().setFromObject(MovingObject);

    const MovingObjectHeight = boundingBoxMovingObject.max.z - boundingBoxMovingObject.min.z;
    MovingObject.position.y = MovingObjectHeight/2 + boundingBoxGround.max.z;
}