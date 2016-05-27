app.factory('ExampleRuntimeCodeFactory', function() {
    return [{
        func1:`function fibonacci(n) {
    if(n <= 2) {
        return 1;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
func1Name: `fibonacci`,
func2:`function memFibonacci(n, cache) {
    cache = cache || {};
    if(cache[n]){
        return cache[n];
    } else {
        if(n <= 2) {
            return 1;
        } else {
            cache[n] = memFibonacci(n - 1, cache) + memFibonacci(n - 2, cache);
        }    
    }
    return cache[n]
}`,
func2Name: `memFibonacci`,
inputs: `3,6,9,11,13`
    },{
        func1: `function bubbleSort(array) {
  var length = array.length;
  for (var i = (length - 1); i >= 0; i--) {
    for (var j = (length - i); j > 0; j--) {
      if(array[j] < array[j-1]) {
        var tmp = array[j];
        array[j] = array[j-1];
        array[j-1] = tmp;
      }
    }        
  }
  return array
}`,
func1Name: `bubbleSort`,
func2: `function builtInSort(array){
    return array.sort()
}`,
func2Name:`builtInSort`,
inputs:`[4,7,6,5,2,9,0,8,7],
[2,4,3,7,9,6,1,7,6,4,5,7,2,9,0],
[7,8,9,6,5,3,6,2,3,5,7,9,6,5,4,4,6,1,8,3,0,6],
[6,5,3,6,2,3,4,3,7,9,6,1,7,6,4,5,7,2,9,0,3,6,2,3,5,6,3,1],
[7,8,9,6,5,3,6,2,3,5,7,9,6,5,4,4,6,1,8,3,0,6,2,4,3,7,9,6,1,7,6,4,5,7,2,9,0],
[7,8,9,6,5,3,6,2,3,5,7,9,6,5,4,4,6,1,8,3,0,6,2,4,3,7,9,6,1,7,6,4,5,7,2,9,0,7,8,9,6,5,3,6,2,3,5,7,9,6,5,4,4,6,1,8,3,0,7,8,9]`
    }]
});
