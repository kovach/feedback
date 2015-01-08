var sha256_ = require('crypto-js/sha256');
var sha256 = function(str) {
  return sha256_(str).toString();
}

module.exports = sha256;
