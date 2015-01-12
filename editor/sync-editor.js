var D = require('diff');
var makeEditor = require('../editor/editor').makeEditor;
var digest = require('./digest');


var attach = function(editor, output, input, error_display, id) {
  // State
  var old_content = "";

  var current_errors = [];

  editor.add({
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
          input.handle({tag: 'move-to-error'});
          break;
        case 'tab':
          //input.handle({tag: 'move-to-error'});
          break;
        case 'ctrl-space':
          output.handle({tag: 'run-check'});
          break;
      }
    },
  });

  input.add({
    'file': function(msg) {
      old_content = msg.file;
      editor.handle({
        tag: 'set',
        val: msg.file,
      });
    },
    'check-result': function(msg) {
      current_errors = msg.result;
      current_error = -1;
      updateErrors(editor, current_errors, error_display);
      input.handle({tag: 'move-to-error'});
    },
    'move-to-error': function(msg) {
      moveCursorToError(editor, current_errors, ++current_error % current_errors.length);
    },
  });
}

function makeMarker() {
  var marker = document.createElement("div");
  marker.className = 'error-mark';
  //marker.style.color = "#dc322f";
  //marker.style.float = 'right';
  marker.innerHTML = "→";
  return marker;
}
var fixErrorString = function(str) {
  return str.replace(/\u0000/g, '\n') + '\n';
}
var updateErrors = function(editor, new_errors, error_display) {
  var cm = editor.cm;
  var gutter = editor.gutter_name;
  cm.clearGutter(gutter);
  error_display.handle({
    tag: 'set',
    val: '',
  });
  _.each(new_errors, function(error) {
    cm.setGutterMarker(error.line - 1, gutter, makeMarker());
    var str = fixErrorString(error.error);
    error_display.handle({
      tag: 'append',
      val: str,
    });
  });
}

var moveCursorToError = function(editor, errors, index) {
  var error = errors[index];
  if (error !== undefined) {
    editor.handle({
      tag: 'set-cursor',
      position: {line: error.line, column: error.column},
    });
  }
}

var makeSyncEditor = function(id, output, input, error_display) {
  var editor = makeEditor(id);
  attach(editor, output, input, error_display, id);
  return editor;
}

module.exports = makeSyncEditor;
