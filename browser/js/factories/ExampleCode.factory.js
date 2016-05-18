app.factory('ExampleCodeFactory', function() {
    return [{
            name: 'Factorial',
            code: `function fact(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * fact(n - 1);
    }
}
fact(3);`
        }, {
            name: 'Inheritance',
            code: `// taken from PythonTutor
function Actor(x, y) {
  this.x = x;
  this.y = y;
}

Actor.prototype.moveTo = function(x, y) {
  this.x = x;
  this.y = y;
}

function SpaceShip(x, y) {
  Actor.call(this, x, y);
  this.points = 0;
}

SpaceShip.prototype = Object.create(Actor.prototype); // inherit!
SpaceShip.prototype.type = "spaceship";
SpaceShip.prototype.scorePoint = function() {
  this.points++;
}

var s = new SpaceShip(10, 20);
s.moveTo(30, 40);
s.scorePoint();
s.scorePoint();`
        },

        {
            name: 'Permutation',
            code: `function permArr(str){
    var dict = [];
    function perm(str,rem){
        if(str==='' && dict.indexOf(rem) === -1) dict.push(rem)
        else{
            for(var i = 0; i<str.length; i++){
                perm(str.slice(0,i)+str.substring(i+1),rem + str[i]);
            }
        }
    }
    perm(str,'');
    return dict;
}

console.log(permArr('viz'));`
        }, {
            name: 'Fibonacci',
            code: `function fibonacci(n) {
    if(n <= 2) {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

fibonacci(10)`
        },

        {
            name: 'Fibonacci with Memoization',
            code: `function fibonacci(n, cache) {
    cache = cache || {};
    if(cache[n]){
        return cache[n];
    } else {
        if(n <= 2) {
            return 1;
        } else {
            cache[n] = fibonacci(n - 1, cache) + fibonacci(n - 2, cache);
        }    
    }
    return cache[n]
}

fibonacci(10);`
        },

        {
            name: 'Data Types',
            code: `// taken from PythonTutor
var intNum = 42;
var floatNum = 3.14159;
var nanNum = NaN;
var infNum = Infinity;
var ninfNum = -Infinity;

var str = "hello world";

var boolTrue = true;
var boolFalse = false;

var nullVal = null;
var undefVal = undefined;

var lst = ['a', 'b', 3, 4, 5, 'f'];

var obj = {name: 'John', age: 35, hasChildren: true};

var i = 5;
var obj_lst = [i, {foo: i+1, poop: [1, 2, 3]}, {bar: i+2}];

obj.name = 'Jane';`
        },

        {
            name: 'Closure',
            code: `// taken from PythonTutor
var globalZ = 10;

function foo(y) {
    function bar(x) {
        globalZ += 100;
        return x + y + globalZ;
    }
    return bar;
}

var b = foo(1);
b(2);`
        },

        {
            name: 'Shadowing',
            code: `// taken from PythonTutor
var x = 10; // global
function foo() {
  var x = 10;
  function bar() {
    var y = x;
    x *= 2;
    console.log(x, y);
  }
  return bar;
}
var b = foo();
b();`
        },

        {
            name: 'Linked List',
            code: `function Node (value, next) {
    this.value = value;
    this.next = next || null;
}

function LinkedList () {
    this.head = null;
}

LinkedList.prototype.add = function (val) {
    if (!this.head) this.head = new Node(val);
    else {
        this.head = new Node(val, this.head);
    }
}

var ll = new LinkedList();
ll.add(1);
ll.add(2);
ll.add(3);`
        },

        {
            name: 'Greatest Common Denominator',
            code: `function gcd(x, y, depth) {
    depth = depth || 1;
    var result = x;
    if (y !== 0) {
        var indent = '**'.repeat(depth);
        console.log(indent + ' About to recursively call gcd(' + y + ', ' + x % y + ')');
        result = gcd(y, x % y, depth + 1);
        console.log(indent + ' result is ' + result);
    }
    return result;
}

function main() {
    var x = 77;
    var y = 28;
    console.log('Finding gcd(' + x + ', ' + y + ')');
    var g = gcd(x, y);
    console.log('Greatest common denominator of ' + x + ', ' + y + ' = ' + g);
}

main();`
        }
    ]
});
