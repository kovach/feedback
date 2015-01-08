var _ = require('underscore');
var exec = require('../base/io-obj');

var check = function(filename) {
  return exec('ghc-mod check ' + filename);
}

var parseLine = function(str) {
  var parts = str.split(":");
  var file = parts[0];
  var line = parts[1];
  var col = parts[2];
  var type = parts[3];
  var rest = parts.slice(4).join("\n");

  return {line: line, column: col, error: str};
}
var parseGHCMod = function(str) {
  var lines = str.split('\n');
  return _.map(_.filter(lines, function(line) {
    return line.length > 0;
  }), parseLine);
}

module.exports = {
  check: check,
  parse: parseGHCMod,
}
