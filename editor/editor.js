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
    Esc: function() { o.handle({tag: 'special-key', key: 'esc'}); },
    //Tab: function() { o.handle({tag: 'special-key', key: 'tab'}); },
    'Ctrl-Enter': function() { o.handle({tag: 'special-key', key: 'ctrl-enter'}); },
    'Ctrl-Space': function() { o.handle({tag: 'special-key', key: 'ctrl-space'}); },
  }

  return extraKeys;
}

var fillHeight = function(cm) {
  var height = document.documentElement.clientHeight; 
  var width = document.documentElement.clientWidth; 
  cm.getWrapperElement().style.height = (0.95 * height) + 'px'; 
  cm.getWrapperElement().style.width  = (0.48 * width) + 'px'; 
  cm.refresh(); 
}

var makeMirror = function(id) {
  var o = new obj();

  var elem = document.getElementById(id);

  var cm =
    CodeMirror.fromTextArea(elem, {
      value: "",
      theme: solarized().name,
    });
  
  o.add({
    'set': function(msg) {
      cm.setValue(msg.val);
    },
    'append': function(msg) {
      var current = cm.getValue();
      cm.setValue(current + msg.val + '\n');
      //cm.setValue(msg.val);
    },
    'set-cursor': function(msg) {
      cm.setCursor({line: msg.position.line - 1, ch: msg.position.column - 1});
    },
  });

  o.gutter_name = solarized().gutter;
  cm.setOption('gutters', [o.gutter_name]);

  fillHeight(cm);
  $(window).resize(function() {
    fillHeight(cm);
  });
  //cm.setSize(700);

  // Hide away the CM
  o.cm = cm;
  return o;
}

var solarized_light = true;

var solarized = function() {
  if (solarized_light) {
    return {name: 'solarized light', gutter: 'error-gutter-light'};
  } else {
    return {name: 'solarized dark', gutter: 'error-gutter-dark'};
  }
}

var makeDisplay = function(id) {
  var o = makeMirror(id);
  var cm = o.cm;

  cm.setOption('mode', 'markdown');
  cm.setOption('readOnly', true);
  cm.setOption('lineWrapping', true);

  return o;
}

var makeEditor = function(id) {
  var o = makeMirror(id);
  var cm = o.cm;


  cm.setOption('mode', 'haskell');
  cm.setOption('matchBrackets', true);
  cm.setOption('keyMap', 'emacs');
  cm.setOption('smartIndent', true);
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
