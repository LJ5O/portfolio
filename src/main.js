import * as THREE from 'three';
import { getCamera } from './cameras/PerspectiveCamera.js';
import {addAssetsOnScene} from './utils/addAssetsOnScene.js';
import * as PlayerMovement from './utils/playerMovement.js';
import * as Animations from './utils/animateMesh.js';
import * as PlayerCollisions from './utils/playerCollisions.js';

// Function used to start Threejs, called from index.html
// Quality is the percentage of props to place. Ex : "0.8"
function startThreeJS(quality){
  let Clock = new THREE.Clock();
  THREE.Cache.enabled = true;//So we can request several time the same file without worrying : https://threejs.org/docs/#api/en/loaders/FileLoader

  const APP_DEBUG = false;//Turn true to show player position in browser console

  /* --------------------- */
  /* |  SCENE CREATION   | */
  /* --------------------- */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0EB1D2);
  const camera = getCamera();

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //Here, we create/load every asset used, and add it in the scene
  addAssetsOnScene(scene, quality).then(assets => {

    /* --------------------- */
    /* |      MOVEMENT     | */
    /* --------------------- */
    // Events to listen keyboard inputs
    document.addEventListener('keydown', PlayerMovement.handleKeyDown);
    document.addEventListener('keyup', PlayerMovement.handleKeyUp);
    PlayerMovement.initPhoneMovement();


    /* --------------------- */
    /* |     ANIMATIONS    | */
    /* --------------------- */
    //We can add an animationMixer on objects, and define ready to play actions on objects
    //https://threejs.org/docs/#api/en/animation/AnimationAction
    Animations.addAnimationMixerOnMesh(assets.player, ["Walk"]);
    Animations.addAnimationMixerOnMesh(assets.nameplateModel, ["Animation"]);assets.nameplateModel.animationActions.Animation.play();
    Animations.addAnimationMixerOnMesh(assets.worldStatue, ["Animation"]);assets.worldStatue.animationActions.Animation.play();
    Animations.addAnimationMixerOnMesh(assets.printerStatue, ["Printing"]);assets.printerStatue.animationActions.Printing.play();


    function animate() {
      requestAnimationFrame( animate );

      if(APP_DEBUG)console.log("Player position X : "+assets.player.scene.position.x+ " Y : "+assets.player.scene.position.y);

      PlayerMovement.updatePlayerPositionAnimation(assets.player, camera, scene);//Updating player position and rotation
      PlayerCollisions.checkPlayerCollisions(assets.player, assets.plates);//Checking collisions with player
      Animations.updateAnimations(Clock.getDelta());//Playing animations

      renderer.render( scene, camera );//Calculating and redering new frame

    }
    console.log("Ready to render scene, placed objects : "+scene.children.length);
    document.stopLoadingAnimation();
    animate();
    
  });
}
document.startThreeJS = startThreeJS; // So I'm sure this function is available in index.html
