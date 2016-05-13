app.controller('HomeCtrl', function($scope, $compile, VisualizeCodeFactory) {
  $scope.code = '// input your code here and click on "Visualize"\
  \nvar x =4;\
  \nfunction y(num) {\
    \n    return x*num;\
    \n}\
    \ny(34);\
    '
    $scope.selection = 'edit';
    $scope.trace = [];
    $scope.data = [];
    $scope.options = {
      chart: {
        type: 'discreteBarChart',
        x: function(d){ return d.step},
        y: function(d){ return d.height},
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
    $scope.submitCode = function(code) {
      VisualizeCodeFactory.submitCode(code)
      .then(function(response) {
        $scope.trace = response.trace;
        $scope.data = $scope.makeGraphData();
        new VisualizeCodeFactory.executionVisualizer("pyOutputPane", response);
        $scope.add();
        $scope.digest();
      });
    };

    $scope.add = function(){
      var graph = angular.element(document.createElement('nvd3'));
      graph[0].setAttribute('options','options')
      graph[0].setAttribute('data','data')
      graph.on('elementClick', function(e){
        console.log('test')
        // console.log('element: ' + e.value);
        // console.dir(e.point);
      });
      var el = $compile(graph)( $scope );
      angular.element(graphPlaceholder).prepend(el);
      VisualizeCodeFactory.update();
    };

    $scope.set = function(selection) {
      $scope.selection = selection;
    };

    $scope.makeGraphData = function(){
      var visData = [{
        key: "Callstack Size",
        values: []
      }];
      $scope.trace
      .forEach(function(el,i){
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
