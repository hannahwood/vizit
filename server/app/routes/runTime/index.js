var router = require('express').Router();
var child_process = require('child_process');
module.exports = router;

function sendResult (res, err, stdout, stderr) {
   res.send(stdout);
}

router.post('/', function (req,res,next) {
   child_process.execFile('docker', ['run',
               '--rm',
               '--user=netuser',
               '--net=none',
               '--cap-drop',
               'all',
               'vizit:v1',
               'node',
               '/tmp/javascript/testing.js',
               '--code='+req.body.code,
               '--compareCode='+req.body.compareCode,
               '--input='+req.body.input
               ], {killSignal: 'SIGINT'}, sendResult.bind(null,res));
})