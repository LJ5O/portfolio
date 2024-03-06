'use strict';
// Small script used for the menu

import $ from 'jquery';

$("#menu button").on("click", event=>{
    $("#menu").fadeOut(300);
    document.startThreeJS();
});