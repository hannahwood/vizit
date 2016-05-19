var suite = new Benchmark.Suite('Sorting');

function mergeSort (array) {
  if (array.length < 2) return array; // base case
  var splits = split(array),
      left = splits[0],
      right = splits[1];
  return merge(mergeSort(left), mergeSort(right)); // merge sorted!
}

function split (array) {
  var center = array.length / 2;
  var left = array.slice(0, center);
  var right = array.slice(center);
  return [left, right];
}

function merge (left, right) {
  var merged = [],
      leftIdx = 0,
      rightIdx = 0;
  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx] < right[rightIdx]) {
      merged.push(left[leftIdx++]);
    } else {
      merged.push(right[rightIdx++]);
    }
  }
  for (; leftIdx < left.length; leftIdx++) merged.push(left[leftIdx]);
  for (; rightIdx < right.length; rightIdx++) merged.push(right[rightIdx]);
  return merged;
}

function bubbleSort (array) {
  var sorted = false;
  for (var end = array.length; end > 0 && !sorted; end--) { // passes
    sorted = true; // assume until proven incorrect
    for (var j = 0; j < end; j++) { // bubbling
      if (!inOrder(array, j)) {
        swap(array, j);
        sorted = false;
      }
    }
  }
  return array;
}

function inOrder (array, index) { // pure function
  if (index === array.length - 1) return true;
  return array[index] < array[index + 1];
}

function swap (array, index) { // side effects
  var oldLeftValue = array[index];
  array[index] = array[index + 1];
  array[index + 1] = oldLeftValue;
}

var arr = [1,2,3,2,6,7,5,3,3];

suite.add('BubbleSort#test', function() {
    bubbleSort(arr);
},{ 'maxTime': .1 })
.add('MergeSort#indexOf', function() {
    mergeSort(arr);
},{ 'maxTime': .1 })
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });