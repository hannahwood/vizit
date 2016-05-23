var router = require('express').Router();
var child_process = require('child_process');
var _eval = require('eval');
module.exports = router;

function sendResult (res, err, stdout, stderr) {
   res.send(stdout);
}

router.post('/', function (req,res,next) {
   var args = ['run',
               '--rm',
               '--user=netuser',
               '--net=none',
               '--cap-drop',
               'all',
               'jasonunger/vizit:v1',
               'node',
               '/tmp/javascript/testing.js',
               '--input='+req.body.input,
               '--code='+req.body.code,
               '--func1='+req.body.func1
               ]
   if(req.body.compareCode){
      args.push('--compareCode='+req.body.compareCode)
      args.push('--func2='+req.body.func2)
   }
   child_process.execFile('docker', args, {killSignal: 'SIGINT'}, sendResult.bind(null,res));
})