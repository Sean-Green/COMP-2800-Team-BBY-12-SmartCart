/**
Credit: Hariom Singh
Link: https://stackoverflow.com/questions/52399940/how-to-add-preloader-loadeing-gif-to-my-website/
Detail: All css code is for the loading screen and is from the website above
*/

$(window).on('load', function() { 
    $('#status').fadeOut(); 
    $('#preloader').delay(700).fadeOut('slow'); 
    $('body').delay(700).css({'overflow':'visible'});
  })
 