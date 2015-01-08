_ = require('underscore');
var client = require('../base/client');
var makeText = require('../editor/editor').makeText;
var makeMirror = require('../editor/sync-editor');

var editHandlers = {
  'edit': function(msg) {
    // console.log('edit: ', msg.cm);
  },
}

io = client(2222);
out1 = makeText("out1");
ed1 = makeMirror("ed1", io.output, io.input, out1);
ed1.add(editHandlers);
