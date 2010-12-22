var fs = require('fs');
var config = require('./config');


var fileCache = {};

var extTable = {
  '.html' : 'text/html',
  '.htm'  : 'text/html',
  '.js'   : 'text/javascript',
  '.css'  : 'text/css',
  '.ico'  : 'image/ico'
};

function writeFile(res, info) {
  if (!info) {
    return false;
  }
  res.writeHead(200, {
    'Content-Type': info[0],
    'Connection': config.connection
  });
  res.end(info[1]);
  return true;
}

function write404(res) {
  res.writeHead(404, {'Status': '404 Not Found'});
  res.end();
}

function readFile(path, res, ext) {
  fs.readFile(path, function (err, data) {
    if (err) {
      if (err.errno == 2) {
        write404(res);
        return;
      } else {
        console.log(err);
      }
    }
    var type = extTable[ext];
    var info = [type, data];
    writeFile(res, info);
    fileCache[path] = [type, data];
    fs.watchFile(path, function(curr, prev) {
      fs.unwatchFile(path);
      delete fileCache[path];
    });
  });
}

exports.process = function(input, req, res) {
  var extIndex = input.pathname.lastIndexOf('.');
  if (extIndex == -1) {
    return false;
  }
  var ext = req.url.substr(extIndex).toLowerCase();
  if (ext) {
    if (input.pathname[0] != '/') {
      input.pathname = '/'+input.pathname;
    }
    var path = __dirname+'/static'+input.pathname;
    
    if (!writeFile(res, fileCache[path])) {
      readFile(path, res, ext);
    }
    return true;
  }
}
