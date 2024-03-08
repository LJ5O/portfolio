'use strict';
// Small script used for the menu

import $ from 'jquery';

$("#menu button").on("click", event=>{
    $("#menu").fadeOut(300);
    const quality = $("#quality-select").val();
    console.log(`Starting Three.Js, with quality setting ${quality} !`);
    document.startThreeJS(quality);
});