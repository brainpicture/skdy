#!/usr/bin/env node
var http = require('http');
var net = require('net');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var statics = require('./statics');
var router = require('./router');
var config = require('./config');

var server = http.createServer(function (req, res) {
  var callback = function(data) {
    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Connection': config.connection
    });
    res.end(JSON.stringify(data));
  }
  if (req.url == '/') {
    req.url = '/index.html'
  }
  var input = url.parse(req.url);
  input.query = querystring.parse(input.query);
  if (!statics.process(input, req, res) && !router.process(input, req, res, callback)) {
    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Connection': config.connection
    });
    res.end('Wrong request');
  }
});

process.addListener('SIGTERM', function() {
  util.puts('--------------\nrotated');
  server.close();
  setTimeout(function() {
    process.exit(1);
  }, 5000)
});

var stdin = new net.Stream(0, 'unix');

stdin.addListener('data', function(json) {
});

stdin.addListener('fd', function(fd) {
  server.listenFD(fd, 'tcp4');
});

stdin.resume();
