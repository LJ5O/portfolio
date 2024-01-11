import $ from 'jquery';

let optionalFunction;

//Showing notification
export function showNotification(HTMLText, optionalEnterKeyFunction) {
  //If optionalEnterKeyFunction is defined, we enable Enter key
  if (optionalEnterKeyFunction && typeof optionalEnterKeyFunction === 'function') {
    optionalFunction = optionalEnterKeyFunction;
  }

  $("#notification_bar p").html(HTMLText);
  $("#notification_bar").css('opacity', 0.9).animate({
    width: 320
  }, 500);
}

//Hiding function
export function hideNotification() {
  $("#notification_bar").animate({
    width: 0
  }, 500, function () {
    $(this).css('opacity', 0);
    //This will disable the Enter key
    optionalFunction = undefined;
  });
}

//Event listener on Enter key (13)
$(document).on('keyup', function (e) {
  if (e.which === 13 && optionalFunction) {
    optionalFunction();
  }
});

export function openLink(link) {
  if (!link) {
    console.error("No link given !");
    return;
  }

  window.open(link, '_blank');
}