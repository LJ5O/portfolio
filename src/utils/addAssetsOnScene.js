import * as THREE from 'three';
import * as MathUtils from 'three/src/math/MathUtils.js';
import { createGround } from '../objects/ground.js';
import {loadModel} from './import.js';


function alignGround(ground, MovingObject){
    /*Function used to place an object on top of another object. In fact, this is used only to place correctly objects on the ground*/
    const boundingBoxGround = new THREE.Box3().setFromObject(ground);
    const boundingBoxMovingObject = new THREE.Box3().setFromObject(MovingObject);

    const MovingObjectHeight = boundingBoxMovingObject.max.z - boundingBoxMovingObject.min.z;
    MovingObject.position.y = MovingObjectHeight/2 + boundingBoxGround.max.z;
}

export async function addAssetsOnScene(scene){
    /*This function takes the scene as arg, and is used to load everything needed on the terrain.
    Player, trees, fences, and everything displayed on the screen is added by this function, at the right place
    
    Will return an object containing created objects*/

    scene.add(new THREE.AmbientLight(0x404040, 50));//Light, required to see

    const ground = createGround();
    scene.add(ground);

    const player = await loadModel('src/objects/models/player.gltf');//Loading player
    player.scene.scale.set(0.2,0.2,0.2);
    alignGround(ground, player.scene);
    player.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));//Must be standing up
    scene.add( player.scene );
	
    return {
        ground: ground,
        player: player,
    };
}