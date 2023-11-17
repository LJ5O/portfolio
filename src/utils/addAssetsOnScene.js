import * as THREE from 'three';
import * as MathUtils from 'three/src/math/MathUtils.js';
import { createGround } from '../objects/ground.js';
import {loadModel} from './import.js';


function alignGround(ground, MovingObject) {
    /*Function used to place an object on top of another object. In fact, this is used only to place correctly objects on the ground*/
    const boundingBoxGround = new THREE.Box3().setFromObject(ground);
    const boundingBoxMovingObject = new THREE.Box3().setFromObject(MovingObject);

    const groundHeight = boundingBoxGround.max.z - boundingBoxGround.min.z;
    const objectHeight = boundingBoxMovingObject.max.z - boundingBoxMovingObject.min.z;

    // Calculating offset, so this function can work with every center position
    const verticalOffset = (boundingBoxMovingObject.max.z + boundingBoxMovingObject.min.z) / 2;
    MovingObject.position.z = boundingBoxGround.max.z - verticalOffset + objectHeight / 2;
}


export async function addAssetsOnScene(scene){
    /*This function takes the scene as arg, and is used to load everything needed on the terrain.
    Player, trees, fences, and everything displayed on the screen is added by this function, at the right place
    
    Will return an object containing created objects*/

    scene.add(new THREE.AmbientLight(0x404040, 50));//Light, required to see

    const ground = createGround();
    scene.add(ground);

    /* --------------------
         ADDING FENCES
        -------------------- */
    const groundHitBox = new THREE.Box3().setFromObject(ground); // Calculating ground size
    const groundXSize = groundHitBox.max.x - groundHitBox.min.x;
    const groundySize = groundHitBox.max.y - groundHitBox.min.y;

    let fences = [];//List of created fences
    const fenceModel = await loadModel('src/objects/models/fence.gltf');

    //Getting width of one fence
    fenceModel.scene.scale.set(0.05, 0.05, 0.05);
    fenceModel.scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(90));
    const fenceHitBox = new THREE.Box3().setFromObject(fenceModel.scene);
    const fenceWidth = fenceHitBox.max.y - fenceHitBox.min.y;

    for(let i = 0; i<groundXSize; i=i+fenceWidth){
        let fence1 = await loadModel('src/objects/models/fence.gltf');//Loading fences ( saved in cache, so file is loaded one time only )
        let fence2 = await loadModel('src/objects/models/fence.gltf');//This loop will create the 4 walls of fences around the ground
        let fence3 = await loadModel('src/objects/models/fence.gltf');
        let fence4 = await loadModel('src/objects/models/fence.gltf');

        fence1.scene.scale.set(0.05,0.05,0.05);
        fence2.scene.scale.set(0.05,0.05,0.05);
        fence3.scene.scale.set(0.05,0.05,0.05);
        fence4.scene.scale.set(0.05,0.05,0.05);

        fence1.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));//Must be standing up
        fence2.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));
        fence1.scene.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));//And correctly rotated for that face
        fence2.scene.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));

        fence3.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));
        fence4.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));

        fence1.scene.position.y = groundHitBox.max.y;//TOP SIDE
        fence1.scene.position.x = groundHitBox.min.x + i;

        fence2.scene.position.y = groundHitBox.min.y;//BOTTOM SIDE
        fence2.scene.position.x = groundHitBox.max.x - i;

        fence3.scene.position.y = groundHitBox.min.y + i ;//RIGHT SIDE
        fence3.scene.position.x = groundHitBox.max.x;

        fence4.scene.position.y = groundHitBox.max.y - i;//LEFT SIDE
        fence4.scene.position.x = groundHitBox.min.x;

        alignGround(ground, fence1.scene);
        alignGround(ground, fence2.scene);
        alignGround(ground, fence3.scene);
        alignGround(ground, fence4.scene);

        scene.add(fence1.scene);
        scene.add(fence2.scene);
        scene.add(fence3.scene);
        scene.add(fence4.scene);

        fences.push(fence1);
        fences.push(fence2);
        fences.push(fence3);
        fences.push(fence4);
    }


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