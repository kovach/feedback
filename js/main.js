_ = require('underscore');
var client = require('../base/client');
var makeDisplay = require('../editor/editor').makeDisplay;
var makeEditor = require('../editor/sync-editor');

var editHandlers = {
  'edit': function(msg) {
    // console.log('edit: ', msg.cm);
  },
}

io = client(2222);
out1 = makeDisplay("out1");
ed1 = makeEditor("ed1", io.output, io.input, out1);
ed1.add(editHandlers);
