var fs  = require('fs');
var util  = require('util');


exports.process = function(input, req, callback) {
  console.log(input.query.path);
  var fstream = fs.createWriteStream(input.query.path);
  
  req.addListener('data', function(part) {
    fstream.write(part);
  });
  req.addListener('end', function() {
    fstream.end();
  });
}
