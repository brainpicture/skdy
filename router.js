var folder = require('./api/folder');
var upload = require('./api/upload_simple');

exports.process = function(input, req, res, callback) {
  switch (input.pathname) {
    case '/':
    case '/folder':
      folder.process(input, callback);
      break;
    case '/upload':
      upload.process(input, req, callback);
      break;
    default:
      //doing something better
      return false;    
  }
  return true;
}
