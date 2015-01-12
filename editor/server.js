var _ = require('underscore');
var startServer = require('../base/server');
var fs = require('fs');
var D = require('diff');
var digest = require('./digest');
var Checker = require('./checker');

// Global state
var files = {};

var launchTmux = function() {
  var name = _.uniqueId();
  // TODO
}

var start = function(port, filename) {
  var server = startServer(port);

  server.add({
    // {id, input, output}
    'connection': function(msg) {
      var client_id = msg.id;
      var input = msg.input;
      var output = msg.output;

      // TODO accept filename from client
      var filename = "test.hs";
      if (filename !== undefined) {
        file = fs.readFileSync(filename, {encoding: 'utf8'});
      } else {
        filename = "";
        file = "";
      }
      files[filename] = file;

      // Respond to diff messages from client by updating file
      input.add({
        // Update the file
        'diff': function(msg) {
          var old = files[filename];
          var old_hash = digest(old);
          if (old_hash === msg.previous) {
            var current = D.applyPatch(old, msg.diff);
            files[filename] = current;
            console.log('edit from ', client_id);
            fs.writeFileSync(filename, current);
          } else {
            // File mismatch
            console.log(msg.previous, " ", old_hash);
            console.log('mismatch!');
          }
        },
        // Do checking
        'run-check': function(msg) {
          Checker.check(filename).add({
            'done': function(msg) {
              // Send result to client
              output.handle({
                tag: 'check-result',
                result: Checker.parse(msg.out),
              });
            },
            'err': function(msg) {
              console.log('ghc-mod error: ', msg.error);
            },
          });
        },
      });

      // Send initial value of file
      output.handle({
        tag: 'file',
        file: file,
      });
    },
  });


}

start(2222, process.argv[2]);
