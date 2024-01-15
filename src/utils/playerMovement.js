import * as THREE from 'three';
import * as MathUtils from 'three/src/math/MathUtils.js';

const PLAYER_SPEED = 0.015;
const ROTATION_SPEED = 0.05; // Vitesse de rotation
const playerDirection = new THREE.Vector3(0, 0, 0);
const playerRotation = new THREE.Quaternion();

//Managing keys
export function handleKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        playerDirection.y = 1; // Up
        break;
      case 'ArrowDown':
      case 'KeyS':
        playerDirection.y = -1; // Back
        break;
      case 'ArrowLeft':
      case 'KeyA':
        playerDirection.x = -1; // Left
        break;
      case 'ArrowRight':
      case 'KeyD':
        playerDirection.x = 1; // Right
        break;
    }
  }
  
  export function handleKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
      case 'ArrowDown':
      case 'KeyS':
        playerDirection.y = 0; // Arrêter le mouvement vertical
        break;
      case 'ArrowLeft':
      case 'KeyA':
      case 'ArrowRight':
      case 'KeyD':
        playerDirection.x = 0; // Arrêter le mouvement horizontal
        break;
    }
  }

  export function updatePlayerPositionAnimation(player, camera, scene) {
    /* Function called in the main loop
        Used to calculate the position and orientation of the player
        Also used to start and stop walking animation 
        Takes player, camera and scene*/

    //COLLIDERS
    const rayDirection = new THREE.Vector3(playerDirection.x, playerDirection.y, 0).normalize();

    //Two rays are created : one for legs, one for torso/head
    const raycaster = new THREE.Raycaster();
    const rayPosition = player.scene.position.clone();
    rayPosition.z = 0.2;//Adjusted by hand, is enough to collide with nearly everything
    raycaster.set(rayPosition, rayDirection);

    const raycaster2 = new THREE.Raycaster();
    const rayPosition2 = player.scene.position.clone();
    rayPosition2.z = 0.9;
    raycaster2.set(rayPosition2, rayDirection);
    
    const intersects = [...raycaster.intersectObjects(scene.children, true), ...raycaster2.intersectObjects(scene.children, true)];//Merging the two lists together, so we get all objects collided by ray1 or 2
    ;
    
    const collidingDistance = 0.5;
    const collisionThreshold = 0.01;
    
    for (let i = 0; i < intersects.length; i++) {
        const collidedObject = intersects[i].object;
    
        // Check if the collided object is not the player itself
        if (!player.scene.children.includes(collidedObject)) {
            if (intersects[i].distance > collisionThreshold && intersects[i].distance < collidingDistance) {
                // Valid colliding object, not too close (player leg/arm), but not too far
                /*console.log(collidedObject);
                console.log(intersects[i].distance);*/
                playerDirection.set(0, 0, 0);
                break;
            }
        }
    }

    //MOVING
    const delta = playerDirection.clone().multiplyScalar(PLAYER_SPEED);
    player.scene.position.add(delta);
    camera.position.add(delta);//The camera must follow the player

    //ANIMATING
    if (playerDirection.length() > 0) {//If a movement key is pressed ( or something in playerDirection )
        if(!player.animationActions.Walk.isRunning()) player.animationActions.Walk.play();//Playing walk animation

        const angle = Math.atan2(playerDirection.x, -playerDirection.y);//Get the angle between center (0;0) and the coordinates, which are directly provided by the pressed keys
        const targetRotation = new THREE.Quaternion();
        
        targetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        playerRotation.slerp(targetRotation, ROTATION_SPEED);//Slowly moving from playerRotation to targetRotation
        player.scene.setRotationFromQuaternion(playerRotation);
        player.scene.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), MathUtils.degToRad(90));//Used to force the player to be standing up instead of sleeping
    }else{
        if(player.animationActions.Walk.isRunning()) player.animationActions.Walk.stop();//Not walking, we can stop this animation
    }
  }