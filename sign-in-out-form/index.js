$( "#sign-up-1" ).submit(function( e ) {
    e.preventDefault();
    
    $(".form-1").removeClass("goback");
    $(".form-1").addClass("submitted");
    $(".form-2").removeClass("push");
    $(".form-2").addClass("pull");
  });
  
  $( "#log-in" ).click(function() {  
    $(".form-3").addClass("active");
  });
  
  $( "#go-to-signup" ).click(function() {  
    $(".form-3").removeClass("active");
  });
  
  $( "#back" ).click(function( e ) {
    $(".form-1").removeClass("submitted");
    $(".form-1").addClass("goback");
    $(".form-2").removeClass("pull");
    $(".form-2").addClass("push");
  });