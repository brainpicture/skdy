var fs  = require('fs');
var util  = require('util');
var formidable = require('../lib/formidable');




exports.process = function(path, query, req, callback) {
  var form = new formidable.IncomingForm();
  form.uploadDir = './';
  form.addListener('field', function() {
    console.log('here');
    console.log(arguments); 
  })
  form.parse(req, function(err, fields, files) {
    console.log(fields);
    console.log(files);
  });
  
}
