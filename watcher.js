#!/usr/bin/env node

// Just make stuff done

var config = require('./config');

var net = require('net');

var util = require('util');

var fs = require('fs');

//var gc = require('./gc');

var childProccess = require('child_process');

var netBindings = process.binding('net');
var fd = netBindings.socket('tcp4');

netBindings.bind(fd, config.port);
netBindings.listen(fd, 128);

function startWorker(type) {
  var fds = netBindings.socketpair();
  var child = childProccess.spawn(
    process.argv[0],
    [__dirname+'/'+type+'.js', '--child'],
    undefined,
    [fds[1], -1, -1]
  );
  if (!child.stdin) {
    child.stdin = new net.Stream(fds[0], 'unix');
  }
  child.stdin.write('tcp', "ascii", fd);
  
  child.stderr.addListener('data', function(data) {
    util.puts(data);
  });  
  child.stdout.addListener('data', function(data) {
    util.puts(data);
  });
  return child;
}

var curWorker = startWorker('http');

var sourceChanged = function(prev, cur) {
  setTimeout(function() {
    var oldWorker = curWorker;
    curWorker = startWorker('http');
    oldWorker.kill('SIGTERM');
  }, 500);
};

fs.watchFile(__dirname, sourceChanged);
fs.watchFile(__dirname+'/api', sourceChanged);

util.puts('go to the http://127.0.0.1:'+config.port);

process.addListener('exit', function () {
  console.log('exit');
});
