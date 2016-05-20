# to run on a specific input file: make infile=tests/fact.js
all:
	eslint jslogger.js && node --expose-debug-as=Debug jslogger.js $(infile)

# to run on a specific input file: make trace infile=tests/fact.js
trace:
	eslint jslogger.js && node --expose-debug-as=Debug jslogger.js --jsfile=/Users/Jason/Dev/Fullstack/vizit/ptjavascript/tests/test-trace.js $(infile)

# to run on a specific input file: make pretty infile=tests/fact.js
pretty:
	eslint jslogger.js && node --expose-debug-as=Debug jslogger.js --prettydump=true $(infile)

tspretty:
	eslint jslogger.js && node --expose-debug-as=Debug jslogger.js --prettydump=true --typescript=true $(infile)

test:
	eslint jslogger.js && python golden_test.py --all

diffall:
	eslint jslogger.js && python golden_test.py --diffall