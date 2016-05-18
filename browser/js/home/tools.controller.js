app.controller('ToolsCtrl', function($scope, $state, $rootScope){

  // current state
  $scope.currentState = function(){
    return $state.current.name
  }




})
