var fs  = require('fs');

exports.process = function(input, callback) {
  if (input.query.path) {
    fs.stat(input.query.path, function(err, stat) {
      if (stat.isDirectory()) {
        fs.readdir(input.query.path, function(err, data) {
          if (!data) data = [];
          data.unshift('../');
          callback({type: 'dir', content: data});
        });
      } else {
        fs.readFile(input.query.path, function (err, data) {
          if (err) throw err;
          callback({type: 'source', content: data.toString()});
        });
      }
    });
  } 
}
