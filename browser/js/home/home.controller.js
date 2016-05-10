app.controller('HomeCtrl', function($scope, VisualizeCodeFactory){
  $scope.code = {};
  $scope.submitCode = VisualizeCodeFactory.submitCode;
});