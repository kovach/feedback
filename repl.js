_ = require('underscore');
var repl = require('repl');
var spawn = require('child_process').spawn;

ghci = spawn('ghci');
ghci.stdin.write('22 * 2\n', 'utf8');
ghci_out = "";
ghci.stdout.on('data', function(data) {
  ghci_out += data;
  console.log('------------');
  console.log(data+"");
});


repl.start({
  prompt: "→ ",
  input: process.stdin,
  output: process.stdout
});
