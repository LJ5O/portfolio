import $ from 'jquery';

export function showNotification(HTMLText){
  $("#notification_bar p").html(HTMLText);
  $("#notification_bar").css( 'opacity', 0.9 ).animate({
    width:320
  }, 500);
}