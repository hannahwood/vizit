app.controller('RunTimeCtrl', function($scope, $rootScope, $mdDialog, $compile, RuntimeFactory) {
    $scope.compare = false;

    $scope.makeGraphData = function() {
        var inputs  = $scope.results[0].input;
        var numInput = typeof  $scope.results[0].input[0] === 'number';
        var inputSizes = $scope.results[0].input.map(param => numInput ? param : param.length);
        var visData = [];
        var tableData = [];
        var numFunc = $scope.results.length / inputSizes.length;
        var range = inputSizes.slice();
        range.sort((a, b) => a - b);
        $scope.xRange = [Math.floor(range[0] - 1),Math.ceil(range[range.length - 1] + 1)];
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

    $scope.submit = function(params) {
        var data = angular.copy(params);
        $scope.progress = true;
        $scope.hasError = false;
        if (!$scope.compare) {
            delete data.compareCode;
            delete data.func2;
        }
        $scope.func1 = data.func1 || null;
        $scope.func2 = data.func2 || null;
        return RuntimeFactory.submit(data)
        .then(function(response) {
            if ($scope.compare) {
                    $scope.results = response
                    $scope.makeGraphData();
                    $scope.add()
                    } else {
                        $scope.results = response
                        $scope.makeGraphData();
                        $scope.add()
                    }
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
               showLegend: false,
               margin: {
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
                showYAxis: true,
                showXAxis: true,
                forceY: $scope.yRange,
                forceX: $scope.xRange,
                xAxis: {
                  ticks: Math.min(10,$scope.xRange[1]-$scope.xRange[0]),
                  axisLabel: 'input size',
                },
                yAxis: {
                  axisLabelDistance: 20,
                  ticks: 5,
                    axisLabel: 'time (milliseconds)',
                    tickFormat: d3.format('.2e')
                },
                color:['#268BD2','#D33682']
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
