_ = require('underscore');
var client = require('../base/client');
var makeEditor = require('../editor/sync-editor');

var editHandlers = {
  'edit': function(msg) {
    // console.log('edit: ', msg.cm);
  },
}

io = client(2222);
ed1 = makeEditor("ed1", io.output, io.input);
ed1.add(editHandlers);
