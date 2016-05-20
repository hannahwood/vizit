var _eval = require('eval');
var argv = require('minimist')(process.argv.slice(2));
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('Sorting')

function trim (str) {
   return str.split('\\n').join(' ').replace(/\s{2,}/g, ' ').replace(/\s*$/, '');
}

argv.code = trim(argv.code);
// argv.compareCode = trim(argv.compareCode);

var func = eval(argv.code);
// var otherFunc = eval(argv.compareCode)
var arr = [1,4,2,5,3,1,4,2,5,3,1,4,2,5,3,1,4,2,5,3,1,4,2,5,3,1,4,2,5,3,1,4,2,5,3,1,4,2,5,3];

// function toStringBench() {
//     var me = this,
//         error = me.error,
//         hz = me.hz,
//         id = me.id,
//         stats = me.stats,
//         size = stats.sample.length,
//         pm = support.java ? '+/-' : '\xb1',
//         result = me.name || (isNaN(id) ? id : '<Test #' + id + '>');

//     if (error) {
//       result += ': ' + join(error);
//     } else {
//       result += ' x ' + formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec ' + pm +
//         stats.rme.toFixed(2) + '% (' + size + ' run' + (size == 1 ? '' : 's') + ' sampled)';
//     }
//     return result;
//   }

suite.add('MergeSort', function() {
    func(arr);
}, {maxTime: .1})
// suite.add('BubbleSort', function () {
//    otherFunc(arr);
// }, {maxTime: .1})
// .on('cycle', function(event) {
//    console.log(event.target.toString());
// })
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