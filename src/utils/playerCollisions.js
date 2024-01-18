import * as THREE from 'three';

export function checkPlayerCollisions(player, objects) {
  if (!player || !player.scene) {
    throw new Error('The player must have a "scene" property.');
  }

  const playerBoundingBox = new THREE.Box3().setFromObject(player.scene);

  for (const object of objects) {
    if (!object) {
      console.warn('An object in the list is not valid. It will be ignored.');
      continue;
    }

    const objectBoundingBox = new THREE.Box3().setFromObject(object);

    //Check if the object is currently inside the hitbox
    const isInsideHitbox = playerBoundingBox.intersectsBox(objectBoundingBox);

    //If the object was outside but is now inside, call onEnterHitbox
    if (isInsideHitbox && !object.isInsideHitbox) {
      if (object.onEnterHitbox && typeof object.onEnterHitbox === 'function') {
        object.onEnterHitbox();
      } else {
        console.warn('The onEnterHitbox method is not defined on an object checked for entering the player\'s hitbox.');
      }
    }

    //If the object was inside but is now outside, call onLeaveHitbox
    else if (!isInsideHitbox && object.isInsideHitbox) {
      if (object.onLeaveHitbox && typeof object.onLeaveHitbox === 'function') {
        object.onLeaveHitbox();
      } else {
        console.warn('The onLeaveHitbox method is not defined on an object checked for leaving the player\'s hitbox.');
      }
    }

    //Update the state for the next check
    object.isInsideHitbox = isInsideHitbox;
  }
}