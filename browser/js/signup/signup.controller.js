app.controller('SignUpController', function($scope, $mdDialog, AuthService, $state) {


  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  $scope.login = {};
  $scope.error = null;

  $scope.sendLogin = function (loginInfo) {

      $scope.error = null;

      AuthService.login(loginInfo).then(function () {
          $state.go('home');
      }).catch(function () {
          $scope.error = 'Invalid login credentials.';
      });

      $mdDialog.hide();

  };
});