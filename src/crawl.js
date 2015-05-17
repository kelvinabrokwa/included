'use strict';

var fs = require('fs'),
    path = require('path');

var table = {};
var files = [];
var root = true;

function main(dir) {
  traverse(dir);
  return organize(files);
}

function traverse(dir) {
  if (root) {
    dir = path.resolve(process.cwd(), dir);
    root = false;
  }
  var items = fs.readdirSync(dir)
    .filter(f => { return f[0] !== '.'; })
    .map(f => { return dir + '/' + f; });
 
  for (var i in items) {
    var type = fs.lstatSync(items[i]).isDirectory() ? 'dir' : 'file';
    if (type === 'dir') traverse(items[i]); 
    else files.push(items[i]);
  }
}

function organize(files) {
  var indie = {};
  for (var f in files) {
    var incl = getIncludes(files[f]);
    if (incl)
      indie[files[f]] = incl;
  }
  
  var clean = {};
  Object.keys(indie).forEach(f => {
    clean[fname(f)] = indie[f].map(i => fname(i));
  });
  
  for (var key in indie) {
    var name = fname(key);
    if (!(name in table)) table[name] = key;
    for (var i in indie[key]) {
      var n = fname(indie[key][i]); 
      if (!(n in table)) table[n] = indie[key][i];
    }
  }

  var out = { edges: [] };
  out.nodes = Object.keys(table).map(f => {
    return { data: { id: f } };
  });
  
  for (var orig in clean) {
    for (var i in clean[orig]) {
      var dest = clean[orig][i];
      out.edges.push({
        data: {
          id: orig + dest,
          weight: 1,
          source: orig,
          target: dest
        }
      });
    }
  }
  return out;
}

function getIncludes(file) {
  var includes = fs.readFileSync(file, {encoding: 'utf8'})
    .split('\n')
    .filter(line => { return line.indexOf('#include') === 0 && line.indexOf('<') === -1; })
    .map(line => { return line.match(/["'].+["']/)[0].replace(/["']/g, ''); })
    .map(file => { return path.resolve(file); });
  return includes.length ? includes : false;
}

function fname(full) {
  return full.split('/')[full.split('/').length - 1];
}

module.exports = main;
