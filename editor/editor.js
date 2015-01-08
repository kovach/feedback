var obj = require('../base/obj');

// Global state
var editor;

// Called when buffer changes from user input
var update = function() {
}

var tabKeyBinding = function(cm) {
  var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
  cm.replaceSelection(spaces);
}

var mkKeys = function(o) {
  var extraKeys = {
    Tab: tabKeyBinding,
    Esc: function() {
      o.handle({tag: 'special-key', key: 'esc'});
    },
  }

  return extraKeys;
}

var makeText = function(id) {
  var o = new obj();

  var elem = document.getElementById(id);

  var editor =
    CodeMirror.fromTextArea(
        elem,
        { value: "",
          mode:  "markdown", // ???
          readOnly: true,
          theme: "solarized light",
        });
  editor.setSize(900, "100%");

  o.add({
    'set': function(msg) {
      editor.setValue(msg.val);
    },
  });

  return o;
}

var makeMirror = function(id) {
  var o = new obj();

  var elem = document.getElementById(id);

  var editor =
    CodeMirror.fromTextArea(
        elem,
        { value: "",
          mode:  "haskell",
          matchBrackets: true,
          keyMap: "emacs",
          //keyMap: "default",
          showCursorWhenSelecting: true,
          theme: "solarized dark",
        });

  editor.setOption("extraKeys", mkKeys(o));

  editor.setSize(600, "100%");
  //editor.getWrapperElement().style.height = 
  //  0.95 * document.documentElement.clientHeight + 'px';
  editor.refresh();

  // Needed for backspace
  editor.on('keyHandled', function(cm) {
    o.handle({
      tag: 'edit',
      cm: cm,
    });
  });
  // Needed for edit events
  editor.on('inputRead', function(cm) {
    o.handle({
      tag: 'edit',
      cm: cm,
    });
  });

  o.add({
    'set': function(msg) {
      editor.setValue(msg.val);
    },
    'set-cursor': function(msg) {
      editor.setCursor({line: msg.position.line - 1, ch: msg.position.column - 1});
    },
  });

  editor.focus();

  return o;
}

module.exports = {
  makeMirror: makeMirror,
  makeText: makeText,
}
