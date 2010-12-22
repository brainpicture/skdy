var fs  = require('fs');
var util  = require('util');


var regs = {
  boundary: new RegExp('\\-\\-([a-zA-Z0-9]+)'),
  header: new RegExp('([a-zA-Z0-9\\-_]+)\\s?:\\s?([a-zA-Z0-9\\-_]+)'),
  headerVar: new RegExp('([a-zA-Z0-9\\-_]+\\s?=\\s?\'?"?[a-zA-Z0-9\\-_]+)\'?"?', 'g'),
  headerParam: new RegExp('([a-zA-Z0-9\\-_]+)\\s?=\\s?\'?"?([a-zA-Z0-9\\-_]+)\'?"?')
}



exports.process = function(path, query, req, callback) {
  console.log('process');
  //req.setEncoding('binary');
  
  console.log(path);
  console.log(query);
  
  var lastPart = '';
  
  var mode = 0; // reading boundaries
  var boundary = '';
  
  var params = {};
  
  var tmpBuffer = '';
  
  var ended = false;
  
  var firstLine = false;
  
  var writeFile = function(l) {
    tmpBuffer += l;
  }
  
  var closeFile = function() {
    ended = true;
  }
  
  var openFile = function(params) {
    console.log(params);
    if (!params || !params.filename) {
      return;
    }
    
    fs.open(query.path + params.filename, 'w+', 0666, function(err, fd) {
      if (err) throw err;
      console.log('opened '+query.path + params.filename);
      if (tmpBuffer) {
        l = new Buffer(tmpBuffer, 'binary');
        fs.write(fd, l, 0, l.length, 0);
      }
      if (ended) {
        fs.close(fd);
        return;
      }
      writeFile = function(l) {
        l = new Buffer(l);
        fs.write(fd, l, 0, l.length, 0);
      }
      closeFile = function() {
        fs.close(fd);
        return;
      }
    })
  }
  
  var parseLine = function(l) {
    switch (mode) {
      case 0:
        var found = l.match(regs.boundary);
        if (found) {
          mode = 1;
          boundary = found[1];
        }
        break;
      case 1:
        var found = l.match(regs.headerVar);
        for (var k in found) {
          var param = found[k].match(regs.headerParam);
          if (param) {
            params[param[1]] = param[2];
          }
        }
        if (!l || l == '\r') {
          mode = 2;
          openFile(params);
        }
        break;
      case 2:
        console.log({text:l});
        if (l == '\r') {
          
        } else if (l == '--'+boundary+'--') {
          console.log('OEFFFFF');
          mode = 1;
        } else if (!firstLine) {
          firstLine = true;
          writeFile(l);
        } else {
          writeFile('\n'+l);
        }
        
        break;
    }
  }
  
  
  req.addListener('data', function(part) {
    util.puts(part);
    return;
    var lines = (lastPart + part).split('\n');
    if (lines.length > 0) {
      lastPart = lines.pop();
      for (var i in lines) {
        parseLine(lines[i]);
      }
    }

/*    for (var i = 0; i < part.length; i++) {
      if (i<20)util.puts(buf[i]);
    }*/

      // chunk could be appended to a file if the uploaded file needs to be saved
  });
  req.addListener('end', function() {
    parseLine(lastPart);
    closeFile();
    /*res.sendHeader(200, {'Content-Type': 'text/plain'});
    res.sendBody('Thanks for playing!');
    res.finish();
    sys.puts("\n=> Done");*/
  });
}
