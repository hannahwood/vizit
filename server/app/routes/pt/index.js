'use strict';
/*

Online Python Tutor
https://github.com/pgbovine/OnlinePythonTutor/

Copyright (C) Philip J. Guo (philip@pgbovine.net)

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var child_process = require('child_process');
var util = require('util');

var router = require('express')();
module.exports = router;

var TIMEOUT_SECS = 3;

router.post('/exec_js', execHandler);

function postExecHandler(res, err, stdout, stderr) {
  if (err) {
    console.log('postExecHandler', util.inspect(err, {depth: null}));
    var errTrace = {code: '', trace: [{'event': 'uncaught_exception'}]};
    errTrace.trace[0].exception_msg = err.killed ? 'Timeout error. Your code ran for more than ' + TIMEOUT_SECS + ' seconds. Please shorten and try again.' : 'Unknown error. We apologize for the inconvenience.';
    res.send(JSON.stringify(errTrace));
  }
  else res.send(stdout);
}

function execHandler(req, res) {
  var exeFile = '/usr/local/bin/docker'; // absolute path to docker executable
  var args = ['run', '--rm', '--user=netuser', '--net=none', '--cap-drop', 'all', 'pgbovine/cokapi:v1',
              '/tmp/javascript/node-v6.0.0-linux-x64/bin/node', // custom Node.js version
              '--expose-debug-as=Debug', '/tmp/javascript/jslogger.js',
              '--jsondump=true', '--code='+req.body.user_script
              ];
  child_process.execFile(exeFile, args,
   {timeout: TIMEOUT_SECS * 1000,
    maxBuffer: 5000 * 1024,
    killSignal: 'SIGINT'},
    postExecHandler.bind(null, res));
}
