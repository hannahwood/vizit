app.controller('HomeCtrl', function($scope, VisualizeCodeFactory, $document) {

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

	// $scope.render = VisualizeCodeFactory.executionVisualizer.renderDataStructures;
      $scope.selection = 'edit';
      // $scope.trace = [];
      // $scope.data = [];
      // $scope.renderer = 'bar';
      $scope.submitCode = function(code) {
        VisualizeCodeFactory.submitCode(code)
        .then(function(response) {
        	console.log(response.trace[0]);
        	if (response.trace[0].event === "uncaught_exception") {
        		throw new Error(response.trace[0].exception_msg);
        	}
          $scope.trace = response.trace;
          return new VisualizeCodeFactory.executionVisualizer("pyOutputPane", response);
        })
        .catch(function(err) {
			$('#error').html('<div class="error">' + err + '</div>');
        });
      };

      $scope.set = function(selection) {
        $scope.selection = selection;
      };

    });

app.directive('visualize', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/home/visualize.html'
  };
});
