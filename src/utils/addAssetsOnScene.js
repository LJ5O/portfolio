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

    alignGround(ground, fenceModel.scene);

    for(let i = 0; i<groundXSize; i=i+fenceWidth){
        let fence1 = fenceModel.scene.clone()
        let fence2 = fenceModel.scene.clone()
        let fence3 = fenceModel.scene.clone()
        let fence4 = fenceModel.scene.clone()

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

        scene.add(fence1);
        scene.add(fence2);
        scene.add(fence3);
        scene.add(fence4);

        fences.push(fence1);
        fences.push(fence2);
        fences.push(fence3);
        fences.push(fence4);
    }

    //Small garden
    //Everything here was carefully adjusted for the given size, modifying this would require more adjustements on fences position
    const smallGardenTopLeftCorner = {x:4.56, y:-18}
    const smallGardenHeight = 11*fenceWidth;
    const smallGardenWidth = 7*fenceWidth;

    for(let i = 0; i<smallGardenHeight; i=i+fenceWidth){ //Y axis
        const fence1 = fenceModel.scene.clone();
        const fence2 = fenceModel.scene.clone();

        fence1.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));//Correctly rotated for that face
        fence2.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(90));

        fence1.position.x = smallGardenTopLeftCorner.x + i;
        fence1.position.y = smallGardenTopLeftCorner.y;
        fence2.position.x = smallGardenTopLeftCorner.x - i + smallGardenHeight;
        fence2.position.y = smallGardenTopLeftCorner.y + smallGardenWidth;

        scene.add(fence1);
        fences.push(fence1);
        if(i+fenceWidth<smallGardenHeight){
            scene.add(fence2);//We don't place the last one, that's the entrance
            fences.push(fence2);
        }
    }
    const stopValue = smallGardenWidth-fenceWidth;//Was adjusted so the fences fit perfectly
    for(let i = 0; i<stopValue; i=i+fenceWidth){ //X axis
        const fence1 = fenceModel.scene.clone();
        const fence2 = fenceModel.scene.clone();

        fence1.position.y = smallGardenTopLeftCorner.y + i;
        fence1.position.x = smallGardenTopLeftCorner.x - fenceWidth + 0.2;
        fence2.position.y = smallGardenTopLeftCorner.y - i + smallGardenWidth - fenceWidth;
        fence2.position.x = smallGardenTopLeftCorner.x + smallGardenHeight;

        if(i+fenceWidth<stopValue){
            scene.add(fence1);
            fences.push(fence1);
        }
        scene.add(fence2);
        fences.push(fence2);
    }

    /* --------------------
       ADDING PATHs
        -------------------- */
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

        scene.add(pathUp);
        scene.add(pathLeft);
        scene.add(pathDown);
        scene.add(pathRight);

        pathTiles.push(pathUp);
        pathTiles.push(pathLeft);
        pathTiles.push(pathDown);
        pathTiles.push(pathRight);
    }

    //Small garden paths :
    const gardenStartOfRoad = {x:3.8, y:-8.7};
    for(let i = 0; i<3; i++){
        const pathClone = pathTilesModel.scene.clone();
        pathClone.rotateOnWorldAxis(new THREE.Vector3(0,0,1), MathUtils.degToRad(45));
        pathClone.position.y = gardenStartOfRoad.y - i*(pathTileWidth - (pathTileWidth*Math.sqrt(2) - pathTileWidth)/2 - 0.2);//As we rely on diagonal size instead of width, we calculate the size of the diagonal, minus the width to get
        pathClone.position.x = gardenStartOfRoad.x + i*(pathTileWidth - (pathTileWidth*Math.sqrt(2) - pathTileWidth)/2 - 0.2);//the exceding size of the diagonal. The center is in the middle, so we divise by 2. Finally, -0.2 is removed, so it fit perfectly

        scene.add(pathClone);
    }
    /* --------------------
    ADDING TREES
    -------------------- */
    const treeOakModel = await loadModel('src/objects/models/tree1.gltf');
    const treeAppleOakModel = await loadModel('src/objects/models/tree2.gltf');
    const treeSakuraModel = await loadModel('src/objects/models/tree3.gltf');
    const treePineModel = await loadModel('src/objects/models/tree4.gltf');

    function prepareTree(treeModel){
        //Small function to apply every neccessary transformation on trees before placing them
        treeModel.scene.scale.set(0.28,0.28,0.28);
        treeModel.scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(90));
        alignGround(ground, treeModel.scene);
    }
    prepareTree(treeOakModel);
    prepareTree(treeAppleOakModel);
    prepareTree(treeSakuraModel);
    prepareTree(treePineModel);

    const forestPinesLocations = [{x:-3,y:-3}, {x:-4,y:-5.9}, {x:-6.5,y:-4.3}, {x:-9.1,y:-3.1}, {x:-12.8,y:-4.35}, {x:-15.7,y:-3.3}, {x:-19.6,y:-2.6}, {x:-22.2,y:-5.3}, {x:-9.7,y:-6.2}
        , {x:-15.7,y:-7}, {x:-18.9,y:-5.8}, {x:-20.8,y:-8.5}, {x:-17.5,y:-9.6}, {x:-12.9,y:-8.45}, {x:-9.76,y:-9.6}, {x:-20.8,y:-8.5}, {x:-6.75,y:-8.25}, {x:-23,y:-10.5}
        , {x:-21,y:-11.9}, {x:-2.9,y:-8.4}, {x:-18.6,y:-12.4}, {x:-15,y:-10.8}, {x:-11.9,y:-8.4}, {x:-11.9,y:-10.8}, {x:-9,y:-12.45}, {x:-5,y:-10.3}, {x:-1.87,y:-10.9}
        , {x:-23,y:-14.4}, {x:-20.25,y:-15.7}, {x:-17.7,y:-14.6}, {x:-14.8,y:-14.16}, {x:-13,y:-14.4}, {x:-11,y:-13.2}, {x:-8,y:-14.6}, {x:-6,y:-13}, {x:-3.5,y:-13.9}, {x:-2,y:-15.5}
        , {x:-21.78,y:-17.76}, {x:-18.48,y:-17.6}, {x:-16.17,y:-18.5}, {x:-13.9,y:-16.8}, {x:-10.57,y:-16.3}, {x:-11.6,y:-18.36}, {x:-13.4,y:-20}, {x:-8.3,y:-18}, {x:-5.45,y:-16.6}
        , {x:-3.67,y:-18}, {x:-23.1,y:-20.2}, {x:-20.5,y:-21}, {x:-18.3,y:-20.1}, {x:-16,y:-21.5}, {x:-10.78,y:-21}, {x:-6.3,y:-20.1}, {x:-4,y:-20.8}, {x:-1.8,y:-19.6}
        , {x:-21.9,y:-22.75}, {x:-18.6,y:-22.6}, {x:-14.8,y:-23.3}, {x:-13,y:-22}, {x:-23,y:-14.4}, {x:-11.1,y:-23.1}, {x:-23,y:-14.4}, {x:-8.5,y:-21.8}, {x:-23,y:-14.4}, {x:-7,y:-22.8}
        , {x:-4.1,y:-23.3}, {x:-2.2,y:-22.93}];
        

    forestPinesLocations.forEach(newPos => {
        const pineClone = treePineModel.scene.clone();
        pineClone.position.x = newPos.x;
        pineClone.position.y = newPos.y;
        pineClone.rotation.y = Math.random() * Math.PI * 2;
        scene.add(pineClone);
    });

    /* --------------------
    ADDING LAKE AND STONE WALLS
    -------------------- */



    /* --------------------
    ADDING NAME & JOB
    -------------------- */
    let nameplateModel;
    if(true){//Will be used later for localization
        nameplateModel = await loadModel('src/objects/models/NameFR.gltf');
    }else if(false){
        nameplateModel = await loadModel('src/objects/models/NameJP.gltf');
    }else{
        nameplateModel = await loadModel('src/objects/models/NameEN.gltf');
    }
    nameplateModel.scene.scale.set(0.6,0.6,0.6);
    nameplateModel.scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(60));
    nameplateModel.scene.position.x = 2;
    nameplateModel.scene.position.y = 2;
    alignGround(ground, nameplateModel.scene);
    nameplateModel.scene.position.z += 0.2;

    scene.add(nameplateModel.scene);


    /* --------------------
    ADDING PLAYER
    -------------------- */
    const player = await loadModel('src/objects/models/player.gltf');//Loading player
    player.scene.scale.set(0.2,0.2,0.2);
    alignGround(ground, player.scene);
    player.scene.rotateOnWorldAxis(new THREE.Vector3(1,0,0), MathUtils.degToRad(90));//Must be standing up
    scene.add( player.scene );

    /*const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, -5);
    light.target.position.set(5, 0, -5);
    scene.add(light);
    scene.add(light.target);*/
	
    return {
        ground: ground,
        fenceScenes: fences,
        player: player,
        pathTiles: pathTiles,
        nameplateModel: nameplateModel
    };
}