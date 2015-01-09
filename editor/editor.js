var obj = require('../base/obj');

// Global state
var editor;

// Called when buffer changes from user input
var update = function() {
}

//var tabKeyBinding = function(cm) {
//  var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
//  cm.replaceSelection(spaces);
//}

var mkKeys = function(o) {
  var extraKeys = {
    //Tab: tabKeyBinding,
    Esc: function() { o.handle({tag: 'special-key', key: 'esc'}); },
    Tab: function() { o.handle({tag: 'special-key', key: 'tab'}); },
    'Ctrl-Enter': function() { o.handle({tag: 'special-key', key: 'ctrl-enter'}); },
    'Ctrl-Space': function() { o.handle({tag: 'special-key', key: 'ctrl-space'}); },
  }

  return extraKeys;
}

var fillHeight = function(cm) {
  var height = document.documentElement.clientHeight; 
  var width = document.documentElement.clientWidth; 
  cm.getWrapperElement().style.height = (0.9 * height) + 'px'; 
  cm.getWrapperElement().style.width  = (0.48 * width) + 'px'; 
  cm.refresh(); 
}

var makeMirror = function(id) {
  var o = new obj();

  var elem = document.getElementById(id);

  var cm =
    CodeMirror.fromTextArea(elem, {
      value: "",
      gutters: ['error-gutter'],
    });
  
  o.add({
    'set': function(msg) {
      cm.setValue(msg.val);
    },
    'append': function(msg) {
      //var current = cm.getValue();
      //cm.setValue(current + '\n' + msg.val);
      cm.setValue(msg.val);
    },
    'set-cursor': function(msg) {
      cm.setCursor({line: msg.position.line - 1, ch: msg.position.column - 1});
    },
  });

  fillHeight(cm);
  $(window).resize(function() {
    fillHeight(cm);
  });
  //cm.setSize(700);

  // Hide away the CM
  o.cm = cm;
  return o;
}

var makeDisplay = function(id) {
  var o = makeMirror(id);
  var cm = o.cm;

  cm.setOption('mode', 'markdown');
  cm.setOption('theme', 'solarized dark');
  cm.setOption('readOnly', true);
  cm.setOption('lineWrapping', true);

  return o;
}

var makeEditor = function(id) {
  var o = makeMirror(id);
  var cm = o.cm;

  cm.setOption('mode', 'haskell');
  cm.setOption('theme', 'solarized dark');
  cm.setOption('matchBrackets', true);
  cm.setOption('keyMap', 'emacs');

  //var editor =
  //  CodeMirror.fromTextArea(
  //      elem,
  //      { value: "",
  //        mode:  "haskell",
  //        matchBrackets: true,
  //        keyMap: "emacs",
  //        //keyMap: "default",
  //        showCursorWhenSelecting: true,
  //        theme: "solarized dark",
  //      });

  cm.setOption("extraKeys", mkKeys(o));

  // Needed for backspace
  cm.on('keyHandled', function(cm) {
    o.handle({
      tag: 'edit',
      cm: cm,
    });
  });

  // Needed for edit events
  cm.on('inputRead', function(cm) {
    o.handle({
      tag: 'edit',
      cm: cm,
    });
  });

  cm.focus();

  return o;
}

module.exports = {
  makeEditor: makeEditor,
  makeDisplay: makeDisplay,
}
