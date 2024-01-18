import $ from 'jquery';

//Show picture :
export function showPicture(link){
  $("#picture_zoom img").attr("src", link);
  $("#picture_zoom").fadeIn(400);
}
//Hide picture :
export function hidePicture(){
  $("#picture_zoom").fadeOut(400);
}