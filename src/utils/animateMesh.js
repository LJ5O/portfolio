import * as THREE from 'three';

const ANIMATION_SPEED_MULTIPLIER = 1.4;
let mixersToUpdateEachFrame = [];

export function addAnimationMixerOnMesh(mesh, actions){
    //See https://threejs.org/docs/#manual/en/introduction/Animation-system
    /*Function used to add an animationMixer on a mesh, so we can easily start or stop animations
      Takes the animated mesh, and a list of actions names that should become animated */

    const mixer = new THREE.AnimationMixer(mesh.scene);//We create a new mixer to manage every animations on this mesh

    mesh.animationMixer = mixer;//We add this mixer on the mesh
    mesh.animationActions = {};//And create an object that will hold actions
    
    actions.forEach(element => {
        const clip = THREE.AnimationClip.findByName( mesh.animations, element );//For each given action name, we get a clip
        mesh.animationActions[element] = mixer.clipAction(clip);//and save it as an action
    });

    mixersToUpdateEachFrame.push(mixer);
}

export function updateAnimations(deltaSeconds){
    mixersToUpdateEachFrame.forEach(element => {
        element.update(deltaSeconds * ANIMATION_SPEED_MULTIPLIER);
    });
};