var _eval = require('eval');
var argv = require('minimist')(process.argv.slice(2));
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('Sorting')

function trim (str) {
   return str.split('\\n').join(' ').replace(/\s{2,}/g, ' ').replace(/\s*$/, '');
}

argv.code = trim(argv.code);
argv.compareCode = trim(argv.compareCode);

var func = _eval(argv.code);
var otherFunc = _eval(argv.compareCode)
var arr = _eval(argv.input);

suite.add('MergeSort', function() {
    func(arr);
}, {maxTime: .1})
suite.add('BubbleSort', function () {
   otherFunc(arr);
}, {maxTime: .1})
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