#!/usr/bin/env node
'use strict';

var express =  require('express'),
    app = express(),
    exec = require('child_process').exec,
    crawl = require('./src/build');

var data = crawl(process.argv[2]);

app.get('/', function(req, res) { res.sendFile(__dirname + '/index.html'); })
app.get('/data', function(req, res) { res.send(JSON.stringify(data)); });

app.use(express.static(__dirname + '/'));

var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  var host = server.address().address;
  console.log('Go to -> http://localhost:%s', port);
  exec('open http://localhost:' + port);
});
