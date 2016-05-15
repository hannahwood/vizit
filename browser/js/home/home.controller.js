app.filter('titlecase', function() {
    return function(input) {
        return input.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
});

app.controller('HomeCtrl', function($scope, $compile, VisualizeCodeFactory) {
    $scope.code = '// Adapted from Effective JavaScript\
\nfunction Actor(x, y) {\
\n  this.x = x;\
\n  this.y = y;\
\n}\
\n\
\nActor.prototype.moveTo = function(x, y) {\
\n  this.x = x;\
\n  this.y = y;\
\n}\
\n\
\nfunction SpaceShip(x, y) {\
\n  Actor.call(this, x, y);\
\n  this.points = 0;\
\n}\
\n\
\nSpaceShip.prototype = Object.create(Actor.prototype); // inherit!\
\nSpaceShip.prototype.type = "spaceship";\
\nSpaceShip.prototype.scorePoint = function() {\
\n  this.points++;\
\n}\
\n\
\nvar s = new SpaceShip(10, 20);\
\ns.moveTo(30, 40);\
\ns.scorePoint();\
\ns.scorePoint();'
    $scope.selection = 'edit';
    $scope.progress = false;
    $scope.trace = [];
    $scope.data = [];
    $scope.colorFunction = function() {
        return function(d, i) {
            var color = i === VisualizeCodeFactory.executionVisualizer.prototype.currentStep() ? 'red' : 'gray';
            return color;
        };
    };
    $scope.options = {
        chart: {
            width: 500,
            height: 200,
            duration: 0,
            type: 'discreteBarChart',
            x: function(d) {
                return d.step
            },
            y: function(d) {
                return d.height
            },
            showValues: false,
            transitionDuration: 50,
            xAxis: {
                axisLabel: 'Step',
                tickFormat: d3.format(',f')
            },
            yAxis: {
                ticks: 10,
                axisLabel: 'Call Stack Size',
                // axisLabelDistance: .2,
                tickFormat: d3.format(',f')
            },
            color: $scope.colorFunction()
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
        graph[0].setAttribute('api', 'api')
        var el = $compile(graph)($scope);
        angular.element(graphPlaceholder).prepend(el);
    };


    $scope.set = function(selection) {
        $scope.selection = selection;
    };

    $("body").keyup(function(e) {
        if (e.keyCode == 37 || e.keyCode == 39) {
        $scope.api.refresh();
        }
    });

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
    };
});
