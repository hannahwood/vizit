app.controller('HomeCtrl', function($scope, VisualizeCodeFactory) {
    $scope.code = '// input your code here and click on "Visualize"\
    \nvar x =4;\
	\nfunction y(num) {\
    \n    return x*num;\
	\n}\
	\ny(34);\
	\n\nconsole.log("asda");\
	\n\nconsole.log("WHUTWHUT");\
	\n\nconsole.log("sbdhjczkcbjhhxjskjnkjzxnckjznxkcjn");\
	\n\nfor (var i = 0; i < 10; i++) {\
    \n    console.log("I have " + i + " bananas!");\
	\n}'
  $scope.selection = 'edit';
  $scope.trace = [];
  $scope.graphData = [];
  $scope.renderer = 'bar';
  $scope.submitCode = function(code) {
        VisualizeCodeFactory.submitCode(code)
        .then(function(response) {
          debugger;
          $scope.trace = response.trace;
          $scope.graphData = $scope.makeGraphData();
          console.log($scope.graphData)
          return new VisualizeCodeFactory.executionVisualizer("pyOutputPane", response);
        });
      };

      $scope.set = function(selection) {
        $scope.selection = selection;
      };

      $scope.makeGraphData = function(){
        debugger;
        var visData = [];
        $scope.trace
        .forEach(function(el,i){
          debugger;
          visData.push({
            x: i,
            y: el.stack_to_render.length
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
