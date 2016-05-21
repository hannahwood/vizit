var _eval = require('eval');
var argv = require('minimist')(process.argv.slice(2));
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite('Sorting')

function trim (str) {
	return str.split('\\n').join(' ').replace(/\s{2,}/g, ' ').replace(/\s*$/, '');
}

var code = trim(argv.code + " module.exports=" + argv.func1);
var compareCode = argv.func2 && trim(argv.compareCode+ " module.exports=" + argv.func2);

var func = _eval(code);
var otherFunc = compareCode && _eval(compareCode)
var inputs = _eval(" module.exports=["+argv.input+"]");

inputs.forEach(input => {
	suite.add(argv.func1, function () {
		func(input);
	}, {maxTime: .1})
	if(otherFunc){
		suite.add(argv.func2, function() {
			otherFunc(input);
		}, {maxTime: .1})	
	}
})

suite.on('complete', function() {
	var thisArr = Array.from(this);
	var results = [];
	thisArr.forEach(function (bench) {
		delete bench.stats.sample;
		results.push({name: bench.name, stats: bench.stats, hz: bench.hz, input: inputs});
	})
	console.log(JSON.stringify(results));
})

suite.run();