app.controller('SignUpCtrl', function($scope, $mdDialog, AuthService, $state) {

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
  $scope.signup = {};
  $scope.error = null;

  $scope.sendSignup = function (signupInfo) {

      $scope.error = null;
      
      AuthService.signup(signupInfo).then(function () {
          $mdDialog.hide();
          $state.go('home');
      }).catch(function (err) {
          $scope.error = err.data;
      });

  };
});