var _eval = require('eval');
var argv = require('minimist')(process.argv.slice(2));
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite('Sorting')

function trim (str) {
   return str.split('\\n').join(' ').replace(/\s{2,}/g, ' ').replace(/\s*$/, '');
}

var code = trim(argv.code + " module.exports=" + argv.func1);
var compareCode = trim(argv.compareCode+ " module.exports=" + argv.func2);

var func = _eval(code);
var otherFunc = _eval(compareCode)
var input = _eval(" module.exports="+argv.input);

suite.add(argv.func2, function () {
   otherFunc(input);
}, {maxTime: 1})
.add(argv.func1, function() {
    func(input);
}, {maxTime: 1})
.on('complete', function() {
   var thisArr = Array.from(this);
   var results = [];
   thisArr.forEach(function (bench) {
      delete bench.stats.sample;
      results.push({name: bench.name, stats: bench.stats, hz: bench.hz});
   })
   console.log(JSON.stringify(results));
})
.run();