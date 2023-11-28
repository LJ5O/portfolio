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

    /* --------------------
       ADDING GROUND AND FENCES
        -------------------- */
    let fences = [];//List of created fences
    const fenceModel = await loadModel('src/objects/models/fence.gltf');

    //Getting width of one fence
    fenceModel.scene.scale.set(0.05, 0.05, 0.05);
    fenceModel.scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(90));//Must be standing up
    const fenceHitBox = new THREE.Box3().setFromObject(fenceModel.scene);
    const fenceWidth = fenceHitBox.max.y - fenceHitBox.min.y;

    //Creating the ground
    const ground = createGround(35*fenceWidth, 35*fenceWidth);
    scene.add(ground);
    const groundHitBox = new THREE.Box3().setFromObject(ground); // Calculating ground size
    const groundXSize = groundHitBox.max.x - groundHitBox.min.x;
    const groundySize = groundHitBox.max.y - groundHitBox.min.y;

    for(let i = 0; i<groundXSize; i=i+fenceWidth){
        let fence1 = fenceModel.scene.clone()
        let fence2 = fenceModel.scene.clone()
        let fence3 = fenceModel.scene.clone()
        let fence4 = fenceModel.scene.clone()

        fence1.scale.set(0.05,0.05,0.05);
        fence2.scale.set(0.05,0.05,0.05);
        fence3.scale.set(0.05,0.05,0.05);
        fence4.scale.set(0.05,0.05,0.05);

        fence1.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));//Correctly rotated for that face
        fence2.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));

        fence1.position.y = groundHitBox.max.y - 0.25;//TOP SIDE
        fence1.position.x = groundHitBox.min.x + fenceWidth + i;

        fence2.position.y = groundHitBox.min.y + 0.25;//BOTTOM SIDE
        fence2.position.x = groundHitBox.max.x - i;

        fence3.position.y = groundHitBox.min.y + i ;//RIGHT SIDE
        fence3.position.x = groundHitBox.max.x - 0.25;

        fence4.position.y = groundHitBox.max.y - fenceWidth - i;//LEFT SIDE
        fence4.position.x = groundHitBox.min.x + 0.25;

        alignGround(ground, fence1);
        alignGround(ground, fence2);
        alignGround(ground, fence3);
        alignGround(ground, fence4);

        scene.add(fence1);
        scene.add(fence2);
        scene.add(fence3);
        scene.add(fence4);

        fences.push(fence1);
        fences.push(fence2);
        fences.push(fence3);
        fences.push(fence4);
    }

    //Adding Paths
    //Works like fences
    let pathTiles = [];//List of created pathTiles
    const pathTilesModel = await loadModel('src/objects/models/path.gltf');
    pathTilesModel.scene.scale.set(0.2,0.01,0.2);
    pathTilesModel.scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(90));//Must be on the ground
    alignGround(ground, pathTilesModel.scene);

    const pathTileHitbox = new THREE.Box3().setFromObject(pathTilesModel.scene);
    const pathTileWidth = pathTileHitbox.max.y - pathTileHitbox.min.y;

    for(let i = 0; i<(groundXSize-pathTileWidth)/2; i=i+pathTileWidth){//Loop to add all path tiles, except the last
        const pathUp = pathTilesModel.scene.clone();//Vertical
        const pathLeft = pathTilesModel.scene.clone();//Horizontal
        const pathDown = pathTilesModel.scene.clone();
        const pathRight = pathTilesModel.scene.clone();

        pathUp.position.y = i;
        pathLeft.position.x = -i;
        pathDown.position.y = -i;
        pathRight.position.x = i;

        pathLeft.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));//Correctly rotated for that face
        pathRight.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));

        alignGround(ground, pathUp);
        alignGround(ground, pathLeft);
        alignGround(ground, pathDown);
        alignGround(ground, pathRight);

        scene.add(pathUp);
        scene.add(pathLeft);
        scene.add(pathDown);
        scene.add(pathRight);

        pathTiles.push(pathUp);
        pathTiles.push(pathLeft);
        pathTiles.push(pathDown);
        pathTiles.push(pathRight);
    }



    const player = await loadModel('src/objects/models/player.gltf');//Loading player
    player.scene.scale.set(0.2,0.2,0.2);
    alignGround(ground, player.scene);
    player.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));//Must be standing up
    scene.add( player.scene );
	
    return {
        ground: ground,
        fenceScenes: fences,
        player: player,
        pathTiles: pathTiles
    };
}