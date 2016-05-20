var router = require('express').Router();
var child_process = require('child_process');
var _eval = require('eval');
module.exports = router;

function sendResult (res, err, stdout, stderr) {
   res.send(stdout);
}

router.post('/', function (req,res,next) {
   // console.log(typeof req.body.input, req.body.input)
   // var input = _eval(req.body.input);
   // console.log(typeof input, input)
   console.log(req.body)
   var args = ['run',
               '--rm',
               '--user=netuser',
               '--net=none',
               '--cap-drop',
               'all',
               'vizit:v1',
               'node',
               '/tmp/javascript/testing.js',
               '--code='+req.body.code,
               '--func1='+req.body.func1,
               '--input='+req.body.input
               ]
   if(req.body.compareCode){
      args.push('--compareCode='+req.body.compareCode)
      args.push('--func2='+req.body.func2)
   }
   console.log(args)
   child_process.execFile('docker', args, {killSignal: 'SIGINT'}, sendResult.bind(null,res));
})