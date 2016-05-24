app.controller('RunTimeCtrl', function($scope, $rootScope, $mdDialog, $compile, RuntimeFactory) {
    $scope.compare = false;
    $scope.runTime = {
        compareCode : `function builtinSort(arr){
            return arr.sort();
        }`,
        code : `function mergeSort (arr) {
          if (arr.length < 2) return arr;
          var left = arr.slice(0,arr.length/2);
          var right = arr.slice(arr.length/2);
          return merge(mergeSort(left), mergeSort(right));
      }

      function merge (left, right) {
          var merged = [];
          var i = 0;
          var j = 0;
          while (i < left.length && j < right.length) {
            merged.push(left[i] < right[j] ? left[i++] : right[j++]);
        }
        return merged.concat(left.slice(i), right.slice(j));
    }
    `,
    func2 : "builtinSort",
    func1 : "mergeSort",
    input : "[9,5,6],[1,9,0,5,4],[3,4,2,1,4,5,0],[9,3,1,4,5,8,3,2,0],[9,2,7,5,3,7,8,9,0,0,7,3]"
};

$scope.makeGraphData = function() {
    var inputs  = $scope.results[0].input;
    var numInput = typeof param === 'number';
    var inputSizes = $scope.results[0].input.map(param => numInput ? param : param.length);
    var visData = [];
    var tableData = [];
    var numFunc = $scope.results.length / inputSizes.length;
    var range = inputSizes.slice();
    range.sort((a, b) => a - b);
    $scope.xRange = [range[0] - 1, range[range.length - 1] + 1];
    $scope.yRange = [0, -Infinity];

    $scope.results.forEach(function(benchmark, i) {
        var dataIndex = visData.findIndex(el => el.key === benchmark.name);
        var tableIndex = tableData.findIndex(el => el.input === inputs[Math.floor(i / numFunc)]);
        if (dataIndex === -1) {
            visData.push({ key: benchmark.name, values: [] });
            dataIndex = visData.length - 1;
        }
        if (tableIndex === -1) {
            tableData.push({ input: inputs[Math.floor(i / numFunc)], funcs: [] });
            tableIndex = tableData.length - 1;
        }
        if (benchmark.stats.mean > $scope.yRange[1]) {
            $scope.yRange[1] = benchmark.stats.mean;
        }
            // if (benchmark.stats.mean < $scope.yRange[0]) {
            //     $scope.yRange[0] = benchmark.stats.mean;
            // }
            visData[dataIndex].values.push({
                'inputSize': inputSizes[Math.floor(i / numFunc)],
                'runtime': (benchmark.stats.mean*1000)
            });
            tableData[tableIndex].funcs.push(benchmark);
        });
    tableData.sort((a,b) => {
        var diff = numInput ? a.input - a.input : a.input.length - b.input.length;
        return diff;
    });
    tableData.forEach(el => el.funcs.sort((a,b) => a.stats.mean - b.stats.mean));
    $scope.yRange[1] *= 1100;
    $scope.graphData = visData;
    $scope.tableData = tableData;
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
        debugger;
        var data = angular.copy(params);
        $scope.progress = true;
        $scope.hasError = false;
        if (!$scope.compare) {
            delete data.compareCode;
            delete data.func2;
        }
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
               // "zoom":{  
               //    "enabled":true,
               //    "scaleExtent":[  
               //       1,
               //       10
               //    ],
               //    "useFixedDomain":false,
               //    "useNiceScale":false,
               //    "horizontalOff":false,
               //    "verticalOff":false,
               //    "unzoomEventType":"dblclick.zoom"
               // },
               // interactive: true,
               showLegend: false,
               margin: {
                    // top: 100,
                    left: 130
                },
                type: 'scatterChart',
                x: function(d) {
                    return d.inputSize;
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
                  ticks: Math.min(10,$scope.xRange[1]-$scope.xRange[0]),
                  // tickPadding: 0,
                  axisLabel: 'input size',
                    //tickFormat: d3.format(',f')
                },
                yAxis: {
                  axisLabelDistance: 20,
                  ticks: 5,
                    // tickPadding: 0,
                    axisLabel: 'time (milliseconds)',
                    tickFormat: d3.format('.2e')
                },
                //color: $scope.colorFunction()
            }
        };
        var graph = angular.element(document.createElement('nvd3'));
        graph[0].setAttribute('id', 'graph');
        graph[0].setAttribute('options', 'options');
        graph[0].setAttribute('data', 'graphData');
        graph[0].setAttribute('api', 'api');
        var el = $compile(graph)($scope);
        angular.element(scatter).prepend(el);
    };

    $scope.removeGraph = function() {
        $scope.graphData = undefined;
        $scope.tableData = undefined;
        var scatterDiv = document.getElementById("scatter");
        while (scatterDiv.firstChild) {
            scatterDiv.removeChild(scatterDiv.firstChild);
        }
    }










});
