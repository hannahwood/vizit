app.controller('HomeCtrl', function($scope, VisualizeCodeFactory){
  $scope.code = '';
  $scope.submitCode = VisualizeCodeFactory.submitCode;
  $scope.selection = 'edit';
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