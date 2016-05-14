app.filter('titlecase', function() {
    return function(input) {
        return input.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
});

app.controller('HomeCtrl', function($scope, $compile, VisualizeCodeFactory) {
    $scope.code = '// input your code here and click on "Visualize"\
    \nfunction fact(n) {\
  \nif (n == 0) {\
    \n   return 1;\
  \n}\
  \nelse {\
    \n   console.log("THERE ARE  " + n + " oranges!!!");\
    \n   return n * fact(n-1);\
  \n}\
\n}\
\n\nfact(10);'
    $scope.render = VisualizeCodeFactory.executionVisualizer.renderDataStructures;
    $scope.selection = 'edit';
    $scope.progress = false;
    $scope.trace = [];
    $scope.data = [];
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            x: function(d) {
                return d.step
            },
            y: function(d) {
                return d.height
            },
            showValues: true,
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 30
            }
        }
    };
    $scope.renderer = 'bar';
    // giant function run on 'Visualize'
    $scope.submitCode = function(code) {
        $scope.progress = true;
        // error variable to determine error's ng-show
        $scope.hasError = false;
        // #1 submit code: to catch any initial errors
        return VisualizeCodeFactory.submitCode(code)
            .then(function(response) {
                $scope.set('visualize');

                // catch initial errors
                if (response.trace[0].event === "uncaught_exception") {
                    $scope.hasError = true;
                    $scope.errorMessage = response.trace[0].exception_msg;
                    $scope.set('edit');
                    throw new Error(response.trace[0].exception_msg);
                }

                // #2 submit code: because the first time doesn't render everything
                // to the visualize page
                // (very hacky, but it was the only way I could render everything correctly)
                return VisualizeCodeFactory.submitCode(code);

            }).then(function(response) {
                $scope.trace = response.trace;
                $scope.data = $scope.makeGraphData();
                $scope.newViz = new VisualizeCodeFactory.executionVisualizer("pyOutputPane", response);
                $scope.add();
                $scope.progress = false;
                return $scope.newViz;
            }).catch(function(err) {
                // $scope.set('edit');
                $scope.hasError = true;
                $scope.progress = false;
                // show caught error on 'visualize' page
                $scope.errorMessage = err.toString();
            });
    };

    $scope.add = function() {
        var graph = angular.element(document.createElement('nvd3'));
        graph[0].setAttribute('options', 'options')
        graph[0].setAttribute('data', 'data')
        graph.on('elementClick', function(e) {});
        var el = $compile(graph)($scope);
        angular.element(graphPlaceholder).prepend(el);
    };

    $scope.set = function(selection) {
        $scope.selection = selection;
    };

    $scope.makeGraphData = function() {
        var visData = [{
            key: "Callstack Size",
            values: []
        }];
        $scope.trace
            .forEach(function(el, i) {
                visData[0].values.push({
                    'step': i,
                    'height': el.stack_to_render.length
                })
            })
        return visData;
    }
});

app.directive('visualize', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/home/visualize.html'
    };
});
