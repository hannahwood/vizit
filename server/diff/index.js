require('colors')
var jsdiff = require('diff');

var one = `function fact(n) {
	if (n == 0) {
		return 1;
	}
	else {
		return n * fact(n-1);
	}
}
fact(3);
fact(3);`;

var other = `function fact(n) {
	if (n === 0) {
		return 1;
	}
	else {
		return n * fact(n-1);

	}
}
fact(7);`;


var diff = jsdiff.diffTrimmedLines(one, other);
var count = 0;
console.log(diff)
diff.forEach(function(part){
	count += part.count 
	// if(part.added || part.removed){
		var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
		process.stderr.write(count + " " + part.value[color]);
		if(part.removed) count -= 1
	// }
});
