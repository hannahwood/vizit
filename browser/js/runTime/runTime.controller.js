app.controller('RunTimeCtrl', function($scope, $rootScope, $mdDialog, $compile, RuntimeFactory) {
    $scope.compare = false;
    $scope.runTime = {
        code: `function memFibonacci(n, cache) {
  cache = cache || {};
  if(cache[n]) {
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
        compareCode: `function fibonacci(n){
  if(n <= 2) {
    return 1;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}`,
        func1: "memFibonacci",
        func2: "fibonacci",
        input: "6,8,10,12",
        // code : `function sorter(arr){return arr.sort();}`,
        // compareCode : `function sorter2(arr){return arr.reverse().reverse().sort();}`,
        // func1 : "sorter",
        // func2 : "sorter2",
        // input : "[1,2,3,4],[1,2,3],[3,4,2,1,4]"
    };

    $scope.makeGraphData = function() {
        debugger;
        var inputSizes = $scope.results[0].input.map(param => typeof param === 'number' ? param : param.length)
        var visData = [];
        var numFunc = $scope.results.length / inputSizes.length;
        var range = inputSizes.slice();
        range.sort((a, b) => a - b);
        $scope.xRange = [range[0] - 2, range[range.length - 1] + 2];
        $scope.yRange = [0, -Infinity];

        $scope.results.forEach(function(benchmark, i) {
            var dataIndex = visData.findIndex(el => el.key === benchmark.name);
            if (dataIndex === -1) {
                visData.push({ key: benchmark.name, values: [] });
                dataIndex = visData.length - 1;
            }
            if (benchmark.stats.mean > $scope.yRange[1]) {
                $scope.yRange[1] = benchmark.stats.mean;
            }
            visData[dataIndex].values.push({
                'inputSize': inputSizes[Math.floor(i / numFunc)],
                'runtime': (benchmark.stats.mean * 1000).toFixed(5)
            });
        });
        $scope.yRange[1] *= 1000;
        $scope.yRange[1] += $scope.yRange[1] * .1;
        $scope.yRange[1] = $scope.yRange[1].toFixed(4);
        $scope.graphData = visData;
        console.log($scope.xRange, $scope.yRange);
    };

    // $scope.runTime = {
    //    func1Parameters: [{type: '', name: ''}],
    //    func2Parameters: [{type: '', name: ''}],
    //    formType: 'Form'
    // }
    //  $scope.showAlert = function(ev,text) {
    //    $mdDialog.show(
    //     $mdDialog.alert()
    //     .parent(angular.element(document.querySelector('#popupContainer')))
    //     .clickOutsideToClose(true)
    //     .title('Runtime Analysis')
    //     .textContent($scope.text)
    //     .ariaLabel('Alert Dialog Demo')
    //     .ok('Got it!')
    //     .targetEvent(ev)
    //     );
    // };
    $scope.submit = function(params) {
        var data = angular.copy(params);
        $scope.progress = true;
        $scope.hasError = false;
        if (!$scope.compare) {
            delete data.compareCode;
            delete data.func2;
        }
        console.log(data);
        return RuntimeFactory.submit(data)
            .then(function(response) {
                console.log(response)
                if ($scope.compare) {
                    //$scope.results = response.sort((a,b) => b.hz > a.hz)
                    $scope.results = response
                    $scope.makeGraphData();
                    $scope.add()
                        //$scope.text = $scope.results[0].name + " is " + ($scope.results[0].hz/$scope.results[1].hz).toFixed(2) + "x faster than " + $scope.results[1].name
                } else {
                    $scope.results = response
                    $scope.makeGraphData();
                    $scope.add()
                        //$scope.text = $scope.results[0].name + " is running at a speed of " + $scope.results.reduce((a,b)=>a+b.hz,0) + " per second"
                }
                // $scope.showAlert()
                $scope.progress = false;
            })
            .catch(function(err) {
                $scope.hasError = true;
                $scope.progress = false;
            });
    }

    $scope.func2Params = false;

    $scope.inputTypes = ['String', 'Number', 'Array']

    $scope.addParam = function() {
        $scope.runTime.parameters.push('');
    }

    $scope.removeParam = function(index) {
        $scope.runTime.parameters.splice(index, 1);
    }

    $scope.add = function() {
        $scope.options = {
            chart: {
                margin: {
                    top: 100,
                    left: 100
                },
                type: 'scatterChart',
                x: function(d) {
                    return (d.inputSize);
                },
                y: function(d) {
                    return d.runtime;
                },
                showValues: true,
                // transitionDuration: 50,
                showYAxis: true,
                showXAxis: true,
                forceY: $scope.yRange,
                forceX: $scope.xRange,
                xAxis: {
                    // tickPadding: 0,
                    axisLabel: 'input size',
                    tickFormat: d3.format(',f')
                },
                yAxis: {
                    // tickPadding: 0,
                    axisLabel: 'time (milliseconds)',
                    tickFormat: d3.format('.2f')
                },
                //color: $scope.colorFunction()
            }
        };
        var graph = angular.element(document.createElement('nvd3'));
        graph[0].setAttribute('options', 'options');
        graph[0].setAttribute('data', 'graphData');
        graph[0].setAttribute('api', 'api');
        var el = $compile(graph)($scope);
        angular.element(scatter).prepend(el);
    };

    $scope.removeGraph = function() {
        $scope.graphData = undefined;
        var scatterDiv = document.getElementById("scatter");
        while (scatterDiv.firstChild) {
            scatterDiv.removeChild(scatterDiv.firstChild);
        }
    }










});
