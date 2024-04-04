'use strict';
// Small script used for the loading screen

import $ from 'jquery';

async function loadingOneCycle(){
  $("#loading").fadeOut(600, ()=>{
    $("#loading").fadeIn(600);
  })
};

let timeoutID;
function startLoadingAnimation(){
  timeoutID = setInterval(loadingOneCycle, 200);
}

function stopLoadingAnimation(){
  clearInterval(timeoutID);
}
document.startLoadingAnimation = startLoadingAnimation;//So that's accessible from everywhere
document.stopLoadingAnimation = stopLoadingAnimation;