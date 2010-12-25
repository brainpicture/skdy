var bwr;
$(document).ready(function() {
  bwr = new Browser($('#files'));
  
  window.onpopstate = function(e) {
    bwr.render('.'+location.pathname, true);
  }
});


