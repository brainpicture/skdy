(function(exports, d, b) {

exports.Editor = function(file, bespinContainer) {
  //bespinContainer.innerHTML = file.content;
  b.useBespin(bespinContainer);
}

})(window, document, bespin);
