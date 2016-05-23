require('colors')
var jsdiff = require('diff');

var one = '\
\nfunction fact(n) {\
\n	if (n == 0) {\
\n		return 1;\
\n	}\
\n	else {\
\n		return n * fact(n-1);\
\n	}\
\n}\
\n\
\nfact(3);\
\nfact(3);';

var other = '\
\nfunction fact(n) {\
\n	if (n === 0) {\
\n		return 1;\
\n	}\
\n	else {\
\n		return n * fact(n-1);\
\n\
\n	}\
\n}\
\n\
\nfact(7);';


var diff = jsdiff.diffTrimmedLines(one, other,{newlineIsToken: true});
var count = 0;
console.log(diff)
diff.forEach(function(part){
	count += part.count 
	// if(part.added || part.removed){
		var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
		process.stderr.write(count + " " + part.value[color]+"\n");
		if(part.removed) count -= 1
	// }
});
