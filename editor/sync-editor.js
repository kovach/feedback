var D = require('diff');
var makeEditor = require('../editor/editor').makeMirror;
var digest = require('./digest');


var attach = function(obj, output, input, errorBox, id) {
  var old_content = "";
  obj.add({
    // Send diff to server
    'edit': function(msg) {
      var cm = msg.cm;
      var content = cm.getValue();
      if (old_content !== content) {
        var patch = D.createPatch("", old_content, content);
        var msg = {
          tag: 'diff',
          diff: patch,
          previous: digest(old_content),
          id: id,
        }

        old_content = content;
        output.handle(msg);
      }
    },
    'special-key': function(msg) {
      switch (msg.key) {
        case 'esc':
          output.handle({tag: 'run-check'});
          break;
      }
    },
  });

  input.add({
    'file': function(msg) {
      old_content = msg.file;
      obj.handle({
        tag: 'set',
        val: msg.file,
      });
    },
    'check-result': function(msg) {
      console.log(msg.result);
      var err = msg.result[0];
      if (err !== undefined) {
        obj.handle({
          tag: 'set-cursor',
          position: {line: err.line, column: err.column},
        });
        // Display error
        errorBox.handle({
          tag: 'set',
          val: err.error,
        });
      } else {
        errorBox.handle({
          tag: 'set',
          val: '',
        });
      }
      //document.getElementById('errors').value = "";
      //_.each(msg.result, function(err) {
      //  document.getElementById('errors').value += err.error;
      //});
    },
  });
}

var makeSyncEditor = function(id, output, input, errorBox) {
  var obj = makeEditor(id);
  attach(obj, output, input, errorBox, id);
  return obj;
}

module.exports = makeSyncEditor;
