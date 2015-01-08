var ex = require('child_process').exec;

var obj = require('./obj');
var exec = function(command) {
  var o = new obj();
  ex(command, {encoding: 'utf8'}, function(err, stdout, stderr) {
    if (err !== null) {
      o.handle({
        tag: 'error',
        error: stderr,
      });
    } else {
      o.handle({
        tag: 'done',
        out: stdout,
      });
    }
  });
  return o;
}

module.exports = exec;
